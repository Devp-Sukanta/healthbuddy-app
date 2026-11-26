import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState, type ComponentRef, type Ref } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BLUE = '#0D82CC';
const INK = '#111827';
const REGULAR = 'DMSans_400Regular';
const SEMIBOLD = 'DMSans_600SemiBold';
const BOLD = 'DMSans_700Bold';

type TextInputHandle = ComponentRef<typeof TextInput>;

type PasswordFieldProps = TextInputProps & {
    label: string;
    inputRef?: Ref<TextInputHandle>;
};

function PasswordField({ label, inputRef, ...props }: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}*</Text>

            <View style={styles.passwordField}>
                <TextInput
                    {...props}
                    ref={inputRef}
                    accessibilityLabel={label}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!visible}
                    placeholderTextColor="#6B7280"
                    style={[styles.input, styles.passwordInput]}
                />

                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                        label === 'Password'
                            ? visible ? 'Hide password' : 'Show password'
                            : visible ? 'Hide password confirmation' : 'Show password confirmation'
                    }
                    onPress={() => setVisible(current => !current)}
                    style={styles.eyeButton}
                >
                    <Ionicons
                        name={visible ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#586270"
                    />
                </Pressable>
            </View>
        </View>
    );
}

export default function RegisterScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const contactRef = useRef<TextInputHandle>(null);
    const passwordRef = useRef<TextInputHandle>(null);
    const confirmationRef = useRef<TextInputHandle>(null);

    const [fullName, setFullName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [message, setMessage] = useState('');

    function handleRegister() {
        const name = fullName.trim();
        const identifier = contact.trim();

        if (!name) {
            setMessage('Enter your full name.');
            return;
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isMobile =
            /^\+?[\d\s().-]+$/.test(identifier) &&
            identifier.replace(/\D/g, '').length >= 7;

        if (!isEmail && !isMobile) {
            setMessage('Enter a valid email address or mobile number.');
            return;
        }

        if (!password) {
            setMessage('Enter a password.');
            return;
        }

        if (password !== confirmation) {
            setMessage('Your passwords don’t match.');
            return;
        }

        // Pass name, identifier, and password to your auth service here.
        setMessage('Account creation is unavailable until authentication is connected.');
    }

    function handleGoogleSignUp() {
        // Start your Google authentication flow here.
        setMessage('Google sign-up is unavailable until it is connected.');
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
                            Create an Account
                        </Text>

                        <Text style={styles.subtitle}>
                            Join HealthBuddy to take the next step in caring for your health.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Full Name*</Text>
                            <TextInput
                                accessibilityLabel="Full name"
                                autoComplete="name"
                                autoCapitalize="words"
                                placeholder="Enter your full name"
                                placeholderTextColor="#6B7280"
                                returnKeyType="next"
                                onSubmitEditing={() => contactRef.current?.focus()}
                                value={fullName}
                                onChangeText={setFullName}
                                style={[styles.input, styles.borderedInput]}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={styles.label}>Mobile Number or Email*</Text>
                            <TextInput
                                ref={contactRef}
                                accessibilityLabel="Mobile number or email"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Enter your mobile number or email"
                                placeholderTextColor="#6B7280"
                                returnKeyType="next"
                                onSubmitEditing={() => passwordRef.current?.focus()}
                                value={contact}
                                onChangeText={setContact}
                                style={[styles.input, styles.borderedInput]}
                            />
                        </View>

                        <PasswordField
                            inputRef={passwordRef}
                            label="Password"
                            autoComplete="new-password"
                            placeholder="Create a strong password"
                            returnKeyType="next"
                            onSubmitEditing={() => confirmationRef.current?.focus()}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <PasswordField
                            inputRef={confirmationRef}
                            label="Confirm Password"
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                            returnKeyType="go"
                            onSubmitEditing={handleRegister}
                            value={confirmation}
                            onChangeText={setConfirmation}
                        />

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
                            onPress={handleRegister}
                            style={({ pressed }) => [
                                styles.button,
                                styles.primaryButton,
                                pressed && styles.pressed,
                            ]}
                        >
                            <Text style={styles.primaryLabel}>Create Account</Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            onPress={handleGoogleSignUp}
                            style={({ pressed }) => [
                                styles.button,
                                styles.googleButton,
                                pressed && styles.pressed,
                            ]}
                        >
                            <FontAwesome name="google" size={18} color="#4285F4" />
                            <Text style={styles.googleLabel}>Sign up with Google</Text>
                        </Pressable>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.secondaryText}>Already have an account?</Text>

                        <Pressable
                            accessibilityRole="link"
                            onPress={() => router.replace('/login')}
                            style={styles.textButton}
                        >
                            <Text style={styles.link}>Sign in</Text>
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
        marginBottom: 24,
        gap: 8,
    },
    logo: {
        width: 56,
        height: 48,
        marginBottom: 8,
        borderRadius: 15,
        backgroundColor: BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: INK,
        fontFamily: BOLD,
        fontSize: 24,
        textAlign: 'center',
    },
    subtitle: {
        maxWidth: 280,
        color: '#586270',
        fontFamily: REGULAR,
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
        fontFamily: SEMIBOLD,
        fontSize: 14,
    },
    input: {
        minHeight: 48,
        color: INK,
        fontFamily: REGULAR,
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
    message: {
        color: '#9B2727',
        fontFamily: REGULAR,
        fontSize: 13,
    },
    button: {
        minHeight: 48,
        borderRadius: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 11,
        gap: 9,
    },
    primaryButton: {
        backgroundColor: '#0879C1',
        marginTop: 4,
    },
    primaryLabel: {
        color: '#FFFFFF',
        fontFamily: BOLD,
        fontSize: 15,
    },
    googleButton: {
        borderWidth: 1,
        borderColor: '#D7DCE2',
    },
    googleLabel: {
        color: INK,
        fontFamily: BOLD,
        fontSize: 14,
        flexShrink: 1,
    },
    pressed: {
        opacity: 0.75,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 6,
    },
    secondaryText: {
        color: '#586270',
        fontFamily: REGULAR,
        fontSize: 13,
    },
    textButton: {
        minHeight: 44,
        justifyContent: 'center',
    },
    link: {
        color: '#0569A8',
        fontFamily: SEMIBOLD,
        fontSize: 13,
    },
});