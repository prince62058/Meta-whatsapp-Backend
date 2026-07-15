import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import GradientButton from '../../components/common/GradientButton';

const MOCK_STATS = [
  {label: 'Campaigns', value: '12', icon: 'megaphone-outline', color: COLORS.primary},
  {label: 'Ads Running', value: '3', icon: 'play-circle-outline', color: COLORS.metaBlue},
  {label: 'Wallet', value: '₹2,450', icon: 'wallet-outline', color: COLORS.waGreen},
];

const MOCK_ACTIVITY = [
  {
    id: '1',
    icon: 'logo-whatsapp',
    iconColor: COLORS.waGreen,
    title: 'WhatsApp Campaign Sent',
    subtitle: 'Diwali Offer — 1,240 contacts reached',
    time: '2 hrs ago',
    bgColor: '#ECFDF5',
  },
  {
    id: '2',
    icon: 'trending-up-outline',
    iconColor: COLORS.metaBlue,
    title: 'Meta Ad Approved',
    subtitle: 'Summer Sale Ad Set is now live',
    time: '5 hrs ago',
    bgColor: '#EFF6FF',
  },
  {
    id: '3',
    icon: 'person-add-outline',
    iconColor: COLORS.primary,
    title: 'New Contacts Imported',
    subtitle: '320 contacts added to CRM',
    time: 'Yesterday',
    bgColor: '#EEF2FF',
  },
];

export default function HomeScreen({navigation}) {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    AsyncStorage.getItem('user_data')
      .then(raw => {
        if (raw) {
          const u = JSON.parse(raw);
          setUserName(u.name ? u.name.split(' ')[0] : 'User');
        }
      })
      .catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* ── Indigo Gradient Header ── */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}>

          {/* Top row */}
          <View style={styles.headerTop}>
            <View style={styles.mkBadge}>
              <LinearGradient
                colors={[COLORS.brandOrange, COLORS.brandOrangeLight]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.mkBadgeGrad}>
                <Text style={styles.mkBadgeText}>MK</Text>
              </LinearGradient>
            </View>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
              <Icon name="notifications-outline" size={24} color={COLORS.white} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <Text style={styles.greeting}>{greeting}, {userName}! 👋</Text>
          <Text style={styles.dashboardLabel}>MarketingKart.ai Dashboard</Text>

          {/* Curved bottom spacer */}
          <View style={styles.headerCurve} />
        </LinearGradient>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          {MOCK_STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIconWrap, {backgroundColor: s.color + '18'}]}>
                <Icon name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Feature Cards ── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* WhatsApp Marketing */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('WhatsApp')}
          style={styles.featureCardWrapper}>
          <LinearGradient
            colors={[COLORS.waGreen, COLORS.waGreenDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.featureCard}>
            <View style={styles.featureCardIconWrap}>
              <Icon name="logo-whatsapp" size={38} color={COLORS.white} />
            </View>
            <View style={styles.featureCardText}>
              <Text style={styles.featureCardTitle}>WhatsApp Marketing</Text>
              <Text style={styles.featureCardSub}>Campaigns · Templates · CRM</Text>
            </View>
            <Icon name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Meta Ads */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Ads')}
          style={styles.featureCardWrapper}>
          <LinearGradient
            colors={[COLORS.metaBlue, COLORS.metaBlueDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.featureCard}>
            <View style={styles.featureCardIconWrap}>
              <Icon name="megaphone" size={38} color={COLORS.white} />
            </View>
            <View style={styles.featureCardText}>
              <Text style={styles.featureCardTitle}>Meta Ads</Text>
              <Text style={styles.featureCardSub}>Facebook · Instagram Ads</Text>
            </View>
            <Icon name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Recent Activity ── */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {MOCK_ACTIVITY.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.activityRow}>
                <View style={[styles.activityIconWrap, {backgroundColor: item.bgColor}]}>
                  <Icon name={item.icon} size={22} color={item.iconColor} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySub}>{item.subtitle}</Text>
                </View>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              {idx < MOCK_ACTIVITY.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── Wallet Banner ── */}
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.walletBanner}>
          <View>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>₹2,450</Text>
          </View>
          <GradientButton
            title="Add Money"
            colors={[COLORS.brandOrange, COLORS.brandOrangeLight]}
            style={styles.addMoneyBtn}
            textStyle={styles.addMoneyText}
            onPress={() => {}}
          />
        </LinearGradient>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.pageBg},
  scroll: {paddingBottom: 32},

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20,
    paddingBottom: 52,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mkBadge: {...SHADOWS.md},
  mkBadgeGrad: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mkBadgeText: {fontFamily: FONTS.bold, fontSize: 15, color: COLORS.white},
  bellBtn: {position: 'relative', padding: 4},
  bellDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.brandOrange,
    position: 'absolute',
    top: 4,
    right: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  greeting: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.titleLg,
    color: COLORS.white,
    marginBottom: 2,
  },
  dashboardLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.75)',
  },
  headerCurve: {height: 0},

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -28,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 12,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: SIZES.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.subtitle,
    color: COLORS.textTitle,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // Section title
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.subtitle,
    color: COLORS.textTitle,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  // Feature Cards
  featureCardWrapper: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: SIZES.radiusLg,
  },
  featureCardIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureCardText: {flex: 1},
  featureCardTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.subtitle,
    color: COLORS.white,
    marginBottom: 3,
  },
  featureCardSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.8)',
  },

  // Activity
  activityCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    ...SHADOWS.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {flex: 1, marginRight: 8},
  activityTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body,
    color: COLORS.textTitle,
    marginBottom: 2,
  },
  activitySub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  activityTime: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textInactive,
  },
  divider: {height: 1, backgroundColor: '#F1F5F9', marginLeft: 54},

  // Wallet banner
  walletBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.md,
  },
  walletLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  walletAmount: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
  },
  addMoneyBtn: {borderRadius: SIZES.radiusMd, overflow: 'hidden'},
  addMoneyText: {fontSize: SIZES.small, paddingVertical: 0},
});
