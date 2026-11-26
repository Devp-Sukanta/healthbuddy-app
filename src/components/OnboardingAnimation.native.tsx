import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';

const animations = [
  require('@/assets/animations/1stScreen.json'),
  require('@/assets/animations/firstaidbox.json'),
  require('@/assets/animations/hospital.json'),
];

export function OnboardingAnimation({ index }: { index: number }) {
  return (
    <LottieView
      key={index}
      source={animations[index]}
      style={styles.animation}
      resizeMode="contain"
      autoPlay
      loop
    />
  );
}

const styles = StyleSheet.create({
  animation: {
    width: '100%',
    height: '100%',
    maxWidth: 380,
    maxHeight: 380,
  },
});