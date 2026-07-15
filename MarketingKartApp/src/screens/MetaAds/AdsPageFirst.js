// ============================================================
// MarketingKart.ai — Meta Ads Create Wizard — Step 1: Budget / Plan
// ============================================================
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import {MOCK_AD_PLANS} from '../../utils/mockData';

const DAILY_FLOOR = 250;

// ─── Sub-components ──────────────────────────────────────────

function ProgressBar({current, total}) {
  return (
    <View style={styles.progressContainer}>
      {Array.from({length: total}).map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressSegment,
            {backgroundColor: i < current ? COLORS.primary : COLORS.gray20},
          ]}
        />
      ))}
      <Text style={styles.progressLabel}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

function BudgetRow({platform, icon, enabled, onToggle, amount, onIncrease, onDecrease, note}) {
  return (
    <View style={styles.budgetRow}>
      <TouchableOpacity onPress={onToggle} style={styles.budgetCheck} activeOpacity={0.8}>
        <View
          style={[
            styles.circleCheck,
            {backgroundColor: enabled ? COLORS.primary : 'transparent', borderColor: enabled ? COLORS.primary : COLORS.gray20},
          ]}>
          {enabled && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
        </View>
      </TouchableOpacity>
      <View style={styles.budgetIcon}>
        <Ionicons name={icon} size={20} color={enabled ? COLORS.primary : COLORS.textMuted} />
      </View>
      <Text style={[styles.budgetPlatformLabel, {color: enabled ? COLORS.textTitle : COLORS.textMuted}]}>
        {platform}
      </Text>
      <View style={styles.budgetStepper}>
        <TouchableOpacity
          onPress={onDecrease}
          disabled={!enabled}
          style={[styles.stepBtn, {opacity: enabled ? 1 : 0.4}]}
          activeOpacity={0.7}>
          <Ionicons name="remove" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={[styles.stepAmount, {color: enabled ? COLORS.textTitle : COLORS.textMuted}]}>
          ₹{amount.toLocaleString('en-IN')}
        </Text>
        <TouchableOpacity
          onPress={onIncrease}
          disabled={!enabled}
          style={[styles.stepBtn, {opacity: enabled ? 1 : 0.4}]}
          activeOpacity={0.7}>
          <Ionicons name="add" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {note ? (
        <Text style={styles.budgetNote}>{note}</Text>
      ) : null}
    </View>
  );
}

function AnalyticCard({fbBudget, igBudget, fbEnabled, igEnabled}) {
  const totalBudget = (fbEnabled ? fbBudget : 0) + (igEnabled ? igBudget : 0);
  const estimateDays = totalBudget > 0 ? Math.floor(totalBudget / DAILY_FLOOR) : 0;
  const dailySpend = totalBudget > 0 ? Math.round(totalBudget / Math.max(estimateDays, 1)) : 0;
  const reachLow = Math.round(totalBudget * 4);
  const reachHigh = Math.round(totalBudget * 9);
  const leadsLow = Math.round(totalBudget * 0.015);
  const leadsHigh = Math.round(totalBudget * 0.04);

  return (
    <View style={styles.analyticCard}>
      <View style={styles.analyticHeader}>
        <Ionicons name="stats-chart" size={16} color={COLORS.primary} />
        <Text style={styles.analyticTitle}>Estimated Results</Text>
      </View>
      <View style={styles.analyticRow}>
        <View style={styles.analyticItem}>
          <Text style={styles.analyticValue}>
            {totalBudget > 0
              ? `${reachLow.toLocaleString('en-IN')} – ${reachHigh.toLocaleString('en-IN')}`
              : '—'}
          </Text>
          <Text style={styles.analyticLabel}>Estimated Views</Text>
        </View>
        <View style={styles.analyticDivider} />
        <View style={styles.analyticItem}>
          <Text style={styles.analyticValue}>
            {totalBudget > 0 ? `${leadsLow} – ${leadsHigh}` : '—'}
          </Text>
          <Text style={styles.analyticLabel}>Leads / Clicks</Text>
        </View>
        <View style={styles.analyticDivider} />
        <View style={styles.analyticItem}>
          <Text style={styles.analyticValue}>{estimateDays > 0 ? `${estimateDays}d` : '—'}</Text>
          <Text style={styles.analyticLabel}>Est. Duration</Text>
        </View>
      </View>
      {totalBudget > 0 && (
        <Text style={styles.analyticNote}>
          Based on ₹{dailySpend.toLocaleString('en-IN')}/day average spend
        </Text>
      )}
    </View>
  );
}

function PlanCard({plan, selected, onSelect}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(plan.id)}
      style={[styles.planCard, selected && styles.planCardSelected]}>
      <LinearGradient colors={plan.color} style={styles.planHeader} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
        <View style={styles.planHeaderRow}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{plan.duration}</Text>
          </View>
        </View>
        <Text style={styles.planPrice}>₹{plan.price.toLocaleString('en-IN')}</Text>
        <Text style={styles.planKpi}>{plan.kpi}</Text>
      </LinearGradient>
      <View style={styles.planBody}>
        <Text style={styles.planReach}>
          <Text style={styles.planReachBold}>Reach: </Text>
          {plan.estimatedReach} people
        </Text>
        {selected && (
          <View style={styles.selectedCheck}>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function AccordionItem({title, children}) {
  const [open, setOpen] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(v => !v);
  };

  const rotate = rotateAnim.interpolate({inputRange: [0, 1], outputRange: ['0deg', '180deg']});

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={toggle} style={styles.accordionHeader} activeOpacity={0.8}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Animated.View style={{transform: [{rotate}]}}>
          <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
        </Animated.View>
      </TouchableOpacity>
      {open && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function AdsPageFirst({navigation, route}) {
  const {adType = 'Lead Ads'} = route?.params || {};

  const [fbEnabled, setFbEnabled] = useState(false);
  const [igEnabled, setIgEnabled] = useState(false);
  const [fbBudget, setFbBudget] = useState(1000);
  const [igBudget, setIgBudget] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const STEP = 1000;
  const MIN = 1000;

  const totalCustomBudget = (fbEnabled ? fbBudget : 0) + (igEnabled ? igBudget : 0);
  const customActive = fbEnabled || igEnabled;
  const dailyBelow = customActive && totalCustomBudget < DAILY_FLOOR;

  const handleFbChange = delta => {
    setFbBudget(v => Math.max(MIN, v + delta));
    setSelectedPlan(null);
  };
  const handleIgChange = delta => {
    setIgBudget(v => Math.max(MIN, v + delta));
    setSelectedPlan(null);
  };

  const handlePlanSelect = useCallback(planId => {
    setSelectedPlan(planId === selectedPlan ? null : planId);
    setFbEnabled(false);
    setIgEnabled(false);
  }, [selectedPlan]);

  const handleFbToggle = () => {
    setFbEnabled(v => !v);
    setSelectedPlan(null);
  };
  const handleIgToggle = () => {
    setIgEnabled(v => !v);
    setSelectedPlan(null);
  };

  const canNext = selectedPlan !== null || customActive;

  const handleNext = () => {
    navigation.navigate('AdsPageSecond', {
      adType,
      planId: selectedPlan,
      fbBudget: fbEnabled ? fbBudget : 0,
      igBudget: igEnabled ? igBudget : 0,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create {adType}</Text>
        <View style={{width: 38}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <ProgressBar current={1} total={3} />

        {/* Custom Budget Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Custom Budget</Text>
          <Text style={styles.sectionSubtitle}>Set your own budget for each platform</Text>

          <BudgetRow
            platform="Facebook"
            icon="logo-facebook"
            enabled={fbEnabled}
            onToggle={handleFbToggle}
            amount={fbBudget}
            onIncrease={() => handleFbChange(STEP)}
            onDecrease={() => handleFbChange(-STEP)}
          />
          <BudgetRow
            platform="Instagram"
            icon="logo-instagram"
            enabled={igEnabled}
            onToggle={handleIgToggle}
            amount={igBudget}
            onIncrease={() => handleIgChange(STEP)}
            onDecrease={() => handleIgChange(-STEP)}
            note="Link Instagram to your FB Page"
          />

          {dailyBelow && (
            <View style={styles.redChip}>
              <Ionicons name="warning" size={14} color={COLORS.error} />
              <Text style={styles.redChipText}>Daily budget below ₹250 limit</Text>
            </View>
          )}

          {customActive && (
            <AnalyticCard
              fbBudget={fbBudget}
              igBudget={igBudget}
              fbEnabled={fbEnabled}
              igEnabled={igEnabled}
            />
          )}
        </View>

        {/* OR Divider */}
        <View style={styles.orDivider}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        {/* Plan Cards */}
        <Text style={styles.planSectionTitle}>Choose a Plan</Text>
        <Text style={styles.planSectionSub}>Managed campaigns with guaranteed results</Text>
        {MOCK_AD_PLANS.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={handlePlanSelect}
          />
        ))}

        {/* What's Included */}
        <View style={styles.sectionCard}>
          <AccordionItem title="📦 What's Included">
            <View style={styles.includeList}>
              {['🎨 Professional Ad Templates', '📊 Performance Analytics Dashboard', '🎯 Advanced Interest Targeting', '💬 Priority Customer Support', '📅 Campaign Scheduling', '📈 Weekly Performance Reports'].map((item, i) => (
                <View key={i} style={styles.includeRow}>
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
            </View>
          </AccordionItem>
        </View>

        {/* FAQ */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <AccordionItem title="How does Facebook ad budgeting work?">
            <Text style={styles.faqAnswer}>
              Your budget is the amount you're willing to spend on your Facebook ad campaign. You can set a daily budget (average daily amount) or lifetime budget (total amount for the campaign duration). Facebook distributes your budget to maximize results.
            </Text>
          </AccordionItem>
          <AccordionItem title="What is the minimum budget required?">
            <Text style={styles.faqAnswer}>
              The minimum daily budget is ₹250 per day. For custom budgets, Facebook requires at least ₹1,000 to run a meaningful campaign. Our managed plans start at ₹2,999 and include expert optimization.
            </Text>
          </AccordionItem>
          <AccordionItem title="Can I change my plan after the campaign starts?">
            <Text style={styles.faqAnswer}>
              You can upgrade your plan at any time. Downgrades are not allowed once a campaign is live. Contact our support team for plan modifications — we're available 24/7 for all paid plans.
            </Text>
          </AccordionItem>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky Bottom */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canNext}
          activeOpacity={0.85}
          style={{flex: 1}}>
          <LinearGradient
            colors={canNext ? [COLORS.primary, COLORS.primaryDark] : [COLORS.gray20, COLORS.gray40]}
            style={styles.nextBtn}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={styles.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{marginLeft: 6}} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    ...SHADOWS.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.pageBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.subtitle,
    color: COLORS.primary,
  },
  scrollContent: {paddingHorizontal: 16, paddingTop: 16},
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  progressSegment: {flex: 1, height: 4, borderRadius: 2},
  progressLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    marginLeft: 8,
    minWidth: 56,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.subtitle,
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  budgetCheck: {padding: 2},
  circleCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetIcon: {width: 28, alignItems: 'center'},
  budgetPlatformLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body,
    flex: 1,
    minWidth: 80,
  },
  budgetStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.gray20,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  stepAmount: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.body,
    paddingHorizontal: 10,
    minWidth: 80,
    textAlign: 'center',
  },
  budgetNote: {
    width: '100%',
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 64,
    fontStyle: 'italic',
  },
  redChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorBg,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.error + '44',
  },
  redChipText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.error,
  },
  analyticCard: {
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusSm,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.primary + '22',
  },
  analyticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  analyticTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  analyticRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticItem: {flex: 1, alignItems: 'center'},
  analyticDivider: {width: 1, height: 36, backgroundColor: COLORS.gray20},
  analyticValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.textTitle,
    textAlign: 'center',
  },
  analyticLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  analyticNote: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 12,
  },
  orLine: {flex: 1, height: 1, backgroundColor: COLORS.gray20},
  orText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  planSectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.title,
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  planSectionSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    marginBottom: 14,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.sm,
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  planHeader: {
    padding: 16,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  planName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.title,
    color: COLORS.white,
  },
  durationBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  durationText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.caption,
    color: COLORS.white,
  },
  planPrice: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
    marginBottom: 2,
  },
  planKpi: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.85)',
  },
  planBody: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planReach: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    flex: 1,
  },
  planReachBold: {fontFamily: FONTS.semiBold, color: COLORS.textTitle},
  selectedCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  accordionItem: {
    borderTopWidth: 1,
    borderColor: COLORS.pageBg,
    marginTop: 4,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  accordionTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body,
    color: COLORS.textTitle,
    flex: 1,
  },
  accordionBody: {paddingBottom: 12},
  includeList: {gap: 8},
  includeRow: {flexDirection: 'row', alignItems: 'center'},
  includeText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
  faqAnswer: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  stickyBottom: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    ...SHADOWS.lg,
    flexDirection: 'row',
  },
  nextBtn: {
    borderRadius: SIZES.radiusFull,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  nextBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.bodyLg,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
