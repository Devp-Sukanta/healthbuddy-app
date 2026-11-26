import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BLUE = '#0D82CC';
const ACTION = '#0879C1';
const INK = '#111827';
const MUTED = '#586270';
const BORDER = '#D7DCE2';
const PALE = '#EFF8FE';
const REGULAR = 'DMSans_400Regular';
const SEMIBOLD = 'DMSans_600SemiBold';
const BOLD = 'DMSans_700Bold';

const specialties = [
  'General Medicine', 'Gynecology', 'General Surgery', 'Pediatrics',
  'Dermatology', 'Orthopedics',
] as const;

type Specialty = (typeof specialties)[number];
type Doctor = {
  id: string;
  name: string;
  initials: string;
  specialty: Specialty;
  credentials: string;
  experience: number;
  clinic: string;
};

// Replace the sample directory with your clinic data.
const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Arjun Mehta', initials: 'AM', specialty: 'General Medicine', credentials: 'MBBS, MD', experience: 12, clinic: 'City Health Clinic' },
  { id: '2', name: 'Dr. Priya Nair', initials: 'PN', specialty: 'Gynecology', credentials: 'MBBS, MS', experience: 9, clinic: 'Lotus Women’s Clinic' },
  { id: '3', name: 'Dr. Rohan Shah', initials: 'RS', specialty: 'General Surgery', credentials: 'MBBS, MS', experience: 15, clinic: 'City Health Clinic' },
  { id: '4', name: 'Dr. Ananya Rao', initials: 'AR', specialty: 'Pediatrics', credentials: 'MBBS, MD', experience: 8, clinic: 'Little Steps Clinic' },
  { id: '5', name: 'Dr. Neha Kapoor', initials: 'NK', specialty: 'Dermatology', credentials: 'MBBS, MD', experience: 10, clinic: 'City Health Clinic' },
  { id: '6', name: 'Dr. Vikram Iyer', initials: 'VI', specialty: 'Orthopedics', credentials: 'MBBS, MS', experience: 14, clinic: 'City Health Clinic' },
];

const aliases: Partial<Record<Specialty, string>> = {
  Gynecology: 'gyno gynaecology gynecologist gynaecologist',
  'General Surgery': 'surgeon',
  'General Medicine': 'physician',
};

function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.profile}>
        <View style={styles.avatar} accessible={false} importantForAccessibility="no-hide-descendants">
          <Text style={styles.initials}>{doctor.initials}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <Text style={styles.secondary}>{doctor.credentials} · {doctor.experience} years of experience</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.clinic}>
          <Ionicons name="location-outline" size={17} color={BLUE} />
          <Text style={[styles.secondary, styles.details]}>{doctor.clinic}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Book an appointment with ${doctor.name}`} onPress={onBook} style={styles.primary}>
          <Text style={styles.primaryText}>Book now</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DoctorsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Specialty[]>([]);
  const [draft, setDraft] = useState<Specialty[] | null>(null);
  const [booking, setBooking] = useState<Doctor | null>(null);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = doctors.filter(doctor => {
    const searchable = [doctor.name, doctor.specialty, doctor.clinic, aliases[doctor.specialty]].join(' ').toLowerCase();
    return (selected.length === 0 || selected.includes(doctor.specialty)) &&
      terms.every(term => searchable.includes(term));
  });

  function toggleSpecialty(specialty: Specialty) {
    setDraft(current => {
      if (!current) return current;
      return current.includes(specialty)
        ? current.filter(item => item !== specialty)
        : [...current, specialty];
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          {router.canGoBack() && (
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={22} color={INK} />
            </Pressable>
          )}
          <View style={styles.details}>
            <Text accessibilityRole="header" style={styles.title}>Find a doctor</Text>
            <Text style={styles.secondary}>Book an in-clinic appointment</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.search}>
            <Ionicons name="search-outline" size={19} color={MUTED} />
            <TextInput
              accessibilityLabel="Search by doctor, specialty or clinic"
              placeholder="Search doctors or specialties"
              placeholderTextColor={MUTED}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
              style={styles.input}
            />
            {!!query && (
              <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clearSearch}>
                <Ionicons name="close-circle-outline" size={19} color={MUTED} />
              </Pressable>
            )}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`Filter by specialty, ${selected.length} selected`} onPress={() => setDraft([...selected])} style={[styles.iconButton, styles.filterButton]}>
            <Ionicons name="options-outline" size={21} color={ACTION} />
            <Text style={styles.link}>Filter{selected.length ? ` (${selected.length})` : ''}</Text>
          </Pressable>
        </View>

        <FlatList
          data={results}
          keyExtractor={doctor => doctor.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {!!selected.length && (
                <View style={styles.chips}>
                  {selected.map(specialty => (
                    <Pressable key={specialty} accessibilityRole="button" accessibilityLabel={`Remove ${specialty} filter`} onPress={() => setSelected(items => items.filter(item => item !== specialty))} style={styles.chip}>
                      <Text style={styles.link}>{specialty}</Text>
                      <Ionicons name="close" size={15} color={ACTION} />
                    </Pressable>
                  ))}
                </View>
              )}
              <Text accessibilityLiveRegion="polite" style={styles.count}>{results.length} {results.length === 1 ? 'doctor' : 'doctors'}</Text>
            </View>
          }
          renderItem={({ item }) => <DoctorCard doctor={item} onBook={() => setBooking(item)} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={27} color={BLUE} />
              <Text style={styles.name}>No doctors found</Text>
              <Text style={styles.secondary}>Try another search or clear your filters.</Text>
              <Pressable accessibilityRole="button" style={styles.iconButton} onPress={() => { setQuery(''); setSelected([]); }}>
                <Text style={styles.link}>Clear search and filters</Text>
              </Pressable>
            </View>
          }
        />
      </View>

      <Modal visible={draft !== null} transparent animationType="fade" onRequestClose={() => setDraft(null)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setDraft(null)} accessible={false} />
          <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.sheetHeader}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>Filter by specialty</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close filters" style={styles.iconButton} onPress={() => setDraft(null)}>
                <Ionicons name="close" size={22} color={INK} />
              </Pressable>
            </View>
            <ScrollView style={styles.options}>
              {specialties.map(specialty => {
                const checked = draft?.includes(specialty) ?? false;
                return (
                  <Pressable key={specialty} accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => toggleSpecialty(specialty)} style={[styles.option, checked && styles.optionSelected]}>
                    <Text style={styles.optionLabel}>{specialty}</Text>
                    <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={22} color={checked ? ACTION : MUTED} />
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={styles.sheetActions}>
              <Pressable accessibilityRole="button" style={styles.iconButton} onPress={() => setDraft([])}><Text style={styles.link}>Clear all</Text></Pressable>
              <Pressable accessibilityRole="button" style={[styles.primary, styles.details]} onPress={() => { setSelected(draft ?? []); setDraft(null); }}>
                <Text style={styles.primaryText}>Apply filters</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal visible={booking !== null} transparent animationType="fade" onRequestClose={() => setBooking(null)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setBooking(null)} accessible={false} />
          <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.sheet} accessibilityViewIsModal>
            <Text accessibilityRole="header" style={styles.sheetTitle}>{booking?.name}</Text>
            <Text style={styles.secondary}>{booking?.clinic}</Text>
            <Text style={styles.secondary}>Appointment booking is unavailable in this demo.</Text>
            {/* Replace this demo modal with navigation to your booking route. */}
            <Pressable accessibilityRole="button" style={styles.primary} onPress={() => setBooking(null)}>
              <Text style={styles.primaryText}>Done</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 },
  title: { fontFamily: BOLD, fontSize: 24, color: INK },
  secondary: { fontFamily: REGULAR, fontSize: 13, lineHeight: 19, color: MUTED },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  search: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 11, paddingRight: 6, borderWidth: 1, borderRadius: 8, borderColor: BORDER },
  input: { flex: 1, minWidth: 0, minHeight: 48, color: INK, fontFamily: REGULAR, fontSize: 14 },
  clearSearch: { minWidth: 40, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  iconButton: { minHeight: 44, minWidth: 44, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
  filterButton: { flexDirection: 'row', gap: 5, paddingHorizontal: 10, backgroundColor: PALE, borderRadius: 8 },
  link: { color: '#0569A8', fontFamily: SEMIBOLD, fontSize: 13 },
  list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 12 },
  listHeader: { gap: 12 },
  count: { fontFamily: SEMIBOLD, fontSize: 14, color: INK },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 5, paddingHorizontal: 10, borderRadius: 22, backgroundColor: PALE },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: BORDER, borderRadius: 12, padding: 12, gap: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: PALE, alignItems: 'center', justifyContent: 'center' },
  initials: { color: ACTION, fontFamily: BOLD, fontSize: 18 },
  details: { flex: 1, minWidth: 0 },
  name: { fontFamily: BOLD, fontSize: 16, color: INK },
  specialty: { color: '#0569A8', fontFamily: SEMIBOLD, fontSize: 13, marginVertical: 2 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderColor: '#E8EDF2', paddingTop: 10 },
  clinic: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  primary: { minHeight: 44, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 26, backgroundColor: ACTION, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontFamily: BOLD, fontSize: 14, color: '#FFFFFF', textAlign: 'center' },
  empty: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  overlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#11182766' },
  sheet: { width: '100%', maxWidth: 560, maxHeight: '85%', borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: '#FFFFFF', padding: 20, gap: 12 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { flexShrink: 1, fontFamily: BOLD, fontSize: 20, color: INK },
  options: { flexGrow: 0, flexShrink: 1 },
  option: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 12, borderRadius: 8 },
  optionSelected: { backgroundColor: PALE },
  optionLabel: { flexShrink: 1, fontFamily: SEMIBOLD, fontSize: 15, color: INK },
  sheetActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
