// ============================================================
// MarketingKart.ai — Meta Ads Create Wizard — Step 3: Targeting + Pay
// ============================================================
import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  Modal,
  ActivityIndicator,
  Animated,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import {MOCK_LOCATIONS} from '../../utils/mockData';

const DAILY_FLOOR = 250;
const WALLET_BALANCE = 2450;

// ─── Utility ─────────────────────────────────────────────────
function calcBilling(amount) {
  const gst = Math.round(amount * 0.18);
  const platform = Math.round(amount * 0.05);
  const pgFee = Math.round(amount * 0.02);
  const total = amount + gst + platform + pgFee;
  return {amount, gst, platform, pgFee, total};
}

// ─── Sub-components ──────────────────────────────────────────

function ProgressBar({current, total}) {
  return (
    <View style={styles.progressContainer}>
      {Array.from({length: total}).map((_, i) => (
        <View key={i} style={[styles.progressSegment, {backgroundColor: i < current ? COLORS.primary : COLORS.gray20}]} />
      ))}
      <Text style={styles.progressLabel}>Step {current} of {total}</Text>
    </View>
  );
}

function CircleCheck({checked, onPress, color = COLORS.primary}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
      <View style={[styles.circleCheck, {borderColor: checked ? color : COLORS.gray20, backgroundColor: checked ? color : 'transparent'}]}>
        {checked && <Ionicons name="checkmark" size={13} color={COLORS.white} />}
      </View>
    </TouchableOpacity>
  );
}

function AgeSlider({min = 18, max = 65, value, onChange}) {
  const steps = Array.from({length: max - min + 1}, (_, i) => min + i);
  const [startAge, setStartAge] = useState(value[0]);
  const [endAge, setEndAge] = useState(value[1]);

  const handleDecrStart = () => { const v = Math.max(min, startAge - 1); setStartAge(v); onChange([v, endAge]); };
  const handleIncrStart = () => { const v = Math.min(endAge - 1, startAge + 1); setStartAge(v); onChange([v, endAge]); };
  const handleDecrEnd = () => { const v = Math.max(startAge + 1, endAge - 1); setEndAge(v); onChange([startAge, v]); };
  const handleIncrEnd = () => { const v = Math.min(max, endAge + 1); setEndAge(v); onChange([startAge, v]); };

  const leftPct = ((startAge - min) / (max - min)) * 100;
  const rightPct = ((endAge - min) / (max - min)) * 100;

  return (
    <View>
      <View style={styles.ageRangeDisplay}>
        <View style={styles.ageStepper}>
          <TouchableOpacity onPress={handleDecrStart} style={styles.ageStepBtn} activeOpacity={0.7}>
            <Ionicons name="remove" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.ageVal}>{startAge}</Text>
          <TouchableOpacity onPress={handleIncrStart} style={styles.ageStepBtn} activeOpacity={0.7}>
            <Ionicons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.ageRangeSep}>–</Text>
        <View style={styles.ageStepper}>
          <TouchableOpacity onPress={handleDecrEnd} style={styles.ageStepBtn} activeOpacity={0.7}>
            <Ionicons name="remove" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.ageVal}>{endAge}</Text>
          <TouchableOpacity onPress={handleIncrEnd} style={styles.ageStepBtn} activeOpacity={0.7}>
            <Ionicons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, {left: `${leftPct}%`, right: `${100 - rightPct}%`}]} />
        <View style={[styles.sliderThumb, {left: `${leftPct}%`}]} />
        <View style={[styles.sliderThumb, {left: `${rightPct}%`, marginLeft: -12}]} />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>{min}</Text>
        <Text style={styles.sliderLabelText}>{max}+</Text>
      </View>
    </View>
  );
}

function LocationSelector({selected, onAdd, onRemove}) {
  const [query, setQuery] = useState('');
  const filtered = MOCK_LOCATIONS.filter(
    l => (l.label.toLowerCase().includes(query.toLowerCase()) || l.state.toLowerCase().includes(query.toLowerCase()))
      && !selected.find(s => s.id === l.id),
  );
  return (
    <View>
      <View style={styles.searchInput}>
        <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInputText}
          placeholder="Search city or state..."
          placeholderTextColor={COLORS.textInactive}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {query.length > 0 && filtered.length > 0 && (
        <View style={styles.suggestionsBox}>
          {filtered.slice(0, 6).map(item => (
            <TouchableOpacity key={item.id} style={styles.suggestionItem} onPress={() => {onAdd(item); setQuery('');}} activeOpacity={0.7}>
              <View style={{flex: 1}}>
                <Text style={styles.suggestionText}>{item.label}</Text>
                <Text style={styles.suggestionSub}>{item.state}</Text>
              </View>
              <Ionicons name="add-circle" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selected.length > 0 && (
        <View style={styles.chipsWrap}>
          {selected.map(item => (
            <View key={item.id} style={styles.chip}>
              <Ionicons name="location" size={12} color={COLORS.primary} />
              <Text style={styles.chipText}>{item.label}</Text>
              <TouchableOpacity onPress={() => onRemove(item.id)} hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                <Ionicons name="close-circle" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function BillingRow({label, value, bold}) {
  return (
    <View style={styles.billingRow}>
      <Text style={[styles.billingLabel, bold && styles.billingLabelBold]}>{label}</Text>
      <Text style={[styles.billingValue, bold && styles.billingValueBold]}>₹{value.toLocaleString('en-IN')}</Text>
    </View>
  );
}

function CheckoutPriceModal({visible, billing, onClose, onNext}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Billing Summary</Text>
          <View style={styles.billingCard}>
            <BillingRow label="Ads Amount" value={billing.amount} />
            <View style={styles.billingDivider} />
            <BillingRow label="GST (18%)" value={billing.gst} />
            <BillingRow label="Platform Fee (5%)" value={billing.platform} />
            <BillingRow label="Payment Gateway Fee (2%)" value={billing.pgFee} />
            <View style={styles.billingDivider} />
            <BillingRow label="Total Payable" value={billing.total} bold />
          </View>
          <TouchableOpacity onPress={onNext} activeOpacity={0.85}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.sheetPrimaryBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={styles.sheetPrimaryBtnText}>Proceed to Payment</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function CheckoutFinalModal({visible, billing, onClose, onSuccess, onFail}) {
  const [loading, setLoading] = useState(false);
  const walletSufficient = WALLET_BALANCE >= billing.total;
  const walletPay = Math.min(WALLET_BALANCE, billing.total);
  const remaining = Math.max(0, billing.total - WALLET_BALANCE);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2200);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.sheet, {paddingBottom: 32}]}>
          <View style={styles.sheetHandle} />
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.walletHeader} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Ionicons name="wallet" size={22} color={COLORS.white} />
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.walletTitle}>MarketingKart.ai Wallet</Text>
              <Text style={styles.walletBalance}>₹{WALLET_BALANCE.toLocaleString('en-IN')}</Text>
            </View>
            <Ionicons name="shield-checkmark" size={20} color="rgba(255,255,255,0.7)" />
          </LinearGradient>

          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Pay from Wallet</Text>
            <Text style={styles.payValue}>₹{walletPay.toLocaleString('en-IN')}</Text>
          </View>
          {remaining > 0 && (
            <View style={[styles.payRow, {backgroundColor: COLORS.warningBg, borderRadius: SIZES.radiusSm, padding: 12, marginBottom: 12}]}>
              <View style={{flex: 1}}>
                <Text style={[styles.payLabel, {color: COLORS.warningDark}]}>Remaining via Razorpay</Text>
                <Text style={[styles.payLabel, {color: COLORS.textMuted, fontSize: SIZES.caption}]}>Wallet balance insufficient</Text>
              </View>
              <Text style={[styles.payValue, {color: COLORS.warningDark}]}>₹{remaining.toLocaleString('en-IN')}</Text>
            </View>
          )}

          <View style={styles.payTotalRow}>
            <Text style={styles.payTotalLabel}>Total Payable</Text>
            <Text style={styles.payTotalValue}>₹{billing.total.toLocaleString('en-IN')}</Text>
          </View>

          <TouchableOpacity onPress={handlePay} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.sheetPrimaryBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <>
                    <Ionicons name="lock-closed" size={16} color={COLORS.white} />
                    <Text style={styles.sheetPrimaryBtnText}>Pay Now</Text>
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.secureNote}>🔒 Payments are 100% secure & encrypted</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function SuccessScreen({onViewAds}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, tension: 50, friction: 6}).start();
  }, []);
  return (
    <View style={styles.successScreen}>
      <Animated.View style={[styles.successCircle, {transform: [{scale: scaleAnim}]}]}>
        <LinearGradient colors={[COLORS.success, COLORS.successDark]} style={styles.successGradCircle} start={{x:0,y:0}} end={{x:1,y:1}}>
          <Ionicons name="checkmark" size={52} color={COLORS.white} />
        </LinearGradient>
      </Animated.View>
      <Text style={styles.successTitle}>Campaign Created!</Text>
      <Text style={styles.successSub}>Your Meta ad campaign is now live and being reviewed. You'll be notified once it's approved.</Text>
      <TouchableOpacity onPress={onViewAds} activeOpacity={0.85}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.viewAdsBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
          <Ionicons name="bar-chart" size={18} color={COLORS.white} />
          <Text style={styles.viewAdsBtnText}>View My Ads</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function AdsPageThird({navigation, route}) {
  const params = route?.params || {};
  const {adType = 'Lead Ads', planId, fbBudget = 0, igBudget = 0} = params;

  const adsAmount = planId
    ? (require('./mockData').MOCK_AD_PLANS.find(p => p.id === planId)?.price || 2999)
    : (fbBudget + igBudget || 2999);
  const billing = calcBilling(adsAmount);

  const dailyBudget = fbBudget + igBudget;
  const showDailyWarning = !planId && dailyBudget > 0 && dailyBudget < DAILY_FLOOR;

  const [genderMale, setGenderMale] = useState(true);
  const [genderFemale, setGenderFemale] = useState(true);
  const [locations, setLocations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [ageRange, setAgeRange] = useState([18, 65]);
  const [termsChecked, setTermsChecked] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [success, setSuccess] = useState(false);

  const genderSelected = genderMale || genderFemale;
  const canNext = genderSelected && locations.length > 0 && termsChecked;

  const handleSuccess = useCallback(() => {
    setShowCheckout(false);
    setSuccess(true);
  }, []);

  if (success) {
    return <SuccessScreen onViewAds={() => navigation.navigate('MetaAds')} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ad Campaign Settings</Text>
        <View style={{width: 38}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <ProgressBar current={3} total={3} />

        {/* Gender */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Select the Gender</Text>
          <Text style={styles.sectionSubtitle}>Choose the target audience gender</Text>
          {!genderSelected && (
            <View style={styles.redChip}>
              <Ionicons name="warning" size={14} color={COLORS.error} />
              <Text style={styles.redChipText}>Select at least one gender</Text>
            </View>
          )}
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderBtn, genderMale && styles.genderBtnActive]}
              onPress={() => setGenderMale(v => !v)}
              activeOpacity={0.8}>
              <CircleCheck checked={genderMale} onPress={() => setGenderMale(v => !v)} />
              <Ionicons name="male" size={20} color={genderMale ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.genderLabel, genderMale && {color: COLORS.primary}]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, genderFemale && styles.genderBtnActive]}
              onPress={() => setGenderFemale(v => !v)}
              activeOpacity={0.8}>
              <CircleCheck checked={genderFemale} onPress={() => setGenderFemale(v => !v)} />
              <Ionicons name="female" size={20} color={genderFemale ? COLORS.primary : COLORS.textMuted} />
              <Text style={[styles.genderLabel, genderFemale && {color: COLORS.primary}]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDailyWarning && (
          <View style={styles.redChip}>
            <Ionicons name="warning" size={14} color={COLORS.error} />
            <Text style={styles.redChipText}>Daily budget below ₹250 limit</Text>
          </View>
        )}

        {/* Target Areas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Target Areas</Text>
          <Text style={styles.sectionSubtitle}>Search and select cities to target</Text>
          <LocationSelector
            selected={locations}
            onAdd={loc => setLocations(prev => [...prev, loc])}
            onRemove={id => setLocations(prev => prev.filter(l => l.id !== id))}
          />
          {locations.length === 0 && (
            <Text style={styles.fieldHint}>⚠ At least 1 location required</Text>
          )}
        </View>

        {/* Ad Schedule */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ad Schedule</Text>
          <Text style={styles.sectionSubtitle}>Set your campaign dates and running hours</Text>
          <View style={styles.scheduleRow}>
            <View style={{flex: 1}}>
              <Text style={styles.fieldLabel}>Start Date</Text>
              <View style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textMuted} />
                <TextInput
                  style={styles.dateInputText}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={COLORS.textInactive}
                  value={startDate}
                  onChangeText={setStartDate}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.fieldLabel}>End Date</Text>
              <View style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textMuted} />
                <TextInput
                  style={styles.dateInputText}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={COLORS.textInactive}
                  value={endDate}
                  onChangeText={setEndDate}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
          </View>
          <Text style={[styles.sectionTitle, {fontSize: SIZES.body, marginTop: 14, marginBottom: 10}]}>Running Interval</Text>
          <View style={styles.scheduleRow}>
            <View style={{flex: 1}}>
              <Text style={styles.fieldLabel}>Start Time</Text>
              <View style={styles.dateInput}>
                <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
                <TextInput
                  style={styles.dateInputText}
                  placeholder="HH:MM AM"
                  placeholderTextColor={COLORS.textInactive}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.fieldLabel}>End Time</Text>
              <View style={styles.dateInput}>
                <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
                <TextInput
                  style={styles.dateInputText}
                  placeholder="HH:MM PM"
                  placeholderTextColor={COLORS.textInactive}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Age Range */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Age Range</Text>
          <Text style={styles.sectionSubtitle}>
            Targeting: <Text style={{color: COLORS.primary, fontFamily: FONTS.semiBold}}>{ageRange[0]} – {ageRange[1]}</Text> years
          </Text>
          <AgeSlider value={ageRange} onChange={setAgeRange} />
        </View>

        {/* T&Cs */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            onPress={() => setTermsChecked(v => !v)}
            style={styles.termsRow}
            activeOpacity={0.8}>
            <CircleCheck checked={termsChecked} onPress={() => setTermsChecked(v => !v)} />
            <Text style={styles.termsText}>
              I agree with{' '}
              <Text
                style={styles.termsLink}
                onPress={() => Linking.openURL('https://marketingkart.ai/terms')}>
                Terms & Conditions
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Billing Button */}
        <TouchableOpacity
          onPress={() => setShowBilling(true)}
          style={styles.billingToggleBtn}
          activeOpacity={0.8}>
          <Ionicons name="receipt-outline" size={18} color={COLORS.primary} />
          <Text style={styles.billingToggleText}>View Billing Summary</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky Bottom */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity onPress={() => { if (canNext) setShowBilling(true); }} disabled={!canNext} activeOpacity={0.85} style={{flex: 1}}>
          <LinearGradient
            colors={canNext ? [COLORS.primary, COLORS.primaryDark] : [COLORS.gray20, COLORS.gray40]}
            style={styles.nextBtn}
            start={{x:0,y:0}} end={{x:1,y:0}}>
            <Ionicons name="lock-closed" size={16} color={COLORS.white} style={{marginRight: 6}} />
            <Text style={styles.nextBtnText}>Proceed to Pay</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <CheckoutPriceModal
        visible={showBilling}
        billing={billing}
        onClose={() => setShowBilling(false)}
        onNext={() => { setShowBilling(false); setTimeout(() => setShowCheckout(true), 350); }}
      />
      <CheckoutFinalModal
        visible={showCheckout}
        billing={billing}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleSuccess}
        onFail={() => setShowCheckout(false)}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 14, paddingHorizontal: 16, ...SHADOWS.sm,
  },
  backBtn: {width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.pageBg, justifyContent: 'center', alignItems: 'center'},
  headerTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.primary},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16},
  progressContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 6},
  progressSegment: {flex: 1, height: 4, borderRadius: 2},
  progressLabel: {fontFamily: FONTS.medium, fontSize: SIZES.caption, color: COLORS.textMuted, marginLeft: 8, minWidth: 56, textAlign: 'right'},
  sectionCard: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, marginBottom: 14, ...SHADOWS.sm},
  sectionTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginBottom: 4},
  sectionSubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginBottom: 14},
  circleCheck: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center'},
  genderRow: {flexDirection: 'row', gap: 12},
  genderBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: SIZES.radiusSm, borderWidth: 1.5, borderColor: COLORS.gray20, backgroundColor: COLORS.white},
  genderBtnActive: {borderColor: COLORS.primary, backgroundColor: COLORS.primary + '0A'},
  genderLabel: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textMuted},
  redChip: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.errorBg, borderRadius: SIZES.radiusFull, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 12, gap: 6, borderWidth: 1, borderColor: COLORS.error + '44'},
  redChipText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.error},
  fieldLabel: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textSecondary, marginBottom: 6},
  fieldHint: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.warning, marginTop: 8},
  searchInput: {flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.gray20, borderRadius: SIZES.radiusSm, paddingHorizontal: 12, paddingVertical: 10, gap: 8, backgroundColor: COLORS.white, marginBottom: 10},
  searchInputText: {flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textTitle},
  suggestionsBox: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusSm, borderWidth: 1, borderColor: COLORS.gray20, marginBottom: 10, ...SHADOWS.sm, overflow: 'hidden'},
  suggestionItem: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.pageBg},
  suggestionText: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textTitle},
  suggestionSub: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted},
  chipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4},
  chip: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '15', borderRadius: SIZES.radiusFull, paddingHorizontal: 10, paddingVertical: 6, gap: 5, borderWidth: 1, borderColor: COLORS.primary + '33'},
  chipText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.primary},
  scheduleRow: {flexDirection: 'row', gap: 12},
  dateInput: {flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.gray20, borderRadius: SIZES.radiusSm, paddingHorizontal: 10, paddingVertical: 10, gap: 6, backgroundColor: COLORS.white},
  dateInputText: {flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textTitle},
  ageRangeDisplay: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20},
  ageStepper: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusSm, borderWidth: 1, borderColor: COLORS.gray20, overflow: 'hidden'},
  ageStepBtn: {paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.white},
  ageVal: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.primary, paddingHorizontal: 14, minWidth: 42, textAlign: 'center'},
  ageRangeSep: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: COLORS.textMuted},
  sliderTrack: {height: 6, backgroundColor: COLORS.gray20, borderRadius: 3, position: 'relative', marginHorizontal: 6, marginBottom: 8},
  sliderFill: {position: 'absolute', top: 0, bottom: 0, backgroundColor: COLORS.primary, borderRadius: 3},
  sliderThumb: {position: 'absolute', top: -5, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.white, borderWidth: 2.5, borderColor: COLORS.primary},
  sliderLabels: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 4},
  sliderLabelText: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted},
  termsRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  termsText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22},
  termsLink: {fontFamily: FONTS.semiBold, color: COLORS.primary, textDecorationLine: 'underline'},
  billingToggleBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 14, ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.primary + '22'},
  billingToggleText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary},
  stickyBottom: {backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12, ...SHADOWS.lg, flexDirection: 'row'},
  nextBtn: {borderRadius: SIZES.radiusFull, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'},
  nextBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.white, letterSpacing: 0.3},
  sheetOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end'},
  sheet: {backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20},
  sheetHandle: {width: 40, height: 4, backgroundColor: COLORS.gray20, borderRadius: 2, alignSelf: 'center', marginBottom: 16},
  sheetTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 16},
  sheetPrimaryBtn: {borderRadius: SIZES.radiusFull, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16},
  sheetPrimaryBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.white},
  billingCard: {backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusSm, padding: 14, marginBottom: 4},
  billingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9},
  billingDivider: {height: 1, backgroundColor: COLORS.gray20, marginVertical: 4},
  billingLabel: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary},
  billingLabelBold: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.textTitle},
  billingValue: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textTitle},
  billingValueBold: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.primary},
  walletHeader: {flexDirection: 'row', alignItems: 'center', borderRadius: SIZES.radiusMd, padding: 16, marginBottom: 16},
  walletTitle: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: 'rgba(255,255,255,0.85)'},
  walletBalance: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: COLORS.white},
  payRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  payLabel: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textSecondary},
  payValue: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle},
  payTotalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderColor: COLORS.gray20, marginBottom: 4},
  payTotalLabel: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.textTitle},
  payTotalValue: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.primary},
  secureNote: {textAlign: 'center', fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted, marginTop: 12},
  successScreen: {flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', padding: 32},
  successCircle: {marginBottom: 28},
  successGradCircle: {width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center'},
  successTitle: {fontFamily: FONTS.bold, fontSize: SIZES.h1, color: COLORS.textTitle, marginBottom: 12, textAlign: 'center'},
  successSub: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 32},
  viewAdsBtn: {borderRadius: SIZES.radiusFull, paddingVertical: 16, paddingHorizontal: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8},
  viewAdsBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.white},
});
