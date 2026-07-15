// ============================================================
// TemplatesScreen.js — WhatsApp Templates List
// ============================================================
import React, {useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Alert, ToastAndroid, Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS, TEMPLATE_STATUS_COLORS} from '../../../theme';
import {MOCK_TEMPLATES} from '../../../utils/mockData';
import {CampaignSkeletonCard} from '../../../components/common/SkeletonCard';

const FILTER_TABS = ['All', 'Approved', 'Pending', 'Rejected'];

const CATEGORY_COLORS = {
  MARKETING:      {bg: '#ede9fe', text: '#7c3aed'},
  UTILITY:        {bg: '#dbeafe', text: '#1d4ed8'},
  AUTHENTICATION: {bg: '#fce7f3', text: '#9d174d'},
};

const STATUS_BORDER = {
  APPROVED: COLORS.success,
  PENDING:  COLORS.warning,
  REJECTED: COLORS.error,
};

function showToast(msg) {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert('', msg);
}

function SummaryChip({label, value, color}) {
  return (
    <View style={[styles.summaryChip, {backgroundColor: color + '18', borderColor: color + '44'}]}>
      <Text style={[styles.summaryValue, {color}]}>{value}</Text>
      <Text style={[styles.summaryLabel, {color: color}]}>{label}</Text>
    </View>
  );
}

function FilterChip({label, active, onPress}) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, active && {backgroundColor: COLORS.primary, borderColor: COLORS.primary}]}
      onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.filterChipText, active && {color: '#fff'}]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TemplateCard({template, onCopy, onUse}) {
  const {name, category, language, body, status, headerType, headerText, buttons = []} = template;
  const catCfg = CATEGORY_COLORS[category] || CATEGORY_COLORS.UTILITY;
  const borderColor = STATUS_BORDER[status] || COLORS.gray20;

  return (
    <View style={[styles.card, {borderLeftColor: borderColor}]}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.templateName} numberOfLines={1}>{name}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, {backgroundColor: catCfg.bg}]}>
              <Text style={[styles.categoryText, {color: catCfg.text}]}>{category}</Text>
            </View>
            <Text style={styles.langText}>{language}</Text>
            {buttons.length > 0 && (
              <View style={styles.btnCountBadge}>
                <Ionicons name="return-down-back-outline" size={10} color={COLORS.textMuted} style={{marginRight: 3}} />
                <Text style={styles.btnCountText}>{buttons.length} btn{buttons.length > 1 ? 's' : ''}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={[styles.statusPill, {backgroundColor: (TEMPLATE_STATUS_COLORS[status] || COLORS.waDraft) + '20', borderColor: (TEMPLATE_STATUS_COLORS[status] || COLORS.waDraft) + '55'}]}>
          <View style={[styles.statusDot, {backgroundColor: TEMPLATE_STATUS_COLORS[status] || COLORS.waDraft}]} />
          <Text style={[styles.statusText, {color: TEMPLATE_STATUS_COLORS[status] || COLORS.waDraft}]}>{status}</Text>
        </View>
      </View>

      {/* Body preview */}
      {headerType === 'TEXT' && headerText ? (
        <Text style={styles.headerPreview} numberOfLines={1}>{headerText}</Text>
      ) : null}
      <Text style={styles.bodyPreview} numberOfLines={2}>{body}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.copyBtn} onPress={() => onCopy(template)} activeOpacity={0.8}>
          <Ionicons name="copy-outline" size={14} color={COLORS.textMuted} style={{marginRight: 5}} />
          <Text style={styles.copyBtnText}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.useBtn, status !== 'APPROVED' && styles.useBtnDisabled]}
          onPress={() => status === 'APPROVED' ? onUse(template) : showToast('Only APPROVED templates can be used')}
          activeOpacity={0.85}>
          <Ionicons name="send-outline" size={14} color={status === 'APPROVED' ? '#fff' : COLORS.textInactive} style={{marginRight: 5}} />
          <Text style={[styles.useBtnText, status !== 'APPROVED' && {color: COLORS.textInactive}]}>Use Template</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState({filter, onCreate}) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="document-text-outline" size={38} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>{filter === 'All' ? 'No Templates Yet' : `No ${filter} Templates`}</Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'All'
          ? 'Create your first WhatsApp template or sync from Meta to get started.'
          : `No templates with "${filter}" status found.`}
      </Text>
      {filter === 'All' && (
        <TouchableOpacity style={styles.emptyBtn} onPress={onCreate} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#fff" style={{marginRight: 6}} />
          <Text style={styles.emptyBtnText}>Create Template</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TemplatesScreen({setActiveTab, navigation}) {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const counts = {
    All:      templates.length,
    Approved: templates.filter(t => t.status === 'APPROVED').length,
    Pending:  templates.filter(t => t.status === 'PENDING').length,
    Rejected: templates.filter(t => t.status === 'REJECTED').length,
  };

  const filtered = activeFilter === 'All'
    ? templates
    : templates.filter(t => t.status === activeFilter.toUpperCase());

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast('Templates synced from Meta');
    }, 2000);
  };

  const handleCreate = () => {
    if (setActiveTab) setActiveTab('create-template');
    else if (navigation) navigation.navigate('TemplateCreate');
  };

  const handleCopy = (template) => {
    showToast(`"${template.name}" body copied!`);
  };

  const handleUse = (template) => {
    if (setActiveTab) setActiveTab('create-campaign', {template});
    else showToast('Opening campaign creator…');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Templates</Text>
          <Text style={styles.headerSub}>{templates.length} total</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.syncBtn, syncing && {opacity: 0.7}]}
            onPress={handleSync} disabled={syncing} activeOpacity={0.8}>
            <Ionicons name={syncing ? 'sync' : 'sync-outline'} size={15} color={COLORS.primary} style={{marginRight: 5}} />
            <Text style={styles.syncBtnText}>{syncing ? 'Syncing…' : 'Sync from Meta'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleCreate} activeOpacity={0.85}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />}>

        {/* Summary chips */}
        <View style={styles.summaryRow}>
          <SummaryChip label="Total"    value={counts.All}      color={COLORS.primary} />
          <SummaryChip label="Approved" value={counts.Approved} color={COLORS.success} />
          <SummaryChip label="Pending"  value={counts.Pending}  color={COLORS.warning} />
          <SummaryChip label="Rejected" value={counts.Rejected} color={COLORS.error}   />
        </View>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {FILTER_TABS.map(f => (
            <FilterChip key={f} label={`${f} (${counts[f]})`} active={activeFilter === f} onPress={() => setActiveFilter(f)} />
          ))}
        </ScrollView>

        {/* Template cards */}
        {loading
          ? [0, 1, 2].map(i => <CampaignSkeletonCard key={i} />)
          : filtered.length === 0
          ? <EmptyState filter={activeFilter} onCreate={handleCreate} />
          : filtered.map(t => (
              <TemplateCard key={t.id} template={t} onCopy={handleCopy} onUse={handleUse} />
            ))
        }
        <View style={{height: 40}} />
      </ScrollView>

      {/* FAB */}
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
  headerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: '#fff'},
  headerSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  headerActions: {flexDirection: 'row', alignItems: 'center', gap: 10},
  syncBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: SIZES.radiusFull,
    ...SHADOWS.sm,
  },
  syncBtnText: {fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.primary},
  addBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: {flex: 1},
  scrollContent: {paddingTop: 16, paddingHorizontal: 16},

  summaryRow: {flexDirection: 'row', gap: 8, marginBottom: 14},
  summaryChip: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: SIZES.radiusMd, borderWidth: 1,
  },
  summaryValue: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle},
  summaryLabel: {fontFamily: FONTS.regular, fontSize: 10, textTransform: 'uppercase', marginTop: 2, opacity: 0.85},

  filterScroll: {marginBottom: 14},
  filterContent: {gap: 8, paddingRight: 8},
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: SIZES.radiusFull, borderWidth: 1,
    borderColor: COLORS.gray20, backgroundColor: COLORS.white,
  },
  filterChipText: {fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted},

  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderLeftWidth: 4,
  },
  cardHeader: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8},
  templateName: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 6},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap'},
  categoryBadge: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: SIZES.radiusFull},
  categoryText: {fontFamily: FONTS.semiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3},
  langText: {fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted},
  btnCountBadge: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.softBand, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20},
  btnCountText: {fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted},
  statusPill: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: SIZES.radiusFull, borderWidth: 1, marginLeft: 10},
  statusDot: {width: 5, height: 5, borderRadius: 3, marginRight: 4},
  statusText: {fontFamily: FONTS.semiBold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5},

  headerPreview: {fontFamily: FONTS.bold, fontSize: 13, color: COLORS.textTitle, marginBottom: 4},
  bodyPreview: {fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 12},

  divider: {height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: 12},
  actionsRow: {flexDirection: 'row', gap: 10},
  copyBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 9, borderRadius: SIZES.radiusFull,
    borderWidth: 1, borderColor: COLORS.gray20,
    backgroundColor: COLORS.pageBg,
  },
  copyBtnText: {fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textMuted},
  useBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 9, borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.primary, ...SHADOWS.sm,
  },
  useBtnDisabled: {backgroundColor: COLORS.softBand, borderWidth: 1, borderColor: COLORS.gray20},
  useBtnText: {fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff'},

  emptyContainer: {alignItems: 'center', paddingTop: 60, paddingHorizontal: 32},
  emptyIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  emptyTitle: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginBottom: 8},
  emptySubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 24},
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24, paddingVertical: 13,
    borderRadius: SIZES.radiusFull, ...SHADOWS.md,
  },
  emptyBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: '#fff'},

  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
