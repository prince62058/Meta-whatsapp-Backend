// ============================================================
// MarketingKart.ai — Notifications Screen
// ============================================================
import React, {useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_NOTIFICATIONS} from '../../../utils/mockData';

const TYPE_META = {
  success: {icon: 'checkmark-circle', color: COLORS.success, bg: COLORS.successBg},
  warning: {icon: 'warning', color: COLORS.warning, bg: COLORS.warningBg},
  info: {icon: 'information-circle', color: COLORS.info, bg: COLORS.metaBlueLight},
  error: {icon: 'close-circle', color: COLORS.error, bg: COLORS.errorBg},
};

function getRelativeTime(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function NotificationCard({item}) {
  const [expanded, setExpanded] = useState(!item.read);
  const meta = TYPE_META[item.type] || TYPE_META.info;

  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.cardUnread]}
      onPress={() => setExpanded(e => !e)}
      activeOpacity={0.8}>
      <View style={[styles.iconBox, {backgroundColor: meta.bg}]}>
        <Ionicons name={meta.icon} size={22} color={meta.color} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={expanded ? 0 : 1}>
            {item.title}
          </Text>
          <Text style={styles.cardTime}>{getRelativeTime(item.time)}</Text>
        </View>
        {expanded && (
          <Text style={styles.cardMessage}>{item.message}</Text>
        )}
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationScreen({navigation}) {
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={{width: 34}} />
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-off-outline" size={64} color={COLORS.primaryLight} />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
            You'll be notified about campaigns, wallet, and account updates here.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 32}}>
          {unreadCount > 0 && (
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>NEW · {unreadCount} unread</Text>
            </View>
          )}
          {notifications.map(item => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, paddingHorizontal: SIZES.lg, paddingVertical: 14,
  },
  backBtn: {width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerCenter: {flexDirection: 'row', alignItems: 'center', gap: 8},
  headerTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.title, color: COLORS.white},
  headerBadge: {
    backgroundColor: COLORS.error, borderRadius: SIZES.radiusFull,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  headerBadgeText: {fontFamily: FONTS.bold, fontSize: 11, color: COLORS.white},
  body: {flex: 1},
  sectionLabel: {paddingHorizontal: SIZES.lg, paddingTop: 16, paddingBottom: 8},
  sectionLabelText: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.primary, letterSpacing: 0.5},
  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.white, marginHorizontal: SIZES.lg, marginBottom: 10,
    borderRadius: SIZES.radiusMd, padding: 14, ...SHADOWS.sm,
  },
  cardUnread: {borderLeftWidth: 3, borderLeftColor: COLORS.primary},
  iconBox: {width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0},
  cardBody: {flex: 1},
  cardTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8},
  cardTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle, flex: 1},
  cardTime: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted, flexShrink: 0},
  cardMessage: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary, marginTop: 6, lineHeight: 20},
  unreadDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, alignSelf: 'flex-end', marginTop: 6},
  emptyContainer: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, backgroundColor: COLORS.white},
  emptyIcon: {width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.pageBg, alignItems: 'center', justifyContent: 'center', marginBottom: 20},
  emptyTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginBottom: 8},
  emptySubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22},
});
