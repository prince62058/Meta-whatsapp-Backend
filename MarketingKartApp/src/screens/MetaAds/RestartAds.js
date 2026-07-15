// ============================================================
// MarketingKart.ai — RestartAds Screen (Meta Ads)
// ============================================================
import React, {useState, useCallback} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Modal, Pressable, TextInput,
  ToastAndroid, Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import {MOCK_AD_PLANS} from '../../utils/mockData';
import {formatCurrency} from '../../utils/helpers';

// ─── Helpers ───────────────────────────────────────────────
const showToast = msg => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('', msg);
  }
};

// ─── Budget Stepper ────────────────────────────────────────
function BudgetStepper({label, value, onChange, step = 500, min = 0}) {
  const daily = Math.round(value / 7);
  const isLow = value > 0 && daily < 250;
  return (
    <View style={styles.stepperWrap}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={[styles.stepBtn, value <= min && styles.stepBtnDisabled]}
          onPress={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          activeOpacity={0.75}>
          <Ionicons name="remove" size={20} color={value <= min ? COLORS.gray40 : COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.stepValueBox}>
          <Text style={styles.stepValue}>₹{value.toLocaleString('en-IN')}</Text>
          <Text style={styles.stepDaily}>~₹{daily}/day</Text>
        </View>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(value + step)}
          activeOpacity={0.75}>
          <Ionicons name="add" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {isLow && (
        <View style={styles.warningChip}>
          <Ionicons name="warning-outline" size={13} color={COLORS.white} />
          <Text style={styles.warningChipText}>Daily budget must be at least ₹250</Text>
        </View>
      )}
    </View>
  );
}

// ─── Plan Card ─────────────────────────────────────────────
function PlanCard({plan, selected, onSelect}) {
  return (
    <TouchableOpacity
      style={[styles.planCard, selected && {borderColor: plan.color, borderWidth: 2}]}
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.85}>
      {plan.popular && (
        <View style={[styles.popularBadge, {backgroundColor: plan.color}]}>
          <Text style={styles.popularText}>POPULAR</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <View style={[styles.planIconWrap, {backgroundColor: plan.color + '18'}]}>
          <Ionicons name="rocket-outline" size={22} color={plan.color} />
        </View>
        <View style={{marginLeft: 10, flex: 1}}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDesc}>{plan.description}</Text>
        </View>
        <View style={[styles.planRadio, selected && {borderColor: plan.color}]}>
          {selected && <View style={[styles.planRadioDot, {backgroundColor: plan.color}]} />}
        </View>
      </View>
      <View style={styles.planDetails}>
        <View style={styles.planDetailItem}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.planDetailText}>{plan.duration} days</Text>
        </View>
        <View style={styles.planDetailItem}>
          <Ionicons name="logo-facebook" size={13} color={COLORS.metaBlue} />
          <Text style={styles.planDetailText}>₹{plan.fbBudget.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.planDetailItem}>
          <Ionicons name="logo-instagram" size={13} color="#E91E63" />
          <Text style={styles.planDetailText}>₹{plan.igBudget.toLocaleString('en-IN')}</Text>
        </View>
      </View>
      <Text style={[styles.planPrice, {color: plan.color}]}>₹{plan.price.toLocaleString('en-IN')}</Text>
    </TouchableOpacity>
  );
}

// ─── Date Input ────────────────────────────────────────────
function DateInput({label, value, onChange}) {
  return (
    <View style={styles.dateInputWrap}>
      <Text style={styles.dateInputLabel}>{label}</Text>
      <TouchableOpacity style={styles.dateInputBox} activeOpacity={0.8}>
        <Ionicons name="calendar-outline" size={16} color={COLORS.primary} style={{marginRight: 8}} />
        <TextInput
          style={styles.dateInputText}
          value={value}
          onChangeText={onChange}
          placeholder="DD / MM / YYYY"
          placeholderTextColor={COLORS.textInactive}
          keyboardType="numeric"
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── Billing Sheet ─────────────────────────────────────────
function BillingSheet({visible, onClose, adAmount}) {
  const gst = Math.round(adAmount * 0.18);
  const platformFee = Math.round(adAmount * 0.05);
  const total = adAmount + gst + platformFee;

  const rows = [
    {label: 'Ad Amount', value: formatCurrency(adAmount), icon: 'megaphone-outline', color: COLORS.primary},
    {label: 'GST (18%)', value: formatCurrency(gst), icon: 'receipt-outline', color: COLORS.adInProgress},
    {label: 'Platform Fee (5%)', value: formatCurrency(platformFee), icon: 'layers-outline', color: COLORS.textMuted},
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose} />
      <View style={styles.billingSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.billingTitle}>Billing Summary</Text>
        <View style={styles.billingSeparator} />
        {rows.map(row => (
          <View key={row.label} style={styles.billingRow}>
            <View style={styles.billingRowLeft}>
              <Ionicons name={row.icon} size={16} color={row.color} style={{marginRight: 8}} />
              <Text style={styles.billingLabel}>{row.label}</Text>
            </View>
            <Text style={styles.billingValue}>{row.value}</Text>
          </View>
        ))}
        <View style={styles.billingSeparator} />
        <View style={[styles.billingRow, styles.billingTotal]}>
          <Text style={styles.billingTotalLabel}>Total Payable</Text>
          <Text style={styles.billingTotalValue}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity style={styles.proceedBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.proceedBtnText}>Got it</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── Main Screen ───────────────────────────────────────────
export default function RestartAds({route, navigation}) {
  const {ad} = route.params;
  const [fbBudget, setFbBudget] = useState(ad.fbBudget || 1500);
  const [igBudget, setIgBudget] = useState(ad.igBudget || 1500);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [billingVisible, setBillingVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const usePlan = selectedPlan !== null;
  const activePlan = MOCK_AD_PLANS.find(p => p.id === selectedPlan);
  const totalBudget = usePlan ? activePlan.price : fbBudget + igBudget;
  const dailyFb = Math.round(fbBudget / 7);
  const dailyIg = Math.round(igBudget / 7);
  const hasLowBudget = !usePlan && ((fbBudget > 0 && dailyFb < 250) || (igBudget > 0 && dailyIg < 250));

  const handleRestart = useCallback(() => {
    if (hasLowBudget) {
      Alert.alert('Low Budget', 'Daily budget must be at least ₹250 per platform.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast('Campaign restarted!');
      navigation.goBack();
    }, 1500);
  }, [hasLowBudget, navigation]);

  const handlePlanSelect = id => {
    if (selectedPlan === id) {
      setSelectedPlan(null);
    } else {
      const plan = MOCK_AD_PLANS.find(p => p.id === id);
      if (plan) {
        setSelectedPlan(id);
        setFbBudget(plan.fbBudget);
        setIgBudget(plan.igBudget);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restart Ad</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Campaign Badge */}
        <View style={styles.campaignBadge}>
          <Ionicons name="megaphone-outline" size={16} color={COLORS.primary} />
          <Text style={styles.campaignBadgeName} numberOfLines={1}>{ad.campaignName}</Text>
        </View>

        {/* Budget Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="wallet-outline" size={15} color={COLORS.primary} /> Set Budget
          </Text>
          <BudgetStepper label="Facebook Budget" value={fbBudget} onChange={setFbBudget} />
          <BudgetStepper label="Instagram Budget" value={igBudget} onChange={setIgBudget} />
        </View>

        {/* OR Divider */}
        <View style={styles.orDivider}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR SELECT A PLAN</Text>
          <View style={styles.orLine} />
        </View>

        {/* Plan Cards */}
        <View style={styles.planList}>
          {MOCK_AD_PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={handlePlanSelect}
            />
          ))}
        </View>

        {/* Date Pickers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="calendar-outline" size={15} color={COLORS.primary} /> Campaign Duration
          </Text>
          <View style={styles.dateRow}>
            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
            <View style={{width: 12}} />
            <DateInput label="End Date" value={endDate} onChange={setEndDate} />
          </View>
        </View>

        {/* Budget Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Budget</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalBudget)}</Text>
          </View>
          {!usePlan && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summarySubLabel}>FB Budget</Text>
                <Text style={styles.summarySubValue}>{formatCurrency(fbBudget)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summarySubLabel}>IG Budget</Text>
                <Text style={styles.summarySubValue}>{formatCurrency(igBudget)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Billing + Restart Buttons */}
        <TouchableOpacity
          style={styles.billingBtn}
          onPress={() => setBillingVisible(true)}
          activeOpacity={0.8}>
          <Ionicons name="receipt-outline" size={17} color={COLORS.primary} />
          <Text style={styles.billingBtnText}>View Billing Summary</Text>
          <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.restartBtn, (hasLowBudget || submitting) && styles.restartBtnDisabled]}
          onPress={handleRestart}
          disabled={hasLowBudget || submitting}
          activeOpacity={0.85}>
          {submitting ? (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.white} />
              <Text style={styles.restartBtnText}>Restarting...</Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Ionicons name="refresh-circle-outline" size={20} color={COLORS.white} />
              <Text style={styles.restartBtnText}>Restart Campaign</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>

      <BillingSheet
        visible={billingVisible}
        onClose={() => setBillingVisible(false)}
        adAmount={totalBudget}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 52,
    paddingBottom: 16, paddingHorizontal: 16,
  },
  backBtn: {width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},
  headerTitle: {flex: 1, fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.white, marginLeft: 12},

  scrollContent: {padding: 16},

  // Campaign Badge
  campaignBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.metaBlueLight, borderRadius: SIZES.radiusMd,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20,
  },
  campaignBadgeName: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary, marginLeft: 8, flex: 1},

  // Section
  section: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg, padding: 16, ...SHADOWS.sm, marginBottom: 16},
  sectionTitle: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 14},

  // Stepper
  stepperWrap: {marginBottom: 14},
  stepperLabel: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textSecondary, marginBottom: 8},
  stepperRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  stepBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.metaBlueLight, alignItems: 'center', justifyContent: 'center',
  },
  stepBtnDisabled: {backgroundColor: COLORS.softBand},
  stepValueBox: {flex: 1, alignItems: 'center'},
  stepValue: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: COLORS.textTitle},
  stepDaily: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted, marginTop: 2},
  warningChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.adError, borderRadius: SIZES.radiusFull,
    paddingHorizontal: 10, paddingVertical: 5, marginTop: 8, alignSelf: 'flex-start', gap: 5,
  },
  warningChipText: {fontFamily: FONTS.semiBold, fontSize: SIZES.caption, color: COLORS.white},

  // OR Divider
  orDivider: {flexDirection: 'row', alignItems: 'center', marginVertical: 8},
  orLine: {flex: 1, height: 1, backgroundColor: COLORS.gray20},
  orText: {fontFamily: FONTS.semiBold, fontSize: 10, color: COLORS.textMuted, paddingHorizontal: 12, letterSpacing: 1},

  // Plan Cards
  planList: {gap: 12, marginBottom: 16},
  planCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    padding: 16, ...SHADOWS.sm, borderWidth: 1.5, borderColor: 'transparent', position: 'relative',
  },
  popularBadge: {
    position: 'absolute', top: -1, right: 16,
    paddingHorizontal: 10, paddingVertical: 3, borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
  },
  popularText: {fontFamily: FONTS.bold, fontSize: 9, color: COLORS.white, letterSpacing: 1},
  planHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  planIconWrap: {width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  planName: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle},
  planDesc: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginTop: 2},
  planRadio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: COLORS.gray40, alignItems: 'center', justifyContent: 'center',
  },
  planRadioDot: {width: 10, height: 10, borderRadius: 5},
  planDetails: {flexDirection: 'row', gap: 16, marginBottom: 8},
  planDetailItem: {flexDirection: 'row', alignItems: 'center', gap: 4},
  planDetailText: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textSecondary},
  planPrice: {fontFamily: FONTS.bold, fontSize: SIZES.h2, textAlign: 'right'},

  // Date
  dateRow: {flexDirection: 'row'},
  dateInputWrap: {flex: 1},
  dateInputLabel: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textSecondary, marginBottom: 6},
  dateInputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.gray20, borderRadius: SIZES.radiusMd,
    paddingHorizontal: 10, paddingVertical: 10, backgroundColor: COLORS.white,
  },
  dateInputText: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textBody, flex: 1, padding: 0},

  // Summary
  summaryCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    padding: 16, ...SHADOWS.sm, marginBottom: 14,
  },
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6},
  summaryLabel: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle},
  summaryValue: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.primary},
  summarySubLabel: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted},
  summarySubValue: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textSecondary},

  // Billing Btn
  billingBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 13, marginBottom: 12, gap: 8, backgroundColor: COLORS.white,
  },
  billingBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary, flex: 1, textAlign: 'center'},

  // Restart Btn
  restartBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 15, alignItems: 'center', justifyContent: 'center', ...SHADOWS.md,
  },
  restartBtnDisabled: {backgroundColor: COLORS.gray40},
  restartBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.white},

  // Modal
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)'},
  billingSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28, paddingHorizontal: 20, paddingTop: 12,
  },
  sheetHandle: {width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.gray20, alignSelf: 'center', marginBottom: 16},
  billingTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 14},
  billingSeparator: {height: 1, backgroundColor: COLORS.softBand, marginVertical: 12},
  billingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6},
  billingRowLeft: {flexDirection: 'row', alignItems: 'center'},
  billingLabel: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary},
  billingValue: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle},
  billingTotal: {backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusMd, paddingHorizontal: 12, marginTop: 4},
  billingTotalLabel: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle},
  billingTotalValue: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: COLORS.primary},
  proceedBtn: {
    marginTop: 20, backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 14, alignItems: 'center',
  },
  proceedBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.white},
});
