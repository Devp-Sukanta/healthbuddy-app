import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BLUE = '#0D82CC';
const INK = '#111827';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  function handleSignIn() {
    const login = identifier.trim();

    if (!login || !password) {
      setMessage('Enter your email or mobile number and password.');
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
    const isMobile =
      /^\+?[\d\s().-]+$/.test(login) &&
      login.replace(/\D/g, '').length >= 7;

    if (!isEmail && !isMobile) {
      setMessage('Enter a valid email address or mobile number.');
      return;
    }

    router.replace("/(tabs)")
    // setMessage('Sign-in is unavailable until your auth service is connected.');
  }

  function handleGoogleSignIn() {
    // Start your Google authentication flow here.
    router.replace("/(tabs)")
    // setMessage('Google sign-in is unavailable until it is connected.');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 20,
            paddingLeft: insets.left + 20,
            paddingRight: insets.right + 20,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.heading}>
            <View style={styles.logo} accessible={false}>
              <Ionicons name="medical" size={29} color="#FFFFFF" />
            </View>

            <Text accessibilityRole="header" style={styles.title}>
              Welcome to HealthBuddy
            </Text>
            <Text style={styles.subtitle}>
              Your healthcare companion, anytime, anywhere.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email or Mobile Number*</Text>
              <TextInput
                accessibilityLabel="Email or mobile number"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your email or mobile number"
                placeholderTextColor="#6B7280"
                value={identifier}
                onChangeText={setIdentifier}
                style={[styles.input, styles.borderedInput]}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password*</Text>
              <View style={styles.passwordField}>
                <TextInput
                  accessibilityLabel="Password"
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  returnKeyType="go"
                  onSubmitEditing={handleSignIn}
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, styles.passwordInput]}
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  onPress={() => setShowPassword(current => !current)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#586270"
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.options}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel="Remember me"
                accessibilityState={{ checked: rememberMe }}
                onPress={() => setRememberMe(current => !current)}
                style={styles.remember}
              >
                <View
                  style={[styles.checkbox, rememberMe && styles.checked]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.secondaryText}>Remember me</Text>
              </Pressable>

              <Pressable
                accessibilityRole="link"
                onPress={() => router.push('/reset-password')}
                style={styles.textButton}
              >
                <Text style={styles.link}>Forgot password</Text>
              </Pressable>
            </View>

            {message !== '' && (
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={styles.message}
              >
                {message}
              </Text>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.button,
                styles.signInButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.signInLabel}>Sign in</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleGoogleSignIn}
              style={({ pressed }) => [
                styles.button,
                styles.googleButton,
                pressed && styles.pressed,
              ]}
            >
              <FontAwesome name="google" size={18} color="#4285F4" />
              <Text style={styles.googleLabel}>Sign in with Google</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.secondaryText}>Don’t have an account?</Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.push('/register')}
              style={styles.textButton}
            >
              <Text style={styles.link}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 420,
  },
  heading: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 26,
    gap: 8,
  },
  logo: {
    width: 56,
    height: 48,
    borderRadius: 15,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    color: INK,
    fontFamily: 'DMSans_700Bold',
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 270,
    color: '#586270',
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    color: INK,
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
  },
  input: {
    minHeight: 48,
    color: INK,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  borderedInput: {
    borderWidth: 1,
    borderColor: '#D7DCE2',
    borderRadius: 8,
  },
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7DCE2',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    minWidth: 0,
  },
  eyeButton: {
    width: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 12,
    marginTop: -6,
  },
  remember: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#929BA7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  secondaryText: {
    color: '#586270',
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    flexShrink: 1,
  },
  textButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
  link: {
    color: '#0569A8',
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 13,
  },
  message: {
    color: '#9B2727',
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
  },
  button: {
    minHeight: 48,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  signInButton: {
    backgroundColor: '#0879C1',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#D7DCE2',
  },
  signInLabel: {
    color: '#FFFFFF',
    fontFamily: 'DMSans_700Bold',
    fontSize: 15,
  },
  googleLabel: {
    color: INK,
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.75,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 6,
  },
});