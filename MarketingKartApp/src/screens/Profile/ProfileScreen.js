import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import {useAuth} from '../../context/AuthContext';

const MENU = [
  {icon: 'person-circle-outline', label: 'Account Settings', sub: 'Update profile & password'},
  {icon: 'business-outline', label: 'Business Settings', sub: 'Manage your business info'},
  {icon: 'card-outline', label: 'Billing & Wallet', sub: 'Payments, invoices & credits'},
  {icon: 'notifications-outline', label: 'Notifications', sub: 'Manage alerts & reminders'},
  {icon: 'shield-checkmark-outline', label: 'Privacy & Security', sub: 'Data & security settings'},
  {icon: 'help-circle-outline', label: 'Help & Support', sub: 'FAQs, contact & tickets'},
  {icon: 'document-text-outline', label: 'Terms & Privacy', sub: 'Legal documents'},
];

export default function ProfileScreen({navigation}) {
  const {user, logout} = useAuth();
  const displayName = user?.name || 'Demo User';
  const businessName = user?.businessName || 'Your Business';
  const email = user?.email || 'demo@marketingkart.in';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.hero}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.heroName}>{displayName}</Text>
        <Text style={styles.heroBiz}>{businessName}</Text>
        <Text style={styles.heroEmail}>{email}</Text>
        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active Account</Text>
        </View>
      </LinearGradient>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[
          {label: 'Campaigns', value: '12'},
          {label: 'Ads Running', value: '3'},
          {label: 'Wallet', value: '₹2,450'},
        ].map((s, i) => (
          <View key={i} style={[styles.statBox, i === 1 && styles.statBoxBorder]}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {MENU.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.menuRow, i < MENU.length - 1 && styles.menuDivider]} activeOpacity={0.7}>
            <View style={styles.menuIconBox}>
              <Icon name={item.icon} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Icon name="chevron-forward" size={18} color={COLORS.textInactive} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <Icon name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>MarketingKart.ai • v1.0.0 (Beta)</Text>
      <View style={{height: 32}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},
  hero: {alignItems: 'center', paddingTop: 56, paddingBottom: 32, paddingHorizontal: 24},
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {fontSize: 28, fontFamily: FONTS.bold, color: COLORS.white},
  heroName: {fontSize: SIZES.titleLg, fontFamily: FONTS.bold, color: COLORS.white, marginBottom: 2},
  heroBiz: {fontSize: SIZES.body, fontFamily: FONTS.medium, color: 'rgba(255,255,255,0.8)', marginBottom: 2},
  heroEmail: {fontSize: SIZES.small, fontFamily: FONTS.regular, color: 'rgba(255,255,255,0.6)', marginBottom: 12},
  activePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: SIZES.radiusFull,
  },
  activeDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 6},
  activeText: {fontSize: SIZES.small, fontFamily: FONTS.semiBold, color: COLORS.white},
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16,
    marginTop: -1, borderRadius: SIZES.radiusLg, ...SHADOWS.md,
  },
  statBox: {flex: 1, alignItems: 'center', paddingVertical: 18},
  statBoxBorder: {borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F0F0F0'},
  statValue: {fontSize: SIZES.titleLg, fontFamily: FONTS.bold, color: COLORS.textTitle},
  statLabel: {fontSize: SIZES.caption, fontFamily: FONTS.medium, color: COLORS.textMuted, marginTop: 2},
  menuCard: {
    backgroundColor: COLORS.white, margin: 16, borderRadius: SIZES.radiusLg, ...SHADOWS.sm,
  },
  menuRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14},
  menuDivider: {borderBottomWidth: 1, borderBottomColor: '#F5F5F5'},
  menuIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  menuText: {flex: 1},
  menuLabel: {fontSize: SIZES.bodyLg, fontFamily: FONTS.semiBold, color: COLORS.textTitle},
  menuSub: {fontSize: SIZES.small, fontFamily: FONTS.regular, color: COLORS.textMuted, marginTop: 1},
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 16, marginTop: 4, paddingVertical: 14,
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    borderWidth: 1.5, borderColor: COLORS.error + '40', ...SHADOWS.sm,
  },
  logoutText: {fontSize: SIZES.bodyLg, fontFamily: FONTS.semiBold, color: COLORS.error, marginLeft: 8},
  footer: {textAlign: 'center', fontSize: SIZES.caption, fontFamily: FONTS.regular, color: COLORS.textInactive, marginTop: 20},
});
