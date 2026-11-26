import { Image, StyleSheet } from 'react-native';

export function OnboardingAnimation({ index }: { index: number }) {
  return (
    <Image
      key={index}
      source={require('@/assets/images/icon.png')}
      style={styles.icon}
      resizeMode="contain"
      accessible={false}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 124,
    height: 124,
    borderRadius: 28,
  },
});