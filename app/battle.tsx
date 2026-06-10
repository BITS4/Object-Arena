import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import HealthBar from '../src/components/HealthBar';
import { Colors } from '../src/theme/colors';
import { simulateBattle } from '../src/game/battleSimulator';
import { MOCK_OPPONENTS } from '../src/data/mockOpponents';
import { Fighter } from '../src/types/fighter';
import { BattleEvent } from '../src/types/battle';
import { OBJECT_TYPES } from '../src/data/objectTypes';

export default function BattleScreen() {
  const { fighterId, opponentId } = useLocalSearchParams<{
    fighterId: string;
    opponentId: string;
  }>();

  const { fighters, pendingFighter, recordBattleResult } = useGameStore();

  const allFighters = pendingFighter ? [pendingFighter, ...fighters] : fighters;
  const myFighter = allFighters.find((f) => f.id === fighterId);
  const opponent =
    MOCK_OPPONENTS.find((o) => o.id === opponentId) ??
    fighters.find((f) => f.id === opponentId);

  const [battleEvents, setBattleEvents] = useState<BattleEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [myHp, setMyHp] = useState(myFighter?.maxHp ?? 100);
  const [oppHp, setOppHp] = useState(opponent?.maxHp ?? 100);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [displayedLog, setDisplayedLog] = useState<string[]>([]);

  const myShake = useRef(new Animated.Value(0)).current;
  const oppShake = useRef(new Animated.Value(0)).current;
  const myScale = useRef(new Animated.Value(1)).current;
  const oppScale = useRef(new Animated.Value(1)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const battleResult = useRef<ReturnType<typeof simulateBattle> | null>(null);
  const eventTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!myFighter || !opponent) return;
    battleResult.current = simulateBattle(myFighter, opponent);
    setBattleEvents(battleResult.current.events);
  }, []);

  useEffect(() => {
    if (battleEvents.length === 0) return;
    playNextEvent(0);
  }, [battleEvents]);

  function shake(target: Animated.Value) {
    Animated.sequence([
      Animated.timing(target, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(target, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(target, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(target, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function bounce(target: Animated.Value) {
    Animated.sequence([
      Animated.spring(target, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(target, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }

  function flash() {
    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.35, duration: 80, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }

  function playNextEvent(index: number) {
    if (!battleResult.current) return;

    if (index >= battleResult.current.events.length) {
      setIsBattleOver(true);
      recordBattleResult(battleResult.current, myFighter!.id);
      setTimeout(() => {
        router.replace('/battle-result');
      }, 1500);
      return;
    }

    const ev = battleResult.current.events[index];

    // Update HPs from the event
    if (ev.attackerId === myFighter?.id) {
      setOppHp(ev.defenderHpAfter);
      if (ev.damage > 0) { shake(oppShake); bounce(oppScale); flash(); }
    } else {
      setMyHp(ev.defenderHpAfter);
      if (ev.damage > 0) { shake(myShake); bounce(myScale); flash(); }
    }

    setDisplayedLog((prev) => [ev.caption, ...prev.slice(0, 5)]);
    setCurrentEventIndex(index);

    const delay = ev.type === 'special' ? 1200 / speed : 700 / speed;
    eventTimer.current = setTimeout(() => playNextEvent(index + 1), delay);
  }

  function handleSkip() {
    if (eventTimer.current) clearTimeout(eventTimer.current);
    if (!battleResult.current) return;
    setIsBattleOver(true);
    recordBattleResult(battleResult.current, myFighter!.id);
    router.replace('/battle-result');
  }

  if (!myFighter || !opponent) {
    return (
      <LinearGradient colors={[Colors.bgDeep, Colors.bgDeep]} style={styles.center}>
        <Text style={styles.errorText}>Battle setup error. Please try again.</Text>
      </LinearGradient>
    );
  }

  const myType = OBJECT_TYPES[myFighter.objectType];
  const oppType = OBJECT_TYPES[opponent.objectType];

  return (
    <LinearGradient colors={['#0a0118', '#1a0840', '#0a0118']} style={styles.container}>
      {/* Flash overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.flash, { opacity: flashOpacity }]}
        pointerEvents="none"
      />

      {/* ARENA */}
      <View style={styles.arena}>
        {/* My fighter */}
        <Animated.View
          style={[
            styles.fighterSlot,
            { transform: [{ translateX: myShake }, { scale: myScale }] },
          ]}
        >
          <HealthBar
            current={myHp}
            max={myFighter.maxHp}
            label={myFighter.name}
          />
          <View style={[styles.fighterCircle, { backgroundColor: `${myFighter.colorTheme}33`, borderColor: myFighter.colorTheme }]}>
            <Text style={styles.fighterEmojiB}>{myType?.emoji ?? '⚔️'}</Text>
          </View>
          <Text style={styles.fighterNameSmall} numberOfLines={1}>{myFighter.class}</Text>
        </Animated.View>

        {/* VS */}
        <View style={styles.vsWrap}>
          <Text style={styles.vs}>VS</Text>
          <Text style={styles.roundText}>Round {currentEventIndex + 1}</Text>
        </View>

        {/* Opponent */}
        <Animated.View
          style={[
            styles.fighterSlot,
            styles.fighterSlotRight,
            { transform: [{ translateX: oppShake }, { scale: oppScale }] },
          ]}
        >
          <HealthBar
            current={oppHp}
            max={opponent.maxHp}
            label={opponent.name}
            flip
          />
          <View style={[styles.fighterCircle, { backgroundColor: `${opponent.colorTheme}33`, borderColor: opponent.colorTheme }]}>
            <Text style={styles.fighterEmojiB}>{oppType?.emoji ?? '❓'}</Text>
          </View>
          <Text style={styles.fighterNameSmall} numberOfLines={1}>{opponent.class}</Text>
        </Animated.View>
      </View>

      {/* Battle Log */}
      <View style={styles.logContainer}>
        {displayedLog.map((entry, i) => (
          <Text
            key={i}
            style={[
              styles.logEntry,
              i === 0 && styles.logEntryActive,
              i > 0 && { opacity: 0.5 - i * 0.1 },
            ]}
            numberOfLines={2}
          >
            {entry}
          </Text>
        ))}
        {displayedLog.length === 0 && (
          <Text style={styles.logEntry}>The battle begins...</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => setSpeed(speed === 1 ? 2 : 1)}
          style={styles.controlBtn}
        >
          <Text style={styles.controlBtnText}>{speed === 1 ? '▶▶ 2x' : '▶ 1x'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip} style={[styles.controlBtn, styles.skipBtn]}>
          <Text style={styles.controlBtnText}>Skip ⏩</Text>
        </TouchableOpacity>
      </View>

      {isBattleOver && (
        <View style={styles.battleOverBanner}>
          <Text style={styles.battleOverText}>Battle Over! Revealing results...</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  flash: { backgroundColor: Colors.white, zIndex: 100 },
  arena: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    gap: 8,
  },
  fighterSlot: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 12,
  },
  fighterSlotRight: {
    alignItems: 'flex-end',
  },
  fighterCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    alignSelf: 'center',
  },
  fighterEmojiB: { fontSize: 54 },
  fighterNameSmall: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
  },
  vsWrap: { alignItems: 'center', gap: 4, paddingTop: 40 },
  vs: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  roundText: { fontSize: 10, color: Colors.textMuted, fontWeight: '700' },
  logContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 140,
    gap: 6,
  },
  logEntry: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    textAlign: 'center',
  },
  logEntryActive: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipBtn: {
    flex: 2,
    borderColor: Colors.primaryLight + '44',
  },
  controlBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  battleOverBanner: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  battleOverText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  errorText: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center' },
});
