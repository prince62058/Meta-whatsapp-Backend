// ============================================================
// MarketingKart.ai — AdsTabScreen (Meta Ads)
// ============================================================
import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
  RefreshControl,
  Modal,
  Pressable,
  Image,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS, AD_STATUS_COLORS} from '../../theme';
import {AdSkeletonCard} from '../../components/common/SkeletonCard';
import {MOCK_ADS, AD_TYPE_FILTERS} from '../../utils/mockData';
import {formatNumber, formatCurrency, formatDateShort, getAdStatusColor} from '../../utils/helpers';

// ─── Ads Filter Bottom Sheet ───────────────────────────────
function AdsFilterSheet({visible, selected, onSelect, onClose, onClear}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose} />
      <View style={styles.filterSheet}>
        <View style={styles.filterHandle} />
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter by Ad Type</Text>
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearBtn}>Clear</Text>
          </TouchableOpacity>
        </View>
        {AD_TYPE_FILTERS.map(item => (
          <TouchableOpacity
            key={item.value}
            style={styles.filterRow}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.7}>
            <View style={[styles.radio, selected === item.value && styles.radioSelected]}>
              {selected === item.value && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.filterLabel, selected === item.value && {color: COLORS.primary, fontFamily: FONTS.semiBold}]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
          <Text style={styles.applyBtnText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── Ads Performance Card ──────────────────────────────────
function AdsPerformanceCard({item, onPress, onRestart, isDemo}) {
  const statusColor = getAdStatusColor(item.status);
  const statusLabel = item.status.replace(/_/g, ' ');
  const isCompleted = item.status === 'COMPLETED';

  const kpi = [
    {label: 'Imp', value: formatNumber(item.impressions)},
    {label: 'Views', value: formatNumber(item.views)},
    {label: item.adType === 'Lead Ads' || item.adType === 'WhatsApp Ads' ? 'Leads' : 'Clicks', value: formatNumber(item.leads || item.clicks)},
    {label: 'Spent', value: formatCurrency(item.spent)},
  ];

  return (
    <TouchableOpacity style={styles.adCard} onPress={onPress} activeOpacity={0.92}>
      {/* Thumbnail */}
      <View style={styles.thumbContainer}>
        <View style={styles.thumbPlaceholder}>
          <Ionicons name="image-outline" size={48} color={COLORS.gray40} />
          <Text style={styles.thumbPlaceholderText}>{item.adType}</Text>
        </View>

        {/* Status Pill */}
        <View style={[styles.statusPill, {backgroundColor: statusColor}]}>
          <Text style={styles.statusPillText}>{statusLabel}</Text>
        </View>

        {/* Demo Watermark */}
        {isDemo && (
          <View style={styles.demoWatermark}>
            <Text style={styles.demoWatermarkText}>DEMO AD</Text>
          </View>
        )}

        {/* Dark Gradient + KPI Row */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.82)']}
          style={styles.thumbGradient}>
          <View style={styles.kpiRow}>
            {kpi.map((k, i) => (
              <React.Fragment key={k.label}>
                <View style={styles.kpiItem}>
                  <Text style={styles.kpiValue}>{k.value}</Text>
                  <Text style={styles.kpiLabel}>{k.label}</Text>
                </View>
                {i < kpi.length - 1 && <View style={styles.kpiDivider} />}
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Below Image */}
      <View style={styles.cardBody}>
        <View style={styles.cardBodyRow}>
          <View style={{flex: 1}}>
            <Text style={styles.campaignName} numberOfLines={1}>{item.campaignName}</Text>
            <Text style={styles.dateRange}>
              {formatDateShort(item.startDate)} – {formatDateShort(item.endDate)}
            </Text>
          </View>
          {isCompleted && (
            <TouchableOpacity style={styles.restartBtn} onPress={onRestart} activeOpacity={0.8}>
              <Ionicons name="refresh-outline" size={13} color={COLORS.primary} />
              <Text style={styles.restartBtnText}>Restart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Empty State ───────────────────────────────────────────
function EmptyAds() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="megaphone-outline" size={56} color={COLORS.primaryLight} />
      </View>
      <Text style={styles.emptyTitle}>No Ads Yet</Text>
      <Text style={styles.emptySubtitle}>Create your first ad to start reaching{'\n'}your audience on Facebook & Instagram</Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────
export default function AdsTabScreen({navigation}) {
  const [loading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const filteredAds = selectedFilter === 'All'
    ? MOCK_ADS
    : MOCK_ADS.filter(a => a.adType === selectedFilter);

  const showDemoOverlay = filteredAds.length === 0;
  const displayAds = showDemoOverlay ? MOCK_ADS.slice(0, 2) : filteredAds;

  const renderItem = useCallback(({item}) => (
    <AdsPerformanceCard
      item={item}
      isDemo={showDemoOverlay}
      onPress={() => navigation.navigate('AdsDetails', {ad: item})}
      onRestart={() => navigation.navigate('RestartAds', {ad: item})}
    />
  ), [navigation, showDemoOverlay]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{flex: 1}}>
            <Text style={styles.headerTitle}>Your Created Ads Report</Text>
            <Text style={styles.headerSubtitle}>You can see your ad performance</Text>
          </View>
          <TouchableOpacity
            style={styles.helpPill}
            onPress={() => Linking.openURL('tel:1234567890')}
            activeOpacity={0.8}>
            <Ionicons name="call-outline" size={13} color={COLORS.white} style={{marginRight: 4}} />
            <Text style={styles.helpPillText}>Help?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterIconBtn}
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.8}>
            <Ionicons name="filter-outline" size={18} color={COLORS.white} />
            {selectedFilter !== 'All' && <View style={styles.filterDot} />}
          </TouchableOpacity>
          {selectedFilter !== 'All' && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{selectedFilter}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Demo Notice */}
      {showDemoOverlay && selectedFilter !== 'All' && (
        <View style={styles.demoNotice}>
          <Ionicons name="information-circle-outline" size={15} color={COLORS.info} />
          <Text style={styles.demoNoticeText}>No ads match this filter. Showing demo cards.</Text>
        </View>
      )}

      {/* List */}
      {loading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={i => i.toString()}
          renderItem={() => <AdSkeletonCard />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={displayAds}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, displayAds.length === 0 && styles.listEmpty]}
          ListEmptyComponent={<EmptyAds />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Sheet */}
      <AdsFilterSheet
        visible={filterVisible}
        selected={selectedFilter}
        onSelect={v => setSelectedFilter(v)}
        onClose={() => setFilterVisible(false)}
        onClear={() => {setSelectedFilter('All'); setFilterVisible(false);}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},

  // Header
  header: {paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 52, paddingBottom: 16, paddingHorizontal: 16},
  headerTop: {flexDirection: 'row', alignItems: 'flex-start'},
  headerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.white, letterSpacing: 0.2},
  headerSubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  helpPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  helpPillText: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.white},
  headerActions: {flexDirection: 'row', alignItems: 'center', marginTop: 12},
  filterIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.brandOrange,
  },
  activeFilterChip: {
    marginLeft: 10, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: SIZES.radiusFull, paddingHorizontal: 12, paddingVertical: 4,
  },
  activeFilterText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.white},

  // List
  listContent: {paddingHorizontal: 16, paddingTop: 14, paddingBottom: 32},
  listEmpty: {flexGrow: 1, justifyContent: 'center'},

  // Demo notice
  demoNotice: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.metaBlueLight, paddingHorizontal: 16, paddingVertical: 8,
    marginHorizontal: 16, marginTop: 10, borderRadius: SIZES.radiusSm,
  },
  demoNoticeText: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.info, marginLeft: 6},

  // Ad Card
  adCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    marginBottom: 16, overflow: 'hidden', ...SHADOWS.md,
  },
  thumbContainer: {width: '100%', height: 200, position: 'relative'},
  thumbPlaceholder: {
    ...StyleSheet.absoluteFillObject, backgroundColor: '#E8EAF6',
    alignItems: 'center', justifyContent: 'center',
  },
  thumbPlaceholderText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.gray40, marginTop: 6},
  statusPill: {
    position: 'absolute', top: 12, left: 12,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: SIZES.radiusFull,
  },
  statusPillText: {fontFamily: FONTS.semiBold, fontSize: 10, color: COLORS.white, textTransform: 'uppercase', letterSpacing: 0.5},
  demoWatermark: {
    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  demoWatermarkText: {
    fontFamily: FONTS.bold, fontSize: 28, color: 'rgba(255,255,255,0.35)',
    letterSpacing: 6, transform: [{rotate: '-20deg'}],
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 4,
  },
  thumbGradient: {position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 30, paddingBottom: 14, paddingHorizontal: 14},
  kpiRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'},
  kpiItem: {alignItems: 'center', flex: 1},
  kpiValue: {fontFamily: FONTS.bold, fontSize: SIZES.bodyLg, color: COLORS.white},
  kpiLabel: {fontFamily: FONTS.regular, fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  kpiDivider: {width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.25)'},

  // Card Body
  cardBody: {paddingHorizontal: 14, paddingVertical: 12},
  cardBodyRow: {flexDirection: 'row', alignItems: 'center'},
  campaignName: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle, flex: 1},
  dateRange: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted, marginTop: 3},
  restartBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12, paddingVertical: 5, marginLeft: 10,
  },
  restartBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.caption, color: COLORS.primary, marginLeft: 4},

  // Empty
  emptyContainer: {alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32},
  emptyIconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.metaBlueLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  emptyTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 8},
  emptySubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22},

  // Filter Sheet
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)'},
  filterSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24, paddingHorizontal: 20, paddingTop: 12,
  },
  filterHandle: {width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.gray20, alignSelf: 'center', marginBottom: 16},
  filterHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16},
  filterTitle: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle},
  clearBtn: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.adError},
  filterRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.softBand},
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: COLORS.gray40, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  radioSelected: {borderColor: COLORS.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary},
  filterLabel: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody},
  applyBtn: {
    marginTop: 20, backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 14, alignItems: 'center',
  },
  applyBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.white},
});
