import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
    Keyboard,
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

const DEMO_OTP = '123456';
const BLUE = '#0879C1';
const REGULAR = 'DMSans_400Regular';
const SEMIBOLD = 'DMSans_600SemiBold';
const BOLD = 'DMSans_700Bold';

type FieldProps = TextInputProps & {
    label: string;
    accessory?: ReactNode;
};

function Field({ label, accessory, editable = true, ...props }: FieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputBox, !editable && styles.disabledInput]}>
                <TextInput
                    {...props}
                    accessibilityLabel={label}
                    editable={editable}
                    placeholderTextColor="#6B7280"
                    style={[styles.input, !editable && styles.disabledText]}
                />
                {accessory}
            </View>
        </View>
    );
}

function PasswordField({ label, ...props }: FieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <Field
            {...props}
            label={label}
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            accessory={
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                    onPress={() => setVisible(current => !current)}
                    style={styles.eyeButton}
                >
                    <Ionicons
                        name={visible ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#586270"
                    />
                </Pressable>
            }
        />
    );
}

export default function ResetPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [step, setStep] = useState<'email' | 'verify' | 'success'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        return () => {
            if (timer.current !== null) clearTimeout(timer.current);
        };
    }, []);

    function handleSendCode() {
        const address = email.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
            setError('Enter a valid email address.');
            return;
        }

        Keyboard.dismiss();
        setEmail(address);
        setError('');
        setStep('verify');
    }

    function handleResetPassword() {
        if (timer.current !== null) return;

        if (otp !== DEMO_OTP) {
            setError('Incorrect verification code. Use 123456 for this preview.');
            return;
        }

        if (password.length < 8) {
            setError('Use at least 8 characters for your new password.');
            return;
        }

        if (password !== confirmation) {
            setError('Your passwords don’t match.');
            return;
        }

        Keyboard.dismiss();
        setError('');
        setVerifying(true);

        timer.current = setTimeout(() => {
            timer.current = null;
            setOtp('');
            setPassword('');
            setConfirmation('');
            setVerifying(false);
            setStep('success');
        }, 900);
    }

    function backToLogin() {
        router.replace('/login');
    }

    const isEmailStep = step === 'email';
    const isSuccess = step === 'success';
    const primaryLabel = isSuccess
        ? 'Back to login'
        : isEmailStep
            ? 'Send Verification Code'
            : verifying
                ? 'Verifying…'
                : 'Reset Password';

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
                        paddingTop: insets.top + 32,
                        paddingBottom: insets.bottom + 24,
                        paddingLeft: insets.left + 20,
                        paddingRight: insets.right + 20,
                    },
                ]}
            >
                <View style={styles.content}>
                    <View style={styles.heading}>
                        {isSuccess && (
                            <View
                                accessible={false}
                                accessibilityElementsHidden
                                importantForAccessibility="no-hide-descendants"
                            >
                                <LottieView
                                    source={require('../../assets/animations/success.json')}
                                    autoPlay
                                    loop={false}
                                    resizeMode="contain"
                                    style={styles.successAnimation}
                                />
                            </View>
                        )}
                        <Text
                            accessibilityRole="header"
                            accessibilityLiveRegion="polite"
                            style={styles.title}
                        >
                            {isSuccess
                                ? 'Password reset successfully.'
                                : isEmailStep
                                    ? 'Reset Password'
                                    : 'Create a New Password'}
                        </Text>
                        {!isSuccess && (
                            <Text style={styles.subtitle}>
                                {isEmailStep
                                    ? 'Enter the email associated with your account to get a verification code.'
                                    : 'Enter your verification code and choose a new password.'}
                            </Text>
                        )}
                    </View>

                    <View style={styles.form}>
                        {!isSuccess && (
                            <Field
                                label="Email"
                                value={email}
                                editable={isEmailStep}
                                onChangeText={value => {
                                    setEmail(value);
                                    setError('');
                                }}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoComplete="email"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="send"
                                onSubmitEditing={isEmailStep ? handleSendCode : undefined}
                            />
                        )}

                        {step === 'verify' && (
                            <>
                                <Field
                                    label="Verification Code"
                                    value={otp}
                                    editable={!verifying}
                                    onChangeText={value => {
                                        setOtp(value.replace(/\D/g, '').slice(0, 6));
                                        setError('');
                                    }}
                                    placeholder="Enter the 6-digit code"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                />
                                <Text style={styles.hint}>Test code: {DEMO_OTP}</Text>

                                <PasswordField
                                    label="New Password"
                                    value={password}
                                    editable={!verifying}
                                    onChangeText={value => {
                                        setPassword(value);
                                        setError('');
                                    }}
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                />
                                <PasswordField
                                    label="Confirm Password"
                                    value={confirmation}
                                    editable={!verifying}
                                    onChangeText={value => {
                                        setConfirmation(value);
                                        setError('');
                                    }}
                                    placeholder="Re-enter your new password"
                                    autoComplete="new-password"
                                    returnKeyType="go"
                                    onSubmitEditing={handleResetPassword}
                                />
                            </>
                        )}

                        {error !== '' && (
                            <Text
                                accessibilityRole="alert"
                                accessibilityLiveRegion="polite"
                                style={styles.error}
                            >
                                {error}
                            </Text>
                        )}

                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={{ disabled: verifying, busy: verifying }}
                            disabled={verifying}
                            onPress={
                                isSuccess
                                    ? backToLogin
                                    : isEmailStep
                                        ? handleSendCode
                                        : handleResetPassword
                            }
                            style={({ pressed }) => [
                                styles.primaryButton,
                                (pressed || verifying) && styles.dimmed,
                            ]}
                        >
                            <Text style={styles.primaryLabel}>{primaryLabel}</Text>
                        </Pressable>

                        {!isSuccess && (
                            <Pressable
                                accessibilityRole="link"
                                onPress={backToLogin}
                                style={styles.backButton}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={16}
                                    color="#586270"
                                    accessible={false}
                                />
                                <Text style={styles.backLabel}>Back to login</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { flexGrow: 1, alignItems: 'center' },
    content: { width: '100%', maxWidth: 420 },
    heading: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 28,
        gap: 8,
    },
    title: {
        color: '#111827',
        fontFamily: BOLD,
        fontSize: 24,
        textAlign: 'center',
    },
    subtitle: {
        maxWidth: 310,
        color: '#586270',
        fontFamily: REGULAR,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
    form: { gap: 14 },
    field: { gap: 6 },
    label: { color: '#111827', fontFamily: SEMIBOLD, fontSize: 14 },
    inputBox: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D7DCE2',
        borderRadius: 8,
    },
    input: {
        flex: 1,
        minWidth: 0,
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: '#111827',
        fontFamily: REGULAR,
        fontSize: 14,
    },
    disabledInput: { backgroundColor: '#F1F4F7' },
    disabledText: { color: '#586270' },
    eyeButton: {
        width: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: { color: '#0569A8', fontFamily: SEMIBOLD, fontSize: 13 },
    error: { color: '#9B2727', fontFamily: REGULAR, fontSize: 13 },
    primaryButton: {
        minHeight: 48,
        borderRadius: 26,
        backgroundColor: BLUE,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 11,
    },
    primaryLabel: {
        color: '#FFFFFF',
        fontFamily: BOLD,
        fontSize: 15,
        textAlign: 'center',
    },
    backButton: {
        minHeight: 44,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
    },
    backLabel: { color: '#586270', fontFamily: SEMIBOLD, fontSize: 14 },
    dimmed: { opacity: 0.7 },
    successAnimation: {
        width: 168,
        height: 168,
        marginBottom: 4,
    },
});