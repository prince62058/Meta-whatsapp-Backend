// ============================================================
// MarketingKart.ai — Plans & Pricing Screen
// ============================================================
import React, {useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_PLANS, MOCK_WALLET} from '../../../utils/mockData';

function PlanCard({plan, walletBalance, onBuy}) {
  return (
    <View style={[styles.card, plan.isCurrent && styles.cardCurrent]}>
      <LinearGradient colors={plan.gradientColors} style={styles.cardHeader} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
        <View style={styles.cardHeaderTop}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.badgeRow}>
            {plan.isCurrent && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>CURRENT</Text>
              </View>
            )}
            {plan.isBestValue && (
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>BEST VALUE</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.planPrice}>₹{plan.price.toLocaleString('en-IN')}</Text>
        <Text style={styles.planPeriod}>per {plan.period}</Text>
      </LinearGradient>

      <View style={styles.cardBody}>
        <View style={styles.limitsRow}>
          <LimitChip icon="people-outline" label="Contacts" value={plan.contacts === -1 ? '∞' : plan.contacts.toLocaleString('en-IN')} />
          <LimitChip icon="megaphone-outline" label="Campaigns" value={plan.campaigns === -1 ? '∞' : plan.campaigns} />
          <LimitChip icon="documents-outline" label="Templates" value={plan.templates === -1 ? '∞' : plan.templates} />
        </View>

        <View style={styles.featuresList}>
          {plan.features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.waGreen} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {plan.isCurrent ? (
          <View style={styles.activeBtn}>
            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.success} />
            <Text style={styles.activeBtnText}>Active Plan</Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.buyBtn, {backgroundColor: plan.gradientColors[0]}]} onPress={() => onBuy(plan)}>
            <Text style={styles.buyBtnText}>Buy {plan.name} Plan</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function LimitChip({icon, label, value}) {
  return (
    <View style={styles.limitChip}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
      <Text style={styles.limitValue}>{value}</Text>
      <Text style={styles.limitLabel}>{label}</Text>
    </View>
  );
}

export default function PricingScreen({navigation}) {
  const [walletBalance, setWalletBalance] = useState(MOCK_WALLET.balance);
  const currentPlan = MOCK_PLANS.find(p => p.isCurrent);

  const handleBuy = (plan) => {
    if (walletBalance < plan.price) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient Balance',
        text2: `You need ₹${plan.price} but have ₹${walletBalance}. Add money to wallet.`,
        position: 'top',
      });
      return;
    }
    setWalletBalance(prev => prev - plan.price);
    Toast.show({
      type: 'success',
      text1: `${plan.name} Plan Activated! 🎉`,
      text2: `₹${plan.price} deducted from your wallet.`,
      position: 'top',
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plans & Pricing</Text>
        <View style={{width: 34}} />
      </LinearGradient>

      {/* Wallet Balance Strip */}
      <TouchableOpacity style={styles.walletStrip} onPress={() => navigation.navigate('Wallet')}>
        <View style={styles.walletStripLeft}>
          <Ionicons name="wallet-outline" size={20} color={COLORS.primary} />
          <Text style={styles.walletStripLabel}>Wallet Balance</Text>
        </View>
        <View style={styles.walletStripRight}>
          <Text style={styles.walletStripBalance}>₹{walletBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </View>
      </TouchableOpacity>

      {/* Active Subscription Banner */}
      {currentPlan && (
        <View style={styles.activeBanner}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
          <Text style={styles.activeBannerText}>
            Active: <Text style={{fontFamily: FONTS.bold}}>{currentPlan.name} Plan</Text> — Renews monthly
          </Text>
        </View>
      )}

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 32}}>
        <Text style={styles.sectionSub}>Choose a plan that fits your business needs</Text>
        {MOCK_PLANS.map(plan => (
          <PlanCard key={plan.id} plan={plan} walletBalance={walletBalance} onBuy={handleBuy} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.lg, paddingVertical: 14},
  backBtn: {width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.title, color: COLORS.white},
  walletStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, paddingHorizontal: SIZES.lg, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.pageBg,
  },
  walletStripLeft: {flexDirection: 'row', alignItems: 'center', gap: 8},
  walletStripLabel: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textSecondary},
  walletStripRight: {flexDirection: 'row', alignItems: 'center', gap: 4},
  walletStripBalance: {fontFamily: FONTS.bold, fontSize: SIZES.bodyLg, color: COLORS.primary},
  activeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.successBg, paddingHorizontal: SIZES.lg, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#BBF7D0',
  },
  activeBannerText: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.successDark},
  body: {flex: 1},
  sectionSub: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center', paddingVertical: 16, paddingHorizontal: SIZES.lg},
  card: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, marginHorizontal: SIZES.lg, marginBottom: 16, overflow: 'hidden', ...SHADOWS.md},
  cardCurrent: {borderWidth: 2, borderColor: COLORS.primary},
  cardHeader: {padding: 20},
  cardHeaderTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8},
  planName: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.white},
  badgeRow: {flexDirection: 'row', gap: 6},
  currentBadge: {backgroundColor: COLORS.waGreen, borderRadius: SIZES.radiusFull, paddingHorizontal: 10, paddingVertical: 3},
  currentBadgeText: {fontFamily: FONTS.bold, fontSize: 10, color: COLORS.white},
  bestBadge: {backgroundColor: '#FF8C00', borderRadius: SIZES.radiusFull, paddingHorizontal: 10, paddingVertical: 3},
  bestBadgeText: {fontFamily: FONTS.bold, fontSize: 10, color: COLORS.white},
  planPrice: {fontFamily: FONTS.bold, fontSize: 30, color: COLORS.white},
  planPeriod: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: 'rgba(255,255,255,0.8)'},
  cardBody: {padding: 16},
  limitsRow: {flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16},
  limitChip: {alignItems: 'center', gap: 4, flex: 1},
  limitValue: {fontFamily: FONTS.bold, fontSize: SIZES.bodyLg, color: COLORS.textTitle},
  limitLabel: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted},
  featuresList: {gap: 8, marginBottom: 16},
  featureRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  featureText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody},
  buyBtn: {borderRadius: SIZES.radiusMd, paddingVertical: 13, alignItems: 'center'},
  buyBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.bodyLg, color: COLORS.white},
  activeBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 13, backgroundColor: COLORS.successBg, borderRadius: SIZES.radiusMd},
  activeBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.success},
});
