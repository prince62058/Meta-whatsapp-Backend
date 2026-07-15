// ============================================================
// MarketingKart.ai — Profile Screen
// ============================================================
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_PROFILE} from '../mockData';

function StatChip({icon, value, label, color}) {
  return (
    <View style={styles.statChip}>
      <View style={[styles.statIconBg, {backgroundColor: color + '22'}]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({icon, label, onPress, danger}) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingsIconBg, {backgroundColor: danger ? COLORS.errorBg : COLORS.pageBg}]}>
        <Ionicons name={icon} size={18} color={danger ? COLORS.error : COLORS.primary} />
      </View>
      <Text style={[styles.settingsLabel, danger && {color: COLORS.error}]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={danger ? COLORS.error : COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const SETTINGS = [
  {icon: 'person-outline', label: 'Account Settings'},
  {icon: 'business-outline', label: 'Business Tools'},
  {icon: 'code-slash-outline', label: 'API Configuration'},
  {icon: 'help-circle-outline', label: 'Help & Support', nav: 'HelpSupport'},
];

export default function ProfileScreen({setActiveTab, navigation}) {
  const profile = MOCK_PROFILE;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({index: 0, routes: [{name: 'Login'}]});
        },
      },
    ]);
  };

  const handleNav = (nav) => {
    if (nav) navigation.navigate(nav);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.hero}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {profile.ownerName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.businessName}>{profile.businessName}</Text>
          <Text style={styles.ownerName}>{profile.ownerName}</Text>
          <View style={styles.waPill}>
            <View style={styles.waDot} />
            <Text style={styles.waPillText}>WA Active</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsCard}>
          <StatChip icon="megaphone-outline" value={profile.stats.campaigns} label="Campaigns" color={COLORS.primary} />
          <View style={styles.statDivider} />
          <StatChip icon="documents-outline" value={profile.stats.templates} label="Templates" color="#8B5CF6" />
          <View style={styles.statDivider} />
          <StatChip icon="people-outline" value={profile.stats.contacts.toLocaleString('en-IN')} label="Contacts" color={COLORS.waGreenDark} />
        </View>

        {/* Upgrade Card */}
        <LinearGradient
          colors={['#F59E0B', '#F97316']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.upgradeCard}>
          <View style={styles.upgradeLeft}>
            <Ionicons name="diamond" size={28} color={COLORS.white} />
            <View style={{marginLeft: 12}}>
              <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
              <Text style={styles.upgradeSub}>10,000 contacts · 100 campaigns/mo</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => navigation.navigate('Pricing')}>
            <Text style={styles.upgradeBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Settings */}
        <View style={styles.settingsCard}>
          {SETTINGS.map((s, i) => (
            <React.Fragment key={s.label}>
              <SettingsRow icon={s.icon} label={s.label} onPress={() => handleNav(s.nav)} />
              {i < SETTINGS.length - 1 && <View style={styles.settingsSep} />}
            </React.Fragment>
          ))}
          <View style={styles.settingsSep} />
          <SettingsRow icon="log-out-outline" label="Logout" onPress={handleLogout} danger />
        </View>

        {/* Footer */}
        <Text style={styles.footer}>MarketingKart.ai • v1.0.0 (Beta)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.pageBg},
  hero: {alignItems: 'center', paddingTop: 32, paddingBottom: 40, paddingHorizontal: 20},
  avatarCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
  },
  avatarText: {fontFamily: FONTS.bold, fontSize: 26, color: COLORS.white},
  businessName: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.white, marginBottom: 2},
  ownerName: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: 'rgba(255,255,255,0.8)', marginBottom: 12},
  waPill: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(37,211,102,0.2)', borderRadius: SIZES.radiusFull, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.waGreen},
  waDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.waGreen},
  waPillText: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.waGreen},
  statsCard: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    marginHorizontal: SIZES.lg, marginTop: -20,
    borderRadius: SIZES.radiusMd, padding: 16,
    alignItems: 'center', ...SHADOWS.md,
  },
  statChip: {flex: 1, alignItems: 'center', gap: 6},
  statIconBg: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  statValue: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle},
  statLabel: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted},
  statDivider: {width: 1, height: 40, backgroundColor: COLORS.pageBg},
  upgradeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: SIZES.lg, marginTop: 16,
    borderRadius: SIZES.radiusMd, padding: 16,
  },
  upgradeLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  upgradeTitle: {fontFamily: FONTS.bold, fontSize: SIZES.bodyLg, color: COLORS.white},
  upgradeSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.85)', marginTop: 2},
  upgradeBtn: {backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: SIZES.radiusMd, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)'},
  upgradeBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.white},
  settingsCard: {backgroundColor: COLORS.white, marginHorizontal: SIZES.lg, marginTop: 16, borderRadius: SIZES.radiusMd, overflow: 'hidden', ...SHADOWS.sm},
  settingsRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12},
  settingsIconBg: {width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  settingsLabel: {flex: 1, fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textTitle},
  settingsSep: {height: 1, backgroundColor: COLORS.pageBg, marginLeft: 62},
  footer: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textInactive, textAlign: 'center', paddingVertical: 24},
});
