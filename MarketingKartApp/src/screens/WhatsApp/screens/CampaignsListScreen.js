// ============================================================
// CampaignsListScreen.js — WhatsApp Campaigns List
// ============================================================
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS, CAMPAIGN_STATUS_COLORS} from '../../../theme';
import {MOCK_CAMPAIGNS} from '../../../utils/mockData';
import {CampaignSkeletonCard} from '../../../components/common/SkeletonCard';

const STATUS_CONFIG = {
  QUEUED:    {color: COLORS.waQueued,   label: 'Queued'},
  RUNNING:   {color: COLORS.waRunning,  label: 'Running'},
  COMPLETED: {color: COLORS.waDone,     label: 'Completed'},
  PAUSED:    {color: COLORS.waPaused,   label: 'Paused'},
  FAILED:    {color: COLORS.waFailed,   label: 'Failed'},
  DRAFT:     {color: COLORS.waDraft,    label: 'Draft'},
};

function StatusPill({status}) {
  const cfg = STATUS_CONFIG[status] || {color: COLORS.waDraft, label: status};
  return (
    <View style={[styles.statusPill, {backgroundColor: cfg.color + '20', borderColor: cfg.color + '66'}]}>
      <View style={[styles.statusDot, {backgroundColor: cfg.color}]} />
      <Text style={[styles.statusLabel, {color: cfg.color}]}>{cfg.label}</Text>
    </View>
  );
}

function StatPill({icon, value, color, label}) {
  return (
    <View style={styles.statPill}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={[styles.statValue, {color}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({label, icon, color, onPress}) {
  return (
    <TouchableOpacity style={[styles.actionBtn, {borderColor: color + '55', backgroundColor: color + '12'}]} onPress={onPress} activeOpacity={0.75}>
      <Ionicons name={icon} size={13} color={color} style={{marginRight: 4}} />
      <Text style={[styles.actionBtnText, {color}]}>{label}</Text>
    </TouchableOpacity>
  );
}

function CampaignCard({campaign, onDelete, onPause, onResume, onReport}) {
  const {name, status, templateName, createdAt, stats} = campaign;
  const dateStr = new Date(createdAt).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'});

  return (
    <View style={styles.card}>
      {/* Title row */}
      <View style={styles.cardHeader}>
        <Text style={styles.campaignName} numberOfLines={1}>{name}</Text>
        <StatusPill status={status} />
      </View>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <Ionicons name="document-text-outline" size={12} color={COLORS.textMuted} style={{marginRight: 4}} />
        <Text style={styles.metaText} numberOfLines={1}>{templateName}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} style={{marginRight: 4}} />
        <Text style={styles.metaText}>{dateStr}</Text>
      </View>

      {/* Stat pills */}
      <View style={styles.statsRow}>
        <StatPill icon="send-outline"        value={stats.sent}      color={COLORS.info}    label="Sent" />
        <StatPill icon="checkmark-done-outline" value={stats.delivered} color={COLORS.success} label="Delivered" />
        <StatPill icon="eye-outline"         value={stats.read}      color={COLORS.waRunning} label="Read" />
        <StatPill icon="close-circle-outline" value={stats.failed}   color={COLORS.error}   label="Failed" />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        {status === 'RUNNING' && (
          <ActionButton label="Pause" icon="pause-circle-outline" color={COLORS.waPaused} onPress={() => onPause(campaign)} />
        )}
        {status === 'PAUSED' && (
          <ActionButton label="Resume" icon="play-circle-outline" color={COLORS.waRunning} onPress={() => onResume(campaign)} />
        )}
        <ActionButton label="Report" icon="bar-chart-outline" color={COLORS.primary} onPress={() => onReport(campaign)} />
        <ActionButton label="Delete" icon="trash-outline" color={COLORS.error} onPress={() => onDelete(campaign)} />
      </View>
    </View>
  );
}

function EmptyState({onCreate}) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="paper-plane-outline" size={38} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Campaigns Yet</Text>
      <Text style={styles.emptySubtitle}>Create your first WhatsApp campaign and reach your audience instantly.</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onCreate} activeOpacity={0.85}>
        <Ionicons name="add-circle-outline" size={18} color="#fff" style={{marginRight: 6}} />
        <Text style={styles.emptyBtnText}>Create Campaign</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CampaignsListScreen({setActiveTab, navigation}) {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleCreate = () => {
    if (setActiveTab) setActiveTab('create-campaign');
  };

  const handleDelete = (campaign) => {
    Alert.alert(
      'Delete Campaign',
      `Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete', style: 'destructive',
          onPress: () => setCampaigns(prev => prev.filter(c => c.id !== campaign.id)),
        },
      ],
    );
  };

  const handlePause = (campaign) => {
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? {...c, status: 'PAUSED'} : c));
  };

  const handleResume = (campaign) => {
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? {...c, status: 'RUNNING'} : c));
  };

  const handleReport = (campaign) => {
    if (setActiveTab) setActiveTab('campaign-report', {campaign});
    else if (navigation) navigation.navigate('CampaignReport', {campaign});
  };

  return (
    <View style={styles.container}>
      {/* Header strip */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Campaigns</Text>
          <Text style={styles.headerSub}>{campaigns.length} total</Text>
        </View>
        <TouchableOpacity style={styles.fabHeader} onPress={handleCreate} activeOpacity={0.85}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }>
        {loading ? (
          [0, 1, 2].map(i => <CampaignSkeletonCard key={i} />)
        ) : campaigns.length === 0 ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDelete={handleDelete}
              onPause={handlePause}
              onResume={handleResume}
              onReport={handleReport}
            />
          ))
        )}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreate} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.titleLg,
    color: '#fff',
  },
  headerSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  fabHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {flex: 1},
  scrollContent: {paddingTop: 14, paddingHorizontal: 16},

  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  campaignName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.body,
    color: COLORS.textTitle,
    flex: 1,
    marginRight: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
  },
  statusDot: {width: 6, height: 6, borderRadius: 3, marginRight: 4},
  statusLabel: {fontFamily: FONTS.semiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5},

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaText: {fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted},
  metaDot: {marginHorizontal: 6, color: COLORS.textInactive, fontSize: 12},

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 6,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusSm,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statValue: {fontFamily: FONTS.bold, fontSize: 14, marginTop: 3},
  statLabel: {fontFamily: FONTS.regular, fontSize: 9, color: COLORS.textMuted, marginTop: 1, textTransform: 'uppercase'},

  divider: {height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: 12},

  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
  },
  actionBtnText: {fontFamily: FONTS.semiBold, fontSize: 12},

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginBottom: 8},
  emptySubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 24},
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: SIZES.radiusFull,
    ...SHADOWS.md,
  },
  emptyBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: '#fff'},

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
