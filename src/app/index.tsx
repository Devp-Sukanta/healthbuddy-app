import { OnboardingAnimation } from '@/components/OnboardingAnimation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const STEPS = [
  {
    title: 'Welcome to HealthBuddy',
    description: 'A space to focus on your health, one step at a time.',
    background: '#E8E9F6',
    accent: '#D4EAFF',
  },
  {
    title: 'Be ready for the little things',
    description: 'Build confidence for the everyday moments when care matters.',
    background: '#E6F1F3',
    accent: '#C9EDE5',
  },
  {
    title: 'Take the next step',
    description: 'Explore HealthBuddy and find what’s useful to you today.',
    background: '#ECEAF6',
    accent: '#FFF0CA',
  },
] as const;


const OnBoarding = () => {

  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;
  const router = useRouter();

  function continueOnboarding() {
    if (isLast) {
      router.push("/login")
      console.log("object");
      return;
    }

    setIndex(index + 1);
  }



  return (
    <View style={[styles.screen, { backgroundColor: step.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View
            style={[styles.largeCircle, { backgroundColor: step.accent }]}
            accessible={false}
            pointerEvents="none"
          />
          <View style={styles.smallCircle} accessible={false} pointerEvents="none" />

          <View style={styles.header}>
            {index > 0 && (
              <Pressable
                accessibilityRole="button"
                onPress={() => setIndex(index - 1)}
                style={styles.textButton}
              >
                <Text style={styles.headerLabel}>Back</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              onPress={() => router.push("/login")}
              style={[styles.textButton, styles.skip]}
            >
              <Text style={styles.headerLabel}>Skip</Text>
            </Pressable>
          </View>

          <View
            style={styles.artwork}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <OnboardingAnimation index={index} />
          </View>
        </View>

        <View
          style={[
            styles.panel,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
        >
          <View style={styles.copy} accessibilityLiveRegion="polite">
            <Text accessibilityRole="header" style={styles.title}>
              {step.title}
            </Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>

          <View
            accessible
            accessibilityLabel={`Step ${index + 1} of ${STEPS.length}`}
            style={styles.pagination}
          >
            {STEPS.map(({ title }, position) => (
              <View
                key={title}
                style={[styles.dot, position === index && styles.activeDot]}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={continueOnboarding}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryPressed,
            ]}
          >
            <Text style={styles.primaryLabel}>
              {isLast ? 'Get started' : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

export default OnBoarding

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  hero: {
    flex: 1,
    minHeight: 280,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  textButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  skip: {
    marginLeft: 'auto',
  },
 headerLabel: {
  color: '#34435C',
  fontSize: 14,
  fontFamily: 'DMSans_600SemiBold',
},
title: {
  color: '#111D32',
  fontSize: 23,
  fontFamily: 'DMSans_700Bold',
  textAlign: 'center',
},
description: {
  maxWidth: 300,
  marginTop: 8,
  color: '#536075',
  fontSize: 15,
  lineHeight: 22,
  fontFamily: 'DMSans_400Regular',
  textAlign: 'center',
},
primaryLabel: {
  color: '#FFFFFF',
  fontSize: 15,
  fontFamily: 'DMSans_700Bold',
},
  largeCircle: {
    position: 'absolute',
    top: -48,
    right: -30,
    width: 178,
    height: 178,
    borderRadius: 89,
  },
  smallCircle: {
    position: 'absolute',
    top: 105,
    right: 24,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#FFFFFF80',
  },
  artwork: {
    flex: 1,
    minHeight: 224,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 28,
    minHeight: 235,
  },
  copy: {
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A2ADBD',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#075BC7',
  },
  primaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#075BC7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 'auto',
  },
  primaryPressed: {
    backgroundColor: '#08499D',
  }
});