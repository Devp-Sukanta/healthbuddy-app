import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const MAX_SPLASH_MS = 6000;

export function LottieSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => setVisible(false), MAX_SPLASH_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require('@/assets/animations/Haelthy.json')}
        style={styles.animation}
        resizeMode="contain"
        autoPlay
        loop={false}
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) setVisible(false);
        }}
        onAnimationFailure={(error) => {
          console.warn('[Lottie splash]', error);
          setVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  animation: {
    width: 240,
    height: 240,
  },
});