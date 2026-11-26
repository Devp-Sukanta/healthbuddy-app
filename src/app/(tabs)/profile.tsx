import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLOR = {
  canvas: '#F5FAFD',
  white: '#FFFFFF',
  ink: '#111827',
  muted: '#586270',
  blue: '#0879C1',
  link: '#0569A8',
  paleBlue: '#E6F3FC',
  border: '#DCE8F2',
  error: '#9B2727',
};

const FONT = {
  regular: 'DMSans_400Regular',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
};

type Profile = {
  name: string;
  email: string;
  phone: string;
  city: string;
};

const INITIAL_PROFILE: Profile = {
  name: '',
  email: '',
  phone: '',
  city: '',
};

const fields: {
  key: keyof Profile;
  label: string;
  placeholder: string;
  autoComplete?: TextInputProps['autoComplete'];
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
}[] = [
    {
      key: 'name',
      label: 'Full name',
      placeholder: 'Enter your full name',
      autoComplete: 'name',
      autoCapitalize: 'words',
    },
    {
      key: 'email',
      label: 'Email address',
      placeholder: 'Enter your email address',
      autoComplete: 'email',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      key: 'phone',
      label: 'Mobile number',
      placeholder: 'Enter your mobile number',
      autoComplete: 'tel',
      keyboardType: 'phone-pad',
    },
    {
      key: 'city',
      label: 'City',
      placeholder: 'Enter your city',
      autoCapitalize: 'words',
    },
  ];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => Array.from(part)[0])
    .join('')
    .toUpperCase();

  function startEditing() {
    setStatus('');
    setError('');
    setDraft({ ...profile });
  }

  function cancelEditing() {
    setDraft(null);
    setError('');
  }

  function saveProfile() {
    if (!draft) return;

    const next = {
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      city: draft.city.trim(),
    };

    if (!next.name) {
      setError('Enter your full name.');
      return;
    }

    if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
      setError('Enter a valid email address.');
      return;
    }

    if (next.phone) {
      const digits = next.phone.replace(/\D/g, '');
      if (!/^\+?[\d\s().-]+$/.test(next.phone) || digits.length < 7 || digits.length > 15) {
        setError('Enter a valid mobile number.');
        return;
      }
    }

    setProfile(next);
    setDraft(null);
    setError('');
    setStatus('Profile updated for this session.');
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              Profile
            </Text>

            <View style={[styles.card, styles.summary]}>
              <View
                style={styles.avatar}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                {initials ? (
                  <Text style={styles.initials}>{initials}</Text>
                ) : (
                  <Ionicons name="person-outline" size={28} color={COLOR.blue} />
                )}
              </View>

              <View style={styles.summaryText}>
                <Text style={styles.name}>{profile.name || 'Your profile'}</Text>
                <Text style={styles.secondary}>
                  {profile.email || profile.phone || 'Add your contact details'}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  Personal details
                </Text>
                {!draft && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit personal details"
                    onPress={startEditing}
                    style={styles.editButton}
                  >
                    <Ionicons name="create-outline" size={18} color={COLOR.link} />
                    <Text style={styles.link}>Edit</Text>
                  </Pressable>
                )}
              </View>

              {fields.map(field => (
                <View key={field.key} style={styles.field}>
                  <Text style={styles.label}>{field.label}</Text>
                  {draft ? (
                    <TextInput
                      accessibilityLabel={field.label}
                      value={draft[field.key]}
                      onChangeText={value => {
                        setDraft(current =>
                          current ? { ...current, [field.key]: value } : current,
                        );
                        setError('');
                      }}
                      placeholder={field.placeholder}
                      placeholderTextColor={COLOR.muted}
                      keyboardType={field.keyboardType}
                      autoComplete={field.autoComplete}
                      autoCapitalize={field.autoCapitalize}
                      autoCorrect={false}
                      style={styles.input}
                    />
                  ) : (
                    <Text style={styles.secondary}>
                      {profile[field.key] || 'Not added'}
                    </Text>
                  )}
                </View>
              ))}

              {!!error && (
                <Text accessibilityRole="alert" style={styles.error}>
                  {error}
                </Text>
              )}

              {draft && (
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={cancelEditing}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.link}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={saveProfile}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text style={styles.saveText}>Save changes</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {!!status && (
              <Text accessibilityLiveRegion="polite" style={styles.secondary}>
                {status}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLOR.canvas },
  scroll: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: 14 },
  title: { fontFamily: FONT.bold, fontSize: 24, color: COLOR.ink },
  card: {
    backgroundColor: COLOR.white,
    borderColor: COLOR.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  summary: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLOR.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: FONT.bold, fontSize: 22, color: COLOR.link },
  summaryText: { flex: 1, minWidth: 0, gap: 3 },
  name: { fontFamily: FONT.bold, fontSize: 18, color: COLOR.ink },
  secondary: { fontFamily: FONT.regular, fontSize: 14, color: COLOR.muted },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionTitle: { flexShrink: 1, fontFamily: FONT.bold, fontSize: 16, color: COLOR.ink },
  editButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 22,
    backgroundColor: COLOR.paleBlue,
  },
  link: { fontFamily: FONT.semibold, fontSize: 14, color: COLOR.link },
  field: { gap: 6 },
  label: { fontFamily: FONT.semibold, fontSize: 14, color: COLOR.ink },
  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderRadius: 8,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLOR.ink,
  },
  error: { fontFamily: FONT.regular, fontSize: 13, color: COLOR.error },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: { borderWidth: 1, borderColor: COLOR.border },
  saveButton: { flexGrow: 1, backgroundColor: COLOR.blue },
  saveText: { fontFamily: FONT.bold, fontSize: 14, color: COLOR.white },
});