import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import Button from '../src/components/Button';
import ScreenHeader from '../src/components/ScreenHeader';
import { Colors } from '../src/theme/colors';
import { generateFighter } from '../src/game/fighterGenerator';
import { moderateImage, detectObjectCategory, getModerationErrorMessage } from '../src/utils/safety';

type ScanState = 'idle' | 'scanning' | 'error';

export default function ScanScreen() {
  const { setPendingFighter, player } = useGameStore();
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progressText, setProgressText] = useState('');
  const spinner = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const hasScanCredits = player.currency.scanCredits > 0;

  function startSpinner() {
    Animated.loop(
      Animated.timing(spinner, { toValue: 1, duration: 1200, useNativeDriver: true })
    ).start();
  }

  async function processImage(uri: string) {
    setScanState('scanning');
    setErrorMsg('');
    startSpinner();

    try {
      setProgressText('Checking image safety...');
      const modResult = await moderateImage(uri);
      if (!modResult.safe) {
        setScanState('error');
        setErrorMsg(getModerationErrorMessage(modResult.reason));
        return;
      }

      setProgressText('Identifying object...');
      const objectType = await detectObjectCategory(uri);

      if (!objectType) {
        setScanState('error');
        setErrorMsg(getModerationErrorMessage('object_not_detected'));
        return;
      }

      setProgressText('Forging your fighter...');
      await new Promise((r) => setTimeout(r, 500));

      const fighter = generateFighter({ imageUri: uri, detectedObjectType: objectType });
      setPendingFighter(fighter);

      router.replace('/reveal');
    } catch {
      setScanState('error');
      setErrorMsg(getModerationErrorMessage('network_error'));
    }
  }

  async function openCamera() {
    if (!hasScanCredits) {
      Alert.alert(
        'Out of Scan Credits',
        'You need scan credits to scan more objects. Get more from the shop!',
        [
          { text: 'Go to Shop', onPress: () => router.push('/shop') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Camera permission is needed to scan objects.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      processImage(result.assets[0].uri);
    }
  }

  async function openGallery() {
    if (!hasScanCredits) {
      Alert.alert(
        'Out of Scan Credits',
        'You need scan credits to scan more objects. Get more from the shop!',
        [
          { text: 'Go to Shop', onPress: () => router.push('/shop') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      processImage(result.assets[0].uri);
    }
  }

  const spinRotate = spinner.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScreenHeader title="Scan Object" subtitle={`${player.currency.scanCredits} credits remaining`} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Safety Notice */}
        <View style={styles.safetyCard}>
          <Text style={styles.safetyEmoji}>🔒</Text>
          <View style={styles.safetyText}>
            <Text style={styles.safetyTitle}>Safety First</Text>
            <Text style={styles.safetySub}>
              Do not scan faces, IDs, documents, medical images, or private information.
              Object Arena is for household objects, snacks, and everyday items only.
            </Text>
          </View>
        </View>

        {scanState === 'idle' && (
          <>
            {/* Camera placeholder */}
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraEmoji}>📷</Text>
              <Text style={styles.cameraTitle}>What will fight today?</Text>
              <Text style={styles.cameraSub}>
                Scan a shoe, cup, keyboard, snack, toy, or any everyday object.
              </Text>
            </View>

            {/* Object ideas */}
            <View style={styles.ideasWrap}>
              <Text style={styles.ideasTitle}>Object ideas</Text>
              <View style={styles.ideaChips}>
                {['👟 Shoe', '☕ Cup', '⌨️ Keyboard', '🍶 Bottle', '📚 Book', '🧸 Toy', '🪑 Chair', '🍟 Snack', '📱 Phone'].map((item) => (
                  <View key={item} style={styles.ideaChip}>
                    <Text style={styles.ideaChipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Button label="Take Photo" onPress={openCamera} emoji="📸" size="lg" variant="primary" />
            <Button label="Upload from Gallery" onPress={openGallery} emoji="🖼️" size="lg" variant="ghost" />
          </>
        )}

        {scanState === 'scanning' && (
          <View style={styles.scanningState}>
            <Animated.Text
              style={[styles.scanningSpinner, { transform: [{ rotate: spinRotate }] }]}
            >
              ⚡
            </Animated.Text>
            <Text style={styles.scanningTitle}>Forging Your Fighter...</Text>
            <Text style={styles.scanningProgress}>{progressText}</Text>
            <View style={styles.scanSteps}>
              {['🔍 Scanning object', '🧬 Generating stats', '⚔️ Assigning class', '✨ Finalizing powers'].map(
                (step, i) => (
                  <Text key={step} style={styles.scanStep}>{step}</Text>
                )
              )}
            </View>
          </View>
        )}

        {scanState === 'error' && (
          <View style={styles.errorState}>
            <Text style={styles.errorEmoji}>❌</Text>
            <Text style={styles.errorTitle}>Scan Failed</Text>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            <Button
              label="Try Again"
              onPress={() => setScanState('idle')}
              variant="primary"
              size="lg"
            />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1035',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.warning + '44',
    gap: 12,
    alignItems: 'flex-start',
  },
  safetyEmoji: { fontSize: 20 },
  safetyText: { flex: 1, gap: 4 },
  safetyTitle: { fontSize: 13, fontWeight: '700', color: Colors.warning },
  safetySub: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  cameraPlaceholder: {
    height: 240,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  cameraEmoji: { fontSize: 64 },
  cameraTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  cameraSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  ideasWrap: { gap: 10 },
  ideasTitle: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
  ideaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ideaChip: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ideaChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  scanningState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  scanningSpinner: { fontSize: 72 },
  scanningTitle: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  scanningProgress: { fontSize: 14, color: Colors.primaryLight, fontWeight: '600' },
  scanSteps: { gap: 8, alignItems: 'center', marginTop: 8 },
  scanStep: { fontSize: 13, color: Colors.textMuted },
  errorState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
    paddingHorizontal: 20,
  },
  errorEmoji: { fontSize: 64 },
  errorTitle: { fontSize: 22, fontWeight: '900', color: Colors.danger },
  errorMsg: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
