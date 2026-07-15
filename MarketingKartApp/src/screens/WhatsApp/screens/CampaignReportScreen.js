// ============================================================
// CampaignReportScreen.js — WhatsApp Campaign Report
// ============================================================
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_CAMPAIGNS} from '../../../utils/mockData';

const STATUS_CONFIG = {
  QUEUED:    {color: COLORS.waQueued,   label: 'Queued'},
  RUNNING:   {color: COLORS.waRunning,  label: 'Running'},
  COMPLETED: {color: COLORS.waDone,     label: 'Completed'},
  PAUSED:    {color: COLORS.waPaused,   label: 'Paused'},
  FAILED:    {color: COLORS.waFailed,   label: 'Failed'},
  DRAFT:     {color: COLORS.waDraft,    label: 'Draft'},
};

const MSG_STATUS = {
  QUEUED:    {color: COLORS.waQueued,   icon: 'time-outline',           label: 'Queued'},
  SENT:      {color: COLORS.textMuted,  icon: 'checkmark-outline',      label: 'Sent'},
  DELIVERED: {color: COLORS.success,    icon: 'checkmark-done-outline', label: 'Delivered'},
  READ:      {color: COLORS.waBlueTick, icon: 'checkmark-done-outline', label: 'Read'},
  FAILED:    {color: COLORS.error,      icon: 'close-circle-outline',   label: 'Failed'},
};

function StatusPill({status}) {
  const cfg = STATUS_CONFIG[status] || {color: COLORS.waDraft, label: status};
  return (
    <View style={[styles.statusPill, {backgroundColor: cfg.color + '20', borderColor: cfg.color + '55'}]}>
      <View style={[styles.statusDot, {backgroundColor: cfg.color}]} />
      <Text style={[styles.statusLabel, {color: cfg.color}]}>{cfg.label}</Text>
    </View>
  );
}

function StatCard({label, value, icon, color, bg}) {
  return (
    <View style={[styles.statCard, {backgroundColor: bg || color + '10', borderColor: color + '30'}]}>
      <View style={[styles.statIconBox, {backgroundColor: color + '20'}]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, {color}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MessageRow({item}) {
  const cfg = MSG_STATUS[item.status] || MSG_STATUS.SENT;
  const time = item.timestamp
    ? new Date(item.timestamp).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})
    : '';
  return (
    <View style={styles.msgRow}>
      <View style={[styles.msgAvatar, {backgroundColor: COLORS.primary + '18'}]}>
        <Text style={styles.msgAvatarText}>{(item.name || '?')[0].toUpperCase()}</Text>
      </View>
      <View style={styles.msgInfo}>
        <Text style={styles.msgName} numberOfLines={1}>{item.name || 'Unknown'}</Text>
        <Text style={styles.msgPhone}>{item.phone}</Text>
      </View>
      <View style={styles.msgStatusCol}>
        <View style={styles.msgStatusRow}>
          <Ionicons name={cfg.icon} size={14} color={cfg.color} style={{marginRight: 4}} />
          <Text style={[styles.msgStatusText, {color: cfg.color}]}>{cfg.label}</Text>
        </View>
        {time ? <Text style={styles.msgTime}>{time}</Text> : null}
      </View>
    </View>
  );
}

export default function CampaignReportScreen({route, navigation, setActiveTab}) {
  const campaign = route?.params?.campaign || MOCK_CAMPAIGNS[0];
  const {name, status, templateName, createdAt, stats, messages = []} = campaign;

  const deliveryRate = stats.sent > 0 ? ((stats.delivered / stats.sent) * 100).toFixed(1) : '0.0';
  const dateStr = new Date(createdAt).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'});

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const displayed = messages.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < messages.length;

  const handleBack = () => {
    if (navigation) navigation.goBack();
    else if (setActiveTab) setActiveTab('campaigns');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>Campaign Report</Text>
          <Text style={styles.headerSub}>{dateStr}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Campaign title card */}
        <View style={styles.titleCard}>
          <View style={styles.titleRow}>
            <Text style={styles.campaignName} numberOfLines={2}>{name}</Text>
            <StatusPill status={status} />
          </View>
          <View style={styles.templateRow}>
            <Ionicons name="document-text-outline" size={13} color={COLORS.textMuted} style={{marginRight: 5}} />
            <Text style={styles.templateText}>{templateName}</Text>
          </View>
        </View>

        {/* 2×3 Stat Grid */}
        <Text style={styles.sectionTitle}>Delivery Summary</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Total"    value={stats.total}     icon="people-outline"          color={COLORS.primary}  />
          <StatCard label="Sent"     value={stats.sent}      icon="send-outline"            color={COLORS.info}     />
          <StatCard label="Delivered" value={stats.delivered} icon="checkmark-done-outline" color={COLORS.success}  />
          <StatCard label="Read"     value={stats.read}      icon="eye-outline"             color={COLORS.waRunning}/>
          <StatCard label="Failed"   value={stats.failed}    icon="close-circle-outline"    color={COLORS.error}    />
          <StatCard label="Delivery %" value={`${deliveryRate}%`} icon="stats-chart-outline" color={COLORS.waGreenSend} />
        </View>

        {/* Delivery breakdown bar */}
        {stats.sent > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Delivery Breakdown</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, {flex: stats.read, backgroundColor: COLORS.waBlueTick}]} />
              <View style={[styles.progressSegment, {flex: Math.max(0, stats.delivered - stats.read), backgroundColor: COLORS.success}]} />
              <View style={[styles.progressSegment, {flex: Math.max(0, stats.sent - stats.delivered), backgroundColor: COLORS.info}]} />
              <View style={[styles.progressSegment, {flex: stats.failed, backgroundColor: COLORS.error}]} />
            </View>
            <View style={styles.legendRow}>
              {[
                {color: COLORS.waBlueTick, label: `Read (${stats.read})`},
                {color: COLORS.success,    label: `Delivered (${stats.delivered})`},
                {color: COLORS.info,       label: `Sent (${stats.sent})`},
                {color: COLORS.error,      label: `Failed (${stats.failed})`},
              ].map((l, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendDot, {backgroundColor: l.color}]} />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Message rows */}
        <Text style={styles.sectionTitle}>Message Details ({messages.length})</Text>
        {messages.length === 0 ? (
          <View style={styles.noMsgs}>
            <Ionicons name="chatbubble-ellipses-outline" size={32} color={COLORS.textInactive} />
            <Text style={styles.noMsgsText}>No message data available yet</Text>
          </View>
        ) : (
          <View style={styles.msgList}>
            {displayed.map(item => (
              <MessageRow key={item.id} item={item} />
            ))}
            {hasMore && (
              <TouchableOpacity style={styles.loadMore} onPress={() => setPage(p => p + 1)} activeOpacity={0.8}>
                <Text style={styles.loadMoreText}>Load More</Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.primary} style={{marginLeft: 4}} />
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: '#fff'},
  headerSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16},

  titleCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 18,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  titleRow: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8},
  campaignName: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle, flex: 1},
  statusPill: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, paddingVertical: 4, borderRadius: SIZES.radiusFull, borderWidth: 1},
  statusDot: {width: 6, height: 6, borderRadius: 3, marginRight: 4},
  statusLabel: {fontFamily: FONTS.semiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5},
  templateRow: {flexDirection: 'row', alignItems: 'center'},
  templateText: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted},

  sectionTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 10, marginTop: 4},

  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18},
  statCard: {
    width: '30%',
    flexGrow: 1,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  statIconBox: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8},
  statValue: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, marginBottom: 3},
  statLabel: {fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', textAlign: 'center'},

  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 18,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  progressBar: {flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12, backgroundColor: COLORS.softBand},
  progressSegment: {height: '100%'},
  legendRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  legendItem: {flexDirection: 'row', alignItems: 'center'},
  legendDot: {width: 8, height: 8, borderRadius: 4, marginRight: 5},
  legendText: {fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted},

  msgList: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, ...SHADOWS.sm, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: 8},
  msgRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)'},
  msgAvatar: {width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginRight: 12},
  msgAvatarText: {fontFamily: FONTS.bold, fontSize: 15, color: COLORS.primary},
  msgInfo: {flex: 1},
  msgName: {fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTitle},
  msgPhone: {fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginTop: 2},
  msgStatusCol: {alignItems: 'flex-end'},
  msgStatusRow: {flexDirection: 'row', alignItems: 'center'},
  msgStatusText: {fontFamily: FONTS.semiBold, fontSize: 11},
  msgTime: {fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textInactive, marginTop: 3},

  loadMore: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14},
  loadMoreText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary},

  noMsgs: {alignItems: 'center', paddingVertical: 36, backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, marginBottom: 8},
  noMsgsText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, marginTop: 10},
});
