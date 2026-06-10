import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import ScreenHeader from '../src/components/ScreenHeader';
import { Colors } from '../src/theme/colors';
import { SHOP_ITEMS } from '../src/data/shopItems';
import { ShopItem } from '../src/types/economy';

type ShopTab = 'featured' | 'cosmetics' | 'currency' | 'extras';

const TABS: { key: ShopTab; label: string; emoji: string }[] = [
  { key: 'featured', label: 'Featured', emoji: '⭐' },
  { key: 'currency', label: 'Currency', emoji: '💰' },
  { key: 'cosmetics', label: 'Cosmetics', emoji: '✨' },
  { key: 'extras', label: 'Extras', emoji: '🎁' },
];

const RARITY_COLORS: Record<string, string> = {
  common: Colors.textMuted,
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: Colors.gold,
};

export default function ShopScreen() {
  const { player, spendCoins, spendGems } = useGameStore();
  const [activeTab, setActiveTab] = useState<ShopTab>('featured');

  function getTabItems(): ShopItem[] {
    switch (activeTab) {
      case 'featured': return SHOP_ITEMS.filter((i) => i.isFeatured);
      case 'currency': return SHOP_ITEMS.filter((i) => i.type === 'currency' || i.type === 'scan_credits');
      case 'cosmetics': return SHOP_ITEMS.filter((i) => ['cosmetic', 'voice_pack', 'battle_effect'].includes(i.type));
      case 'extras': return SHOP_ITEMS.filter((i) => ['remove_ads', 'battle_pass'].includes(i.type));
    }
  }

  function handlePurchase(item: ShopItem) {
    // PLACEHOLDER: Real payment flows connect to Apple IAP / Google Play Billing
    // via expo-in-app-purchases or react-native-purchases (RevenueCat)
    if (item.currency === 'usd') {
      Alert.alert(
        `Buy ${item.name}`,
        `This would cost $${item.price}.\n\n(Real payment not implemented in MVP. Connect Apple IAP or Google Play Billing for production.)`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (item.currency === 'coins') {
      const success = spendCoins(item.price);
      if (!success) {
        Alert.alert('Not Enough Coins', `You need ${item.price} coins but have ${player.currency.coins}.`);
        return;
      }
      Alert.alert('Purchased!', `${item.emoji} ${item.name} unlocked!`);
      return;
    }

    if (item.currency === 'gems') {
      const success = spendGems(item.price);
      if (!success) {
        Alert.alert('Not Enough Gems', `You need ${item.price} gems but have ${player.currency.gems}.`);
        return;
      }
      Alert.alert('Purchased!', `${item.emoji} ${item.name} unlocked!`);
    }
  }

  const items = getTabItems();

  return (
    <LinearGradient colors={[Colors.bgDeep, '#110828', Colors.bgDeep]} style={styles.container}>
      <ScreenHeader title="Shop" subtitle="Spend your hard-earned chaos" />

      {/* Currency display */}
      <View style={styles.currencyBar}>
        <View style={styles.currencyChip}>
          <Text style={styles.currencyEmoji}>🪙</Text>
          <Text style={[styles.currencyAmount, { color: Colors.gold }]}>
            {player.currency.coins.toLocaleString()}
          </Text>
        </View>
        <View style={styles.currencyChip}>
          <Text style={styles.currencyEmoji}>💎</Text>
          <Text style={[styles.currencyAmount, { color: Colors.gem }]}>
            {player.currency.gems}
          </Text>
        </View>
        <View style={styles.currencyChip}>
          <Text style={styles.currencyEmoji}>📸</Text>
          <Text style={styles.currencyAmount}>{player.currency.scanCredits}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
          >
            <Text style={styles.tabEmoji}>{t.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Ad removal banner */}
        {activeTab === 'featured' && (
          <LinearGradient
            colors={[Colors.gold + '33', Colors.bgCard]}
            style={styles.bpBanner}
          >
            <Text style={styles.bpEmoji}>🏆</Text>
            <View style={styles.bpInfo}>
              <Text style={styles.bpTitle}>Arena Battle Pass</Text>
              <Text style={styles.bpSub}>Exclusive fighters · Effects · 2x daily rewards</Text>
            </View>
            <TouchableOpacity
              style={styles.bpBuy}
              onPress={() => handlePurchase(SHOP_ITEMS.find((i) => i.id === 'battle_pass')!)}
            >
              <Text style={styles.bpBuyText}>$4.99</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>Nothing here yet. Check back soon!</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePurchase(item)}
                activeOpacity={0.85}
                style={styles.itemCard}
              >
                <LinearGradient
                  colors={[`${RARITY_COLORS[item.rarity]}22`, Colors.bgCard]}
                  style={styles.itemGrad}
                >
                  {item.isFeatured && (
                    <View style={styles.featuredBadge}>
                      <Text style={styles.featuredText}>⭐ HOT</Text>
                    </View>
                  )}
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPriceEmoji}>
                      {item.currency === 'coins' ? '🪙' : item.currency === 'gems' ? '💎' : '💵'}
                    </Text>
                    <Text style={[
                      styles.itemPrice,
                      { color: item.currency === 'coins' ? Colors.gold : item.currency === 'gems' ? Colors.gem : Colors.success }
                    ]}>
                      {item.currency === 'usd' ? `$${item.price}` : item.price.toLocaleString()}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            💡 Real payments not active in MVP. All purchases are placeholder.
            Connect Apple IAP / Google Play Billing for production monetization.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  currencyBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  currencyChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencyEmoji: { fontSize: 14 },
  currencyAmount: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    paddingVertical: 8,
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { borderColor: Colors.primaryLight, backgroundColor: `${Colors.primaryLight}22` },
  tabEmoji: { fontSize: 14 },
  tabLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  tabLabelActive: { color: Colors.primaryLight },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  bpBanner: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.gold + '44',
  },
  bpEmoji: { fontSize: 36 },
  bpInfo: { flex: 1 },
  bpTitle: { fontSize: 16, fontWeight: '800', color: Colors.gold },
  bpSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  bpBuy: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  bpBuyText: { fontSize: 14, fontWeight: '900', color: Colors.bgDeep },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  itemCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemGrad: { padding: 14, gap: 6, minHeight: 150 },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.gold + '33',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  featuredText: { fontSize: 9, fontWeight: '800', color: Colors.gold },
  itemEmoji: { fontSize: 32, marginBottom: 2 },
  itemName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  itemDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 16, flex: 1 },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  itemPriceEmoji: { fontSize: 14 },
  itemPrice: { fontSize: 16, fontWeight: '900' },
  emptyCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  privacyNote: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  privacyText: { fontSize: 11, color: Colors.textMuted, lineHeight: 18, textAlign: 'center' },
});
