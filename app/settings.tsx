import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import ScreenHeader from '../src/components/ScreenHeader';
import { Colors } from '../src/theme/colors';

function SettingRow({
  emoji,
  title,
  subtitle,
  onPress,
  right,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={styles.settingEmoji}>{emoji}</Text>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSub}>{subtitle}</Text>}
      </View>
      {right && <View>{right}</View>}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { player, updateSettings, resetAllData } = useGameStore();
  const { settings } = player;

  function handleReset() {
    Alert.alert(
      'Delete All Data?',
      'This will permanently delete your fighters, progress, and coins. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            router.replace('/');
          },
        },
      ]
    );
  }

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScreenHeader title="Settings" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Audio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          <View style={styles.card}>
            <SettingRow
              emoji="🔊"
              title="Sound Effects"
              subtitle="Battle sounds, hit effects, UI clicks"
              right={
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={(v) => updateSettings({ soundEnabled: v })}
                  trackColor={{ true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              emoji="🎵"
              title="Background Music"
              subtitle="Arena music and ambient sounds"
              right={
                <Switch
                  value={settings.musicEnabled}
                  onValueChange={(v) => updateSettings({ musicEnabled: v })}
                  trackColor={{ true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              emoji="📳"
              title="Haptic Feedback"
              subtitle="Vibrations on attacks and rewards"
              right={
                <Switch
                  value={settings.hapticEnabled}
                  onValueChange={(v) => updateSettings({ hapticEnabled: v })}
                  trackColor={{ true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              }
            />
          </View>
        </View>

        {/* Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <View style={styles.card}>
            <SettingRow
              emoji="🎭"
              title="Reduced Motion"
              subtitle="Simplify battle animations and effects"
              right={
                <Switch
                  value={settings.reducedMotion}
                  onValueChange={(v) => updateSettings({ reducedMotion: v })}
                  trackColor={{ true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              }
            />
          </View>
        </View>

        {/* Privacy & Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Safety</Text>
          <View style={styles.card}>
            <SettingRow
              emoji="🔒"
              title="Privacy Policy"
              subtitle="How we handle your data (placeholder)"
              onPress={() => Alert.alert('Privacy Policy', 'Full privacy policy will be linked here before launch. Object Arena stores all data locally on your device in MVP mode.')}
              right={<Text style={styles.chevron}>›</Text>}
            />
            <View style={styles.divider} />
            <SettingRow
              emoji="📋"
              title="Terms of Service"
              subtitle="Game terms and usage rules (placeholder)"
              onPress={() => Alert.alert('Terms of Service', 'Full terms of service will be linked here before launch.')}
              right={<Text style={styles.chevron}>›</Text>}
            />
            <View style={styles.divider} />
            <SettingRow
              emoji="🛡️"
              title="Content Safety"
              subtitle="Reporting inappropriate content"
              onPress={() =>
                Alert.alert(
                  'Content Safety',
                  'Object Arena uses image moderation to prevent inappropriate content. If you see something that should not be in the app, please report it using the feedback option below.'
                )
              }
              right={<Text style={styles.chevron}>›</Text>}
            />
          </View>
        </View>

        {/* Content Safety Info */}
        <View style={styles.safetyCard}>
          <Text style={styles.safetyTitle}>🔒 Image Privacy Notice</Text>
          <Text style={styles.safetyText}>
            Photos taken within Object Arena are processed for object detection only.
            In MVP mode, no images are sent to external servers.{'\n\n'}
            In production, images are analyzed by AI vision API and immediately discarded.
            We do not store or share your photos. We never scan faces, IDs, medical images,
            or private documents.
          </Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <SettingRow
              emoji="📱"
              title="Object Arena"
              subtitle="Version 1.0.0 MVP"
            />
            <View style={styles.divider} />
            <SettingRow
              emoji="💌"
              title="Send Feedback"
              subtitle="Report bugs or suggest features"
              onPress={() => Alert.alert('Feedback', 'Feedback email will be configured here before launch.')}
              right={<Text style={styles.chevron}>›</Text>}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.danger }]}>Danger Zone</Text>
          <View style={[styles.card, { borderColor: Colors.danger + '44' }]}>
            <SettingRow
              emoji="🗑️"
              title="Delete All Local Data"
              subtitle="Permanently removes fighters, progress, and coins"
              onPress={handleReset}
              right={<Text style={[styles.chevron, { color: Colors.danger }]}>›</Text>}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 6 },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: { height: 1, backgroundColor: Colors.bgSurface, marginHorizontal: 16 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingEmoji: { fontSize: 22, width: 28, textAlign: 'center' },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  settingSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2, lineHeight: 16 },
  chevron: { fontSize: 20, color: Colors.textMuted },
  safetyCard: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    gap: 8,
  },
  safetyTitle: { fontSize: 14, fontWeight: '800', color: Colors.primaryLight },
  safetyText: { fontSize: 12, color: Colors.textMuted, lineHeight: 20 },
});
