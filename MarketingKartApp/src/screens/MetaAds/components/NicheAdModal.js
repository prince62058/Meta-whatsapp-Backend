// ============================================================
// MarketingKart.ai — Niche Ad Modal (Full-screen wizard)
// ============================================================
import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_NICHES, MOCK_AD_PLANS} from '../../utils/mockData';

// ─── Steps ───────────────────────────────────────────────────
// 0 = Niche grid
// 1 = Disclaimer
// 2 = Plan picker
// 3 = Ad type picker

const AD_TYPES = [
  {
    id: 'WhatsApp Ads',
    label: 'WhatsApp Ads',
    icon: 'logo-whatsapp',
    color: ['#25D366', '#128C7E'],
    desc: 'Drive conversations directly on WhatsApp',
  },
  {
    id: 'Lead Ads',
    label: 'Lead Ads',
    icon: 'people',
    color: [COLORS.primary, COLORS.primaryDark],
    desc: 'Collect leads with a native form inside the app',
  },
  {
    id: 'Call Ads',
    label: 'Call Ads',
    icon: 'call',
    color: ['#0891b2', '#0369a1'],
    desc: 'Let customers call you directly from the ad',
  },
  {
    id: 'Traffic Ads',
    label: 'Traffic Ads',
    icon: 'globe',
    color: ['#7C3AED', '#6D28D9'],
    desc: 'Drive visitors to your website or landing page',
  },
];

// ─── Sub-components ──────────────────────────────────────────

function StepHeader({title, onBack, step, total}) {
  return (
    <View style={styles.stepHeader}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
      </TouchableOpacity>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={styles.stepTitle}>{title}</Text>
        {total > 1 && (
          <Text style={styles.stepCount}>Step {step} of {total}</Text>
        )}
      </View>
    </View>
  );
}

function NicheCard({niche, onSelect}) {
  return (
    <TouchableOpacity style={styles.nicheCardWrap} onPress={() => onSelect(niche)} activeOpacity={0.85}>
      <LinearGradient colors={niche.color} style={styles.nicheCard} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
        <View style={styles.nicheIconCircle}>
          <Ionicons name={niche.icon} size={24} color={COLORS.white} />
        </View>
        <Text style={styles.nicheLabel}>{niche.label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function PlanCard({plan, selected, onSelect}) {
  return (
    <TouchableOpacity onPress={() => onSelect(plan)} activeOpacity={0.85} style={[styles.planCard, selected && styles.planCardSelected]}>
      <LinearGradient colors={plan.color} style={styles.planGradHeader} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
        <View style={styles.planHeaderRow}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{plan.duration}</Text>
          </View>
        </View>
        <Text style={styles.planPrice}>₹{plan.price.toLocaleString('en-IN')}</Text>
        <Text style={styles.planKpi}>{plan.kpi}</Text>
      </LinearGradient>
      <View style={styles.planFooter}>
        <Text style={styles.planReach}>
          <Text style={{fontFamily: FONTS.semiBold, color: COLORS.textTitle}}>Reach: </Text>
          {plan.estimatedReach} people
        </Text>
        {selected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function AdTypeCard({type, onSelect}) {
  return (
    <TouchableOpacity onPress={() => onSelect(type.id)} activeOpacity={0.85} style={styles.adTypeCard}>
      <LinearGradient colors={type.color} style={styles.adTypeGrad} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
        <Ionicons name={type.icon} size={30} color={COLORS.white} />
      </LinearGradient>
      <View style={{flex: 1}}>
        <Text style={styles.adTypeLabel}>{type.label}</Text>
        <Text style={styles.adTypeDesc}>{type.desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

// ─── Main Modal ───────────────────────────────────────────────

export default function NicheAdModal({visible, onClose, navigation}) {
  const [step, setStep] = useState(0);
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const resetAndClose = () => {
    setStep(0);
    setSelectedNiche(null);
    setSelectedPlan(null);
    onClose();
  };

  const handleBack = () => {
    if (step === 0) {
      resetAndClose();
    } else {
      setStep(s => s - 1);
    }
  };

  const handleNicheSelect = niche => {
    setSelectedNiche(niche);
    setStep(1);
  };

  const handleDisclaimerAgree = () => setStep(2);

  const handlePlanSelect = plan => setSelectedPlan(plan);

  const handlePlanNext = () => {
    if (selectedPlan) setStep(3);
  };

  const handleAdTypeSelect = adType => {
    resetAndClose();
    navigation.navigate('AdsPageSecond', {
      niche: selectedNiche?.id,
      nicheName: selectedNiche?.label,
      planId: selectedPlan?.id,
      adType,
      fromNiche: true,
    });
  };

  const stepTitles = ['Select Your Niche', 'Important Notice', 'Choose a Plan', 'Select Ad Type'];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={resetAndClose} statusBarTranslucent>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.root}>

        {/* ── Step 0: Niche Grid ── */}
        {step === 0 && (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={resetAndClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color={COLORS.textTitle} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Your Niche</Text>
              <View style={{width: 38}} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionSub}>Choose the industry that best describes your business</Text>
              <View style={styles.nicheGrid}>
                {MOCK_NICHES.map(niche => (
                  <NicheCard key={niche.id} niche={niche} onSelect={handleNicheSelect} />
                ))}
              </View>
              <View style={{height: 40}} />
            </ScrollView>
          </>
        )}

        {/* ── Step 1: Disclaimer ── */}
        {step === 1 && (
          <>
            <StepHeader title="Important Notice" onBack={handleBack} step={2} total={4} />
            <ScrollView contentContainerStyle={[styles.scrollContent, {justifyContent: 'center', flex: 0}]} showsVerticalScrollIndicator={false}>

              {selectedNiche && (
                <LinearGradient colors={selectedNiche.color} style={styles.selectedNicheBanner} start={{x:0,y:0}} end={{x:1,y:1}}>
                  <Ionicons name={selectedNiche.icon} size={32} color={COLORS.white} />
                  <Text style={styles.selectedNicheLabel}>{selectedNiche.label}</Text>
                </LinearGradient>
              )}

              <View style={styles.disclaimerCard}>
                <View style={styles.disclaimerIconRow}>
                  <View style={styles.disclaimerIconCircle}>
                    <Ionicons name="shield-checkmark" size={28} color={COLORS.primary} />
                  </View>
                </View>
                <Text style={styles.disclaimerTitle}>Meta Advertising Policy</Text>
                <Text style={styles.disclaimerBody}>
                  By proceeding, you confirm that your ad content complies with Meta's advertising policies. This includes:
                </Text>
                {[
                  '✓ No misleading or false claims about your product or service',
                  '✓ Content does not discriminate against any protected characteristic',
                  '✓ Ads targeting financial products comply with local regulations',
                  '✓ Healthcare and pharmaceutical ads have prior approval',
                  '✓ Content is suitable for all ages unless restricted targeting is applied',
                ].map((item, i) => (
                  <Text key={i} style={styles.disclaimerPoint}>{item}</Text>
                ))}
                <Text style={styles.disclaimerFooter}>
                  Violations may result in campaign rejection or account suspension by Meta.
                </Text>
              </View>

              <View style={styles.disclaimerBtns}>
                <TouchableOpacity onPress={handleBack} style={styles.btnSecondary} activeOpacity={0.8}>
                  <Text style={styles.btnSecondaryText}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDisclaimerAgree} activeOpacity={0.85} style={{flex: 1}}>
                  <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.btnPrimary} start={{x:0,y:0}} end={{x:1,y:0}}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
                    <Text style={styles.btnPrimaryText}>I Agree & Continue</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{height: 40}} />
            </ScrollView>
          </>
        )}

        {/* ── Step 2: Plan Picker ── */}
        {step === 2 && (
          <>
            <StepHeader title="Choose a Plan" onBack={handleBack} step={3} total={4} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionSub}>Select the plan that fits your marketing goals</Text>
              {MOCK_AD_PLANS.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan?.id === plan.id}
                  onSelect={handlePlanSelect}
                />
              ))}
              <TouchableOpacity
                onPress={handlePlanNext}
                disabled={!selectedPlan}
                activeOpacity={0.85}
                style={{marginTop: 8}}>
                <LinearGradient
                  colors={selectedPlan ? [COLORS.primary, COLORS.primaryDark] : [COLORS.gray20, COLORS.gray40]}
                  style={styles.btnPrimary}
                  start={{x:0,y:0}} end={{x:1,y:0}}>
                  <Text style={styles.btnPrimaryText}>Next →</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={{height: 40}} />
            </ScrollView>
          </>
        )}

        {/* ── Step 3: Ad Type Picker ── */}
        {step === 3 && (
          <>
            <StepHeader title="Select Ad Type" onBack={handleBack} step={4} total={4} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionSub}>Choose how you want to reach your customers</Text>
              {selectedPlan && (
                <View style={styles.selectedPlanSummary}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={styles.selectedPlanText}>
                    Plan: <Text style={{fontFamily: FONTS.semiBold, color: COLORS.primary}}>{selectedPlan.name}</Text>
                    {' '}· ₹{selectedPlan.price.toLocaleString('en-IN')}
                  </Text>
                </View>
              )}
              {AD_TYPES.map(type => (
                <AdTypeCard key={type.id} type={type} onSelect={handleAdTypeSelect} />
              ))}
              <View style={{height: 40}} />
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 14, paddingHorizontal: 16,
    ...SHADOWS.sm,
  },
  headerTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.primary},
  closeBtn: {width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.pageBg, justifyContent: 'center', alignItems: 'center'},
  stepHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 14, paddingHorizontal: 16,
    ...SHADOWS.sm,
  },
  backBtn: {width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.pageBg, justifyContent: 'center', alignItems: 'center'},
  stepTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.primary},
  stepCount: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted, marginTop: 2},
  scrollContent: {padding: 16},
  sectionSub: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, marginBottom: 18, lineHeight: 22},
  nicheGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  nicheCardWrap: {width: '47%'},
  nicheCard: {borderRadius: SIZES.radiusMd, padding: 20, alignItems: 'center', gap: 10, ...SHADOWS.sm},
  nicheIconCircle: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center'},
  nicheLabel: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.white, textAlign: 'center'},
  selectedNicheBanner: {borderRadius: SIZES.radiusMd, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, ...SHADOWS.sm},
  selectedNicheLabel: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.white},
  disclaimerCard: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 20, ...SHADOWS.sm, marginBottom: 16},
  disclaimerIconRow: {alignItems: 'center', marginBottom: 14},
  disclaimerIconCircle: {width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center'},
  disclaimerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 10, textAlign: 'center'},
  disclaimerBody: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 14},
  disclaimerPoint: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textSecondary, lineHeight: 24, paddingLeft: 4},
  disclaimerFooter: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.warning, marginTop: 14, lineHeight: 20, fontStyle: 'italic'},
  disclaimerBtns: {flexDirection: 'row', gap: 12},
  btnSecondary: {paddingVertical: 15, paddingHorizontal: 20, borderRadius: SIZES.radiusFull, borderWidth: 1.5, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'},
  btnSecondaryText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary},
  btnPrimary: {borderRadius: SIZES.radiusFull, paddingVertical: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8},
  btnPrimaryText: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.white},
  planCard: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, marginBottom: 14, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent', ...SHADOWS.sm},
  planCardSelected: {borderColor: COLORS.primary, ...SHADOWS.md},
  planGradHeader: {padding: 16},
  planHeaderRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6},
  planName: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.white},
  durationBadge: {backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: SIZES.radiusFull, paddingHorizontal: 10, paddingVertical: 3},
  durationText: {fontFamily: FONTS.medium, fontSize: SIZES.caption, color: COLORS.white},
  planPrice: {fontFamily: FONTS.bold, fontSize: SIZES.h2, color: COLORS.white, marginBottom: 2},
  planKpi: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: 'rgba(255,255,255,0.85)'},
  planFooter: {padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  planReach: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textSecondary, flex: 1},
  selectedBadge: {flexDirection: 'row', alignItems: 'center', gap: 4},
  selectedText: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.primary},
  selectedPlanSummary: {flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.successBg, borderRadius: SIZES.radiusSm, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.success + '33'},
  selectedPlanText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary},
  adTypeCard: {flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, marginBottom: 12, ...SHADOWS.sm},
  adTypeGrad: {width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center'},
  adTypeLabel: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 3},
  adTypeDesc: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, lineHeight: 18},
});
