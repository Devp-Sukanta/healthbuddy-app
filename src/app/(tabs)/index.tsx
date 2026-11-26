import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = ComponentProps<typeof Ionicons>['name'];

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  link?: Href;
  category?: string;
  image?: ImageSourcePropType;
};

type CareItem = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  category?: string;
  image?: ImageSourcePropType;
};

const FONT = {
  regular: 'DMSans_400Regular',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
};

const COLOR = {
  canvas: '#F5FAFD',
  white: '#FFFFFF',
  ink: '#111827',
  muted: '#586270',
  blue: '#0879C1',
  border: '#DCE8F2',
  paleBlue: '#E6F3FC',
  aqua: '#CEF0F0',
  service: '#E2F4F9',
};

const SERVICES: ServiceItem[] = [
  {
    id: 'doctors',
    image: require('../../../assets/icons/doctor.png'),
    title: 'Doctors',
    description: 'Find a doctor for routine checkups and general health concerns.',
    link: '/doctors',
  },
  {
    id: 'hospitals',
    image: require('../../../assets/icons/hospital.png'),
    title: 'Hospitals',
    description: 'Find a specialist for heart and circulation care.',
    link: '/hospitals',
  },
  {
    id: 'medicines',
    image: require('../../../assets/icons/medicine.png'),
    title: 'Medicines',
    description: 'Find a specialist for skin, hair, and nail concerns.',
    link:'/medicines'
  },
  {
    id: 'lab-tests',
    image: require('../../../assets/icons/sample-tube.png'),
    title: 'Lab Tests',
    description: 'Find a doctor who cares for infants, children, and teens.',
    link:'/lab-tests'
  },
  {
    id: 'ambulances',
    image: require('../../../assets/icons/ambulance.png'),
    title: 'Ambulances',
    description: 'Find a specialist for bone, joint, and muscle concerns.',
    link:'/ambulances'
  },
  {
    id: 'nursing',
    image: require('../../../assets/icons/nurse.png'),
    title: 'Nursing',
    description: 'Find a specialist for vision checks and eye care.',
    link:'/nursing'
  },
  {
    id: 'physiotherapist',
    image: require('../../../assets/icons/rehabilitation.png'),
    title: 'Physio',
    category: 'Home visit',
    description: 'Request an in-person consultation with a doctor at home.',
    link:'/physio'
  },
  {
    id: 'equipment',
    image: require('../../../assets/icons/lab-equipment.png'),
    title: 'Equipment',
    category: 'Doorstep delivery',
    description: 'Request delivery from a pharmacy. Some medicines require a prescription.',
    link:'/equipment'
  },
];

const NOTIFICATIONS: CareItem = {
  id: 'notifications',
  title: 'Notifications',
  description: 'You have no new notifications in this preview.',
  icon: 'notifications-outline',
};

const APPOINTMENTS: CareItem = {
  id: 'appointments',
  title: 'Manage appointments',
  description: 'Upcoming visits and booking details will appear here once scheduling is connected.',
  icon: 'calendar-outline',
};

const GAP = 8;
const COLUMNS = 3;
const MAX_WIDTH = 1080;

function SectionHeading({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function CareCard({
  item,
  onPress,
}: {
  item: ServiceItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        item.category ? `${item.title}, ${item.category}` : item.title
      }
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        styles.serviceCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.cardArtwork, styles.serviceArtwork]}>
        <Image
          source={item.image}
          style={styles.cardImage}
          resizeMode="contain"
          accessible={false}
        />
      </View>

      <View style={styles.cardCaption}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<ServiceItem | null>(null);
  const router = useRouter();

  const padding = width < 360 ? 14 : 20;
  const normalizedQuery = query.trim().toLowerCase();

  const visibleServices = SERVICES.filter(item =>
    `${item.title} ${item.category ?? ''} ${item.description}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  const rows: ServiceItem[][] = [];
  for (let start = 0; start < visibleServices.length; start += COLUMNS) {
    rows.push(visibleServices.slice(start, start + COLUMNS));
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 96,
            paddingLeft: insets.left + padding,
            paddingRight: insets.right + padding,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.brand}>HealthBuddy</Text>
              <Text accessibilityRole="header" style={styles.greeting}>
                Hello there!
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => console.log("(NOTIFICATIONS)")}
              style={({ pressed }) => [
                styles.notification,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLOR.ink}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open profile"
              onPress={() => router.navigate('/(tabs)/profile')}
              style={({ pressed }) => [
                styles.notification,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="person-outline" size={22} color={COLOR.blue} />
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={21}
              color={COLOR.muted}
              accessible={false}
            />
            <TextInput
              accessibilityLabel="Search services"
              placeholder="Search services"
              placeholderTextColor={COLOR.muted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              returnKeyType="search"
              style={styles.searchInput}
            />
            {query.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => setQuery('')}
                style={styles.clearSearch}
              >
                <Ionicons name="close-circle" size={20} color={COLOR.muted} />
              </Pressable>
            )}
          </View>

          {normalizedQuery === '' && (
            <View style={styles.banner}>
              <View pointerEvents="none" style={styles.bannerCircle} />
              <View style={styles.bannerCopy}>
                <Text accessibilityRole="header" style={styles.bannerTitle}>
                  Find a specialist
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Browse specialists and home care services.
                </Text>
              </View>
              <View style={styles.bannerArtwork} accessible={false}>
                <Ionicons
                  name="medkit-outline"
                  size={34}
                  color={COLOR.blue}
                  accessible={false}
                />
              </View>
            </View>
          )}

          <SectionHeading title={normalizedQuery ? 'Search results' : 'Services'} />

          {visibleServices.length > 0 ? (
            <View style={styles.grid}>
              {rows.map(row => (
                <View key={row[0].id} style={styles.gridRow}>
                  {row.map(item => (
                    <View key={item.id} style={styles.gridCell}>
                      <CareCard
                        item={item}
                        onPress={() => {
                          if (item.link) {
                            router.push(item.link);
                          } else {
                            setDetail(item);
                          }
                        }}
                      />
                    </View>
                  ))}
                  {Array.from({ length: COLUMNS - row.length }, (_, index) => (
                    <View key={index} style={styles.gridCell} />
                  ))}
                </View>
              ))}
            </View>
          ) : (
            <Text accessibilityLiveRegion="polite" style={styles.bodyText}>
              No services found for “{query.trim()}”.
            </Text>
          )}

          {normalizedQuery === '' && (
            <>
              <SectionHeading title="Appointments" />

              <Pressable
                accessibilityRole="button"
                onPress={() => console.log('(APPOINTMENTS)')}
                style={({ pressed }) => [
                  styles.appointment,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={23}
                    color={COLOR.blue}
                  />
                </View>
                <View style={styles.appointmentCopy}>
                  <Text style={styles.appointmentTitle}>
                    Manage appointments
                  </Text>
                  <Text style={styles.bodyText}>
                    View your visits and booking details.
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={COLOR.blue}
                />
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={detail !== null}
        animationType="fade"
        onRequestClose={() => setDetail(null)}
      >
        <View style={styles.modalBackdrop}>
          <ScrollView
            bounces={false}
            contentContainerStyle={[
              styles.modalScroll,
              {
                paddingTop: insets.top + 20,
                paddingBottom: insets.bottom + 20,
              },
            ]}
          >
            {detail && (
              <View accessibilityViewIsModal style={styles.modalCard}>
                <Text accessibilityRole="header" style={styles.modalTitle}>
                  {detail.title}
                </Text>
                <Text style={styles.bodyText}>{detail.description}</Text>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDetail(null)}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.closeLabel}>Close</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLOR.canvas,
  },
  scrollContent: {
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MAX_WIDTH,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  brand: {
    color: COLOR.blue,
    fontFamily: FONT.bold,
    fontSize: 14,
  },
  greeting: {
    color: COLOR.ink,
    fontFamily: FONT.bold,
    fontSize: 28,
  },
  notification: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLOR.border,
    backgroundColor: COLOR.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 13,
    backgroundColor: COLOR.white,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    paddingVertical: 10,
    color: COLOR.ink,
    fontFamily: FONT.regular,
    fontSize: 15,
  },
  clearSearch: {
    width: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    minHeight: 132,
    marginTop: 14,
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLOR.blue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  bannerCircle: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    right: -60,
    bottom: -110,
    backgroundColor: '#FFFFFF22',
  },
  bannerCopy: {
    flex: 1,
    gap: 5,
  },
  bannerTitle: {
    color: COLOR.white,
    fontFamily: FONT.bold,
    fontSize: 24,
  },
  bannerSubtitle: {
    color: COLOR.white,
    fontFamily: FONT.regular,
    fontSize: 14,
  },
  bannerArtwork: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLOR.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    marginTop: 24,
    marginBottom: 12,
    gap: 5,
  },
  sectionTitle: {
    color: COLOR.ink,
    fontFamily: FONT.bold,
    fontSize: 20,
  },
  sectionLine: {
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLOR.blue,
  },
  grid: { gap: GAP },
  gridRow: { flexDirection: 'row', gap: GAP },
  gridCell: { flex: 1, minWidth: 0 },
  card: {
    flex: 1,
    minWidth: 0,
    padding: 6,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 14,
    backgroundColor: COLOR.white,
  },
  serviceCard: {
    backgroundColor: COLOR.service,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#294865',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  cardArtwork: {
    aspectRatio: 1.35,
    borderRadius: 9,
    backgroundColor: COLOR.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  serviceArtwork: {
    aspectRatio: 1.55,
    backgroundColor: COLOR.aqua,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardCaption: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  cardTitle: {
    color: COLOR.ink,
    fontFamily: FONT.semibold,
    fontSize: 13,
    textAlign: 'center',
  },
  cardCategory: {
    color: COLOR.muted,
    fontFamily: FONT.regular,
    fontSize: 12,
    textAlign: 'center',
  },
  bodyText: {
    color: COLOR.muted,
    fontFamily: FONT.regular,
    fontSize: 14,
  },
  appointment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 16,
    backgroundColor: COLOR.white,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLOR.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentCopy: {
    flex: 1,
    gap: 3,
  },
  appointmentTitle: {
    color: COLOR.ink,
    fontFamily: FONT.bold,
    fontSize: 15,
  },
  pressed: {
    opacity: 0.75,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#13254488',
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    gap: 12,
    padding: 22,
    borderRadius: 22,
    backgroundColor: COLOR.white,
  },
  modalTitle: {
    color: COLOR.ink,
    fontFamily: FONT.bold,
    fontSize: 22,
  },
  closeButton: {
    minHeight: 48,
    padding: 10,
    borderRadius: 26,
    backgroundColor: COLOR.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    color: COLOR.white,
    fontFamily: FONT.bold,
    fontSize: 15,
  },
});