import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import {
  FlatList, Image, ImageSourcePropType, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BLUE = '#0879C1';
const INK = '#111827';
const MUTED = '#586270';
const PALE = '#E6F3FC';
const BORDER = '#DCE8F2';
const REGULAR = 'DMSans_400Regular';
const SEMIBOLD = 'DMSans_600SemiBold';
const BOLD = 'DMSans_700Bold';

export type Entry = {
  id: string;
  name: string;
  location: string;
  summary: string;
  tags: string[];
  distanceKm: number;
  image?: ImageSourcePropType;
  imageLabel?: string;
};

type Group = {
  label: string;
  options: readonly string[];
  match?: 'all' | 'any';
};

type Filters = Record<string, string[]>;

export default function CareDirectory({ title, singular, icon, entries, groups }: {
  title: string;
  singular: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  entries: Entry[];
  groups: readonly Group[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [draft, setDraft] = useState<Filters | null>(null);
  const [nearest, setNearest] = useState(false);
  const [detail, setDetail] = useState<Entry | null>(null);

  const active = groups.flatMap(group =>
    (filters[group.label] ?? []).map(option => ({ group: group.label, option })),
  );
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = entries.filter(entry => {
    const searchable = [entry.name, entry.location, entry.summary, ...entry.tags].join(' ').toLowerCase();
    return words.every(word => searchable.includes(word)) && groups.every(group => {
      const selected = filters[group.label] ?? [];
      if (selected.length === 0) return true;
      return group.match === 'all'
        ? selected.every(option => entry.tags.includes(option))
        : selected.some(option => entry.tags.includes(option));
    });
  });
  if (nearest) results.sort((first, second) => first.distanceKm - second.distanceKm);

  function toggle(label: string, option: string) {
    setDraft(current => {
      if (current === null) return current;
      const selected = current[label] ?? [];
      return {
        ...current,
        [label]: selected.includes(option)
          ? selected.filter(value => value !== option)
          : [...selected, option],
      };
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.top}>
          <View style={styles.row}>
            {router.canGoBack() && (
              <Pressable accessibilityRole="button" accessibilityLabel="Go back" style={styles.iconButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={22} color={INK} />
              </Pressable>
            )}
            <View style={styles.flex}>
              <Text accessibilityRole="header" style={styles.title}>{title}</Text>
              <Text style={styles.secondary}>Sample directory</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.search}>
              <Ionicons name="search-outline" size={19} color={MUTED} />
              <TextInput
                accessibilityLabel={`Search ${title.toLowerCase()}`}
                placeholder="Search by name, area or service"
                placeholderTextColor={MUTED}
                autoCorrect={false}
                value={query}
                onChangeText={setQuery}
                style={styles.input}
              />
              {!!query && (
                <Pressable accessibilityRole="button" accessibilityLabel="Clear search" style={styles.iconButton} onPress={() => setQuery('')}>
                  <Ionicons name="close-circle-outline" size={18} color={MUTED} />
                </Pressable>
              )}
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Filters, ${active.length} selected`} style={[styles.iconButton, styles.softButton]} onPress={() => setDraft(filters)}>
              <Ionicons name="options-outline" size={19} color={BLUE} />
              <Text style={styles.link}>Filter{active.length ? ` (${active.length})` : ''}</Text>
            </Pressable>
          </View>
        </View>

        <FlatList
          data={results}
          keyExtractor={entry => entry.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {!!active.length && (
                <View style={styles.chips}>
                  {active.map(({ group, option }) => (
                    <Pressable key={`${group}:${option}`} accessibilityRole="button" accessibilityLabel={`Remove ${option} filter`} style={styles.chip} onPress={() => setFilters(current => ({
                      ...current,
                      [group]: (current[group] ?? []).filter(value => value !== option),
                    }))}>
                      <Text style={styles.link}>{option}</Text>
                      <Ionicons name="close" size={15} color={BLUE} />
                    </Pressable>
                  ))}
                </View>
              )}
              <View style={styles.spaceBetween}>
                <Text accessibilityLiveRegion="polite" style={styles.label}>{results.length} {results.length === 1 ? singular : title.toLowerCase()}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={nearest ? 'Sorted by distance. Restore default order' : 'Sort by distance'} style={styles.iconButton} onPress={() => setNearest(value => !value)}>
                  <Ionicons name="swap-vertical-outline" size={17} color={BLUE} />
                  <Text style={styles.link}>{nearest ? 'Sort: Nearest' : 'Sort: Default'}</Text>
                </Pressable>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.tile}>
                  {item.image ? (
                    <Image
                      source={item.image}
                      style={styles.entryImage}
                      resizeMode="contain"
                      accessible={!!item.imageLabel}
                      accessibilityLabel={item.imageLabel}
                    />
                  ) : (
                    <Ionicons name={icon} size={25} color={BLUE} />
                  )}
                </View>
                <View style={styles.flex}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.secondary}>{item.summary}</Text>
                </View>
              </View>
              <View style={styles.footer}>
                <View style={[styles.row, styles.flex]}>
                  <Ionicons name="location-outline" size={17} color={BLUE} />
                  <Text style={[styles.secondary, styles.flex]}>{item.location} · {item.distanceKm} km</Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel={`View details for ${item.name}`} style={styles.primary} onPress={() => setDetail(item)}>
                  <Text style={styles.primaryText}>View details</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={25} color={BLUE} />
              <Text style={styles.name}>No matches</Text>
              <Pressable accessibilityRole="button" style={styles.iconButton} onPress={() => { setQuery(''); setFilters({}); }}>
                <Text style={styles.link}>Clear search and filters</Text>
              </Pressable>
            </View>
          }
        />
      </View>

      <Modal transparent visible={draft !== null} animationType="fade" onRequestClose={() => setDraft(null)}>
        <View style={styles.overlay}>
          <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={() => setDraft(null)} />
          <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.spaceBetween}>
              <Text accessibilityRole="header" style={styles.name}>Filter {title.toLowerCase()}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close filters" style={styles.iconButton} onPress={() => setDraft(null)}>
                <Ionicons name="close" size={22} color={INK} />
              </Pressable>
            </View>
            <ScrollView style={styles.options}>
              {groups.map(group => (
                <View key={group.label} style={styles.group}>
                  <Text accessibilityRole="header" style={styles.label}>{group.label}</Text>
                  <View style={styles.chips}>
                    {group.options.map(option => {
                      const checked = draft?.[group.label]?.includes(option) ?? false;
                      return (
                        <Pressable key={option} accessibilityRole="checkbox" accessibilityState={{ checked }} style={[styles.chip, checked && styles.selected]} onPress={() => toggle(group.label, option)}>
                          <Text style={checked ? styles.primaryText : styles.link}>{option}</Text>
                          {checked && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.row}>
              <Pressable accessibilityRole="button" style={styles.iconButton} onPress={() => setDraft({})}><Text style={styles.link}>Clear all</Text></Pressable>
              <Pressable accessibilityRole="button" style={[styles.primary, styles.flex]} onPress={() => { setFilters(draft ?? {}); setDraft(null); }}>
                <Text style={styles.primaryText}>Apply filters</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal transparent visible={detail !== null} animationType="fade" onRequestClose={() => setDetail(null)}>
        <View style={styles.overlay}>
          <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={() => setDetail(null)} />
          <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.spaceBetween}>
              <Text accessibilityRole="header" style={[styles.name, styles.flex]}>{detail?.name}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close details" style={styles.iconButton} onPress={() => setDetail(null)}>
                <Ionicons name="close" size={22} color={INK} />
              </Pressable>
            </View>
            <Text style={styles.secondary}>{detail?.location} · {detail?.distanceKm} km</Text>
            <ScrollView style={styles.options}>
              {groups.map(group => {
                const values = group.options.filter(option => detail?.tags.includes(option));
                return values.length > 0 && (
                  <View key={group.label} style={styles.group}>
                    <Text style={styles.label}>{group.label}</Text>
                    <Text style={styles.secondary}>{values.join(' · ')}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5FAFD' },
  content: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center' },
  top: { gap: 16, paddingHorizontal: 20, paddingTop: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  flex: { flex: 1, minWidth: 0 },
  title: { fontFamily: BOLD, fontSize: 24, color: INK },
  name: { fontFamily: BOLD, fontSize: 17, color: INK },
  label: { fontFamily: SEMIBOLD, fontSize: 14, color: INK },
  secondary: { fontFamily: REGULAR, fontSize: 13, lineHeight: 19, color: MUTED },
  link: { fontFamily: SEMIBOLD, fontSize: 13, color: '#0569A8' },
  search: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 10, borderWidth: 1, borderColor: BORDER, borderRadius: 8, backgroundColor: '#FFFFFF' },
  input: { flex: 1, minWidth: 0, minHeight: 48, fontFamily: REGULAR, fontSize: 14, color: INK },
  iconButton: { minWidth: 44, minHeight: 44, paddingHorizontal: 6, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' },
  softButton: { minHeight: 48, borderRadius: 8, backgroundColor: PALE },
  list: { paddingHorizontal: 20, paddingVertical: 14 },
  listHeader: { gap: 6, marginBottom: 6 },
  separator: { height: 12 },
  card: { padding: 12, gap: 12, borderRadius: 12, borderWidth: 1, borderColor: BORDER, backgroundColor: '#FFFFFF' },
  tile: { width: 56, height: 56, borderRadius: 12, backgroundColor: PALE, alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 10 },
  primary: { minHeight: 44, borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#FFFFFF', fontFamily: BOLD, fontSize: 13, textAlign: 'center' },
  empty: { alignItems: 'center', gap: 8, paddingTop: 32 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#11182766' },
  sheet: { width: '100%', maxWidth: 560, maxHeight: '85%', padding: 20, gap: 10, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: '#FFFFFF' },
  options: { flexGrow: 0, flexShrink: 1 },
  group: { gap: 8, marginBottom: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { minHeight: 44, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 22, backgroundColor: PALE },
  selected: { backgroundColor: BLUE },
  entryImage: {
    width: 42,
    height: 42,
  },
});
