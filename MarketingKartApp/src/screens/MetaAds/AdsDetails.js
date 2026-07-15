// ============================================================
// MarketingKart.ai — AdsDetails Screen (Meta Ads)
// ============================================================
import React, {useState, useEffect, useRef} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import {formatNumber, formatCurrency, formatDateShort, getAdStatusColor, getStatusMessage} from '../../utils/helpers';

// ─── Skeleton Loader ───────────────────────────────────────
function SkeletonBox({width, height, style, borderRadius = 8}) {
  return (
    <View style={[{width, height, backgroundColor: '#E0E0E0', borderRadius}, style]} />
  );
}

function AdsDetailsLoader() {
  return (
    <ScrollView contentContainerStyle={{padding: 16}} showsVerticalScrollIndicator={false}>
      <View style={[styles.topCard, {padding: 16}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 14}}>
          <SkeletonBox width={60} height={60} borderRadius={12} />
          <View style={{marginLeft: 12, flex: 1}}>
            <SkeletonBox width="70%" height={16} style={{marginBottom: 8}} />
            <SkeletonBox width={80} height={22} borderRadius={11} />
          </View>
        </View>
        <SkeletonBox width="100%" height={160} borderRadius={12} style={{marginBottom: 14}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {[0,1,2].map(i => <SkeletonBox key={i} width={90} height={40} borderRadius={8} />)}
        </View>
      </View>
      <SkeletonBox width="55%" height={18} style={{marginTop: 20, marginBottom: 12}} />
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
        {[0,1,2,3].map(i => <SkeletonBox key={i} width="47%" height={90} borderRadius={12} />)}
      </View>
      <SkeletonBox width="45%" height={18} style={{marginTop: 20, marginBottom: 12}} />
      <SkeletonBox width="100%" height={180} borderRadius={12} />
    </ScrollView>
  );
}

// ─── KPI Tile ──────────────────────────────────────────────
function KpiTile({label, value, iconName, color}) {
  return (
    <View style={styles.kpiTile}>
      <View style={[styles.kpiTileIcon, {backgroundColor: color + '18'}]}>
        <Ionicons name={iconName} size={22} color={color} />
      </View>
      <Text style={styles.kpiTileValue}>{value}</Text>
      <Text style={styles.kpiTileLabel}>{label}</Text>
    </View>
  );
}

// ─── Age Bar Chart ─────────────────────────────────────────
function AgeBarChart({data}) {
  const max = Math.max(...data.map(d => d.pct));
  return (
    <View style={styles.barChartContainer}>
      {data.map(item => (
        <View key={item.range} style={styles.barRow}>
          <Text style={styles.barLabel}>{item.range}</Text>
          <View style={styles.barTrack}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary]}
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              style={[styles.barFill, {width: `${(item.pct / max) * 100}%`}]}
            />
          </View>
          <Text style={styles.barPct}>{item.pct}%</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Gender Bar ────────────────────────────────────────────
function GenderBar({male, female, other}) {
  return (
    <View style={styles.genderContainer}>
      <View style={styles.genderBarTrack}>
        <View style={[styles.genderSegment, {flex: male, backgroundColor: COLORS.metaBlue}]} />
        <View style={[styles.genderSegment, {flex: female, backgroundColor: '#E91E63'}]} />
        <View style={[styles.genderSegment, {flex: other, backgroundColor: COLORS.adInProgress}]} />
      </View>
      <View style={styles.genderLegend}>
        {[
          {label: 'Male', pct: male, color: COLORS.metaBlue},
          {label: 'Female', pct: female, color: '#E91E63'},
          {label: 'Other', pct: other, color: COLORS.adInProgress},
        ].map(g => (
          <View key={g.label} style={styles.genderLegendItem}>
            <View style={[styles.genderDot, {backgroundColor: g.color}]} />
            <Text style={styles.genderLegendText}>{g.label}</Text>
            <Text style={styles.genderLegendPct}>{g.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Engagement Row ────────────────────────────────────────
function EngagementRow({bookmarks, linkClicks, reactions, shares}) {
  const items = [
    {label: 'Bookmarks', value: formatNumber(bookmarks), icon: 'bookmark-outline', color: '#FF9800'},
    {label: 'Link Clicks', value: formatNumber(linkClicks), icon: 'link-outline', color: COLORS.metaBlue},
    {label: 'Reactions', value: formatNumber(reactions), icon: 'heart-outline', color: '#E91E63'},
    {label: 'Shares', value: formatNumber(shares), icon: 'share-social-outline', color: COLORS.adActive},
  ];
  return (
    <View style={styles.engagementRow}>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.engagementItem, i < items.length - 1 && styles.engagementBorder]}>
          <Ionicons name={item.icon} size={18} color={item.color} />
          <Text style={styles.engagementValue}>{item.value}</Text>
          <Text style={styles.engagementLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Stats Info Pill ───────────────────────────────────────
function StatPill({label, value}) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statPillLabel}>{label}</Text>
      <Text style={styles.statPillValue}>{value}</Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────
export default function AdsDetails({route, navigation}) {
  const {ad} = route.params;
  const [loading, setLoading] = useState(true);
  const [adData, setAdData] = useState(ad);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 800);

    // 30-second auto-refresh
    intervalRef.current = setInterval(() => {
      setAdData(prev => ({...prev})); // In production: re-fetch
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
  }, []);

  const statusColor = getAdStatusColor(adData.status);
  const statusMessage = getStatusMessage(adData.status);
  const isActive = adData.status === 'ACTIVE';
  const dateLabel = isActive ? 'Running' : `${formatDateShort(adData.startDate)} – ${formatDateShort(adData.endDate)}`;

  const kpiTiles = [
    {label: 'Views', value: formatNumber(adData.views), icon: 'eye-outline', color: COLORS.metaBlue},
    {label: 'Clicks', value: formatNumber(adData.clicks), icon: 'cursor-outline', color: '#FF9800'},
    {label: 'Leads', value: formatNumber(adData.leads), icon: 'people-outline', color: COLORS.adActive},
    {label: 'Budget Used', value: formatCurrency(adData.spent), icon: 'wallet-outline', color: COLORS.primary},
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ad Detail</Text>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => setAdData(prev => ({...prev}))}
          activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <AdsDetailsLoader />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Top Card */}
          <View style={styles.topCard}>
            {/* Campaign Row */}
            <View style={styles.campaignRow}>
              <View style={styles.thumbSmall}>
                <Ionicons name="megaphone-outline" size={28} color={COLORS.primary} />
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.campaignName} numberOfLines={2}>{adData.campaignName}</Text>
                <Text style={styles.dateLabel}>{dateLabel}</Text>
              </View>
              <View style={[styles.statusBadge, {backgroundColor: statusColor + '20', borderColor: statusColor + '50'}]}>
                <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
                <Text style={[styles.statusBadgeText, {color: statusColor}]}>
                  {adData.status.replace(/_/g, ' ')}
                </Text>
              </View>
            </View>

            {/* Media Placeholder */}
            <View style={styles.mediaPlaceholder}>
              <Ionicons name="image-outline" size={40} color={COLORS.gray40} />
              <Text style={styles.mediaPlaceholderText}>Ad Creative</Text>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <StatPill label="Platforms" value={adData.platforms} />
              <StatPill label="Budget" value={formatCurrency(adData.totalBudget)} />
              <StatPill label="Area" value={adData.area.split(',')[0]} />
              <TouchableOpacity style={styles.seeAllTargets}>
                <Text style={styles.seeAllText}>See all targets →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reach Banner */}
          <View style={[styles.reachBanner, {borderLeftColor: statusColor}]}>
            <Text style={styles.reachText}>
              Your ad reached{' '}
              <Text style={{color: statusColor, fontFamily: FONTS.bold}}>
                {formatNumber(adData.reach)} people
              </Text>
            </Text>
            <Text style={[styles.statusMessage, {color: statusColor}]}>{statusMessage}</Text>
          </View>

          {/* KPI Grid */}
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.kpiGrid}>
            {kpiTiles.map(tile => (
              <KpiTile key={tile.label} {...tile} />
            ))}
          </View>

          {/* Age Chart */}
          <Text style={styles.sectionTitle}>Age Distribution</Text>
          <View style={styles.card}>
            <AgeBarChart data={adData.ageData} />
          </View>

          {/* Post Engagement */}
          <Text style={styles.sectionTitle}>Post Engagement</Text>
          <View style={styles.card}>
            <EngagementRow {...adData.engagement} />
          </View>

          {/* Gender */}
          <Text style={styles.sectionTitle}>Gender Breakdown</Text>
          <View style={styles.card}>
            <GenderBar
              male={adData.genderData.male}
              female={adData.genderData.female}
              other={adData.genderData.other}
            />
          </View>

          {/* Restart CTA */}
          {adData.status === 'COMPLETED' && (
            <TouchableOpacity
              style={styles.restartCta}
              onPress={() => navigation.navigate('RestartAds', {ad: adData})}
              activeOpacity={0.85}>
              <Ionicons name="refresh-circle-outline" size={20} color={COLORS.white} />
              <Text style={styles.restartCtaText}>Restart This Campaign</Text>
            </TouchableOpacity>
          )}

          <View style={{height: 32}} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 52,
    paddingBottom: 14, paddingHorizontal: 16,
  },
  backBtn: {width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center'},
  headerTitle: {flex: 1, fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginLeft: 12},
  refreshBtn: {width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.metaBlueLight, alignItems: 'center', justifyContent: 'center'},

  scrollContent: {padding: 16},

  // Top Card
  topCard: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, padding: 16, ...SHADOWS.md, marginBottom: 14},
  campaignRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14},
  thumbSmall: {
    width: 60, height: 60, borderRadius: 12,
    backgroundColor: COLORS.metaBlueLight, alignItems: 'center', justifyContent: 'center',
  },
  campaignName: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle, lineHeight: 22},
  dateLabel: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginTop: 4},
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: SIZES.radiusFull, borderWidth: 1,
  },
  statusDot: {width: 6, height: 6, borderRadius: 3, marginRight: 4},
  statusBadgeText: {fontFamily: FONTS.semiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4},
  mediaPlaceholder: {
    height: 160, borderRadius: 12, backgroundColor: '#E8EAF6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  mediaPlaceholderText: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.gray40, marginTop: 6},
  statsRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6},
  statPill: {
    backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusSm,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  statPillLabel: {fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted},
  statPillValue: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.textTitle},
  seeAllTargets: {paddingHorizontal: 4},
  seeAllText: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.primary},

  // Reach Banner
  reachBanner: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    padding: 14, borderLeftWidth: 4, marginBottom: 14, ...SHADOWS.sm,
  },
  reachText: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 4},
  statusMessage: {fontFamily: FONTS.regular, fontSize: SIZES.small},

  // Section
  sectionTitle: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 10, marginTop: 4},
  card: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, padding: 16, ...SHADOWS.sm, marginBottom: 14},

  // KPI Grid
  kpiGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14},
  kpiTile: {
    width: '47.5%', backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    padding: 14, ...SHADOWS.sm, alignItems: 'flex-start',
  },
  kpiTileIcon: {width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10},
  kpiTileValue: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: COLORS.textTitle},
  kpiTileLabel: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginTop: 2},

  // Age Chart
  barChartContainer: {gap: 10},
  barRow: {flexDirection: 'row', alignItems: 'center'},
  barLabel: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, width: 48},
  barTrack: {flex: 1, height: 10, backgroundColor: '#E8EAF6', borderRadius: 5, marginHorizontal: 10, overflow: 'hidden'},
  barFill: {height: '100%', borderRadius: 5},
  barPct: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.textTitle, width: 34, textAlign: 'right'},

  // Engagement
  engagementRow: {flexDirection: 'row'},
  engagementItem: {flex: 1, alignItems: 'center', paddingVertical: 4},
  engagementBorder: {borderRightWidth: 1, borderRightColor: COLORS.softBand},
  engagementValue: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginTop: 6},
  engagementLabel: {fontFamily: FONTS.regular, fontSize: 10, color: COLORS.textMuted, marginTop: 2},

  // Gender
  genderContainer: {},
  genderBarTrack: {flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 14},
  genderSegment: {},
  genderLegend: {flexDirection: 'row', justifyContent: 'space-around'},
  genderLegendItem: {alignItems: 'center'},
  genderDot: {width: 10, height: 10, borderRadius: 5, marginBottom: 4},
  genderLegendText: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted},
  genderLegendPct: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginTop: 2},

  // Restart CTA
  restartCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 15, gap: 8, marginTop: 6, ...SHADOWS.md,
  },
  restartCtaText: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.white},
});
