import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../src/store/gameStore';
import FighterCard from '../../src/components/FighterCard';
import CurrencyDisplay from '../../src/components/CurrencyDisplay';
import Button from '../../src/components/Button';
import { Colors } from '../../src/theme/colors';
import { Fighter, Rarity, FighterClass } from '../../src/types/fighter';

type FilterRarity = 'All' | Rarity;
type FilterClass = 'All' | FighterClass;
type SortKey = 'Newest' | 'Strongest' | 'Level';

const RARITY_FILTERS: FilterRarity[] = ['All', 'Common', 'Rare', 'Epic', 'Legendary', 'Absurd'];
const SORT_OPTIONS: SortKey[] = ['Newest', 'Strongest', 'Level'];

export default function CollectionScreen() {
  const { fighters, deleteFighter, toggleFavorite } = useGameStore();
  const [rarityFilter, setRarityFilter] = useState<FilterRarity>('All');
  const [sortKey, setSortKey] = useState<SortKey>('Newest');
  const [search, setSearch] = useState('');

  function filtered(): Fighter[] {
    let list = [...fighters];

    if (search) {
      list = list.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.objectType.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (rarityFilter !== 'All') {
      list = list.filter((f) => f.rarity === rarityFilter);
    }

    switch (sortKey) {
      case 'Newest':
        return list.sort((a, b) => b.createdAt - a.createdAt);
      case 'Strongest':
        return list.sort((a, b) => {
          const aP = a.stats.power + a.stats.defense + a.stats.speed;
          const bP = b.stats.power + b.stats.defense + b.stats.speed;
          return bP - aP;
        });
      case 'Level':
        return list.sort((a, b) => b.level - a.level);
    }
  }

  function handleDelete(f: Fighter) {
    if (f.isLocked) {
      Alert.alert('Locked', `${f.name} is locked and cannot be deleted.`);
      return;
    }
    Alert.alert(
      `Delete ${f.name}?`,
      'This fighter will be permanently removed from your collection.',
      [
        { text: 'Delete', style: 'destructive', onPress: () => deleteFighter(f.id) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  const list = filtered();

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Collection</Text>
          <Text style={styles.subtitle}>{fighters.length} fighters</Text>
        </View>
        <CurrencyDisplay />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search fighters..."
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {/* Rarity Filter */}
      <View style={styles.filterScroll}>
        {RARITY_FILTERS.map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRarityFilter(r)}
            style={[styles.filterChip, rarityFilter === r && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, rarityFilter === r && styles.filterTextActive]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort:</Text>
        {SORT_OPTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSortKey(s)}
            style={[styles.sortBtn, sortKey === s && styles.sortBtnActive]}
          >
            <Text style={[styles.sortText, sortKey === s && styles.sortTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>{fighters.length === 0 ? '📦' : '🔍'}</Text>
          <Text style={styles.emptyTitle}>
            {fighters.length === 0 ? 'No fighters yet!' : 'No fighters match your filter.'}
          </Text>
          <Text style={styles.emptySub}>
            {fighters.length === 0
              ? 'Scan an object to create your first fighter.'
              : 'Try a different filter or search term.'}
          </Text>
          {fighters.length === 0 && (
            <Button label="Scan Object" onPress={() => router.push('/scan')} variant="primary" />
          )}
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(f) => f.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: f }) => (
            <View style={styles.gridItem}>
              <FighterCard
                fighter={f}
                onPress={() => router.push(`/fighter/${f.id}` as any)}
              />
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    marginBottom: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  filterScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: `${Colors.primaryLight}22`,
    borderColor: Colors.primaryLight,
  },
  filterText: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },
  filterTextActive: { color: Colors.primaryLight },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  sortLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },
  sortBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortBtnActive: { borderColor: Colors.primaryLight, backgroundColor: `${Colors.primaryLight}22` },
  sortText: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },
  sortTextActive: { color: Colors.primaryLight },
  grid: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },
  row: { gap: 8 },
  gridItem: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
});
