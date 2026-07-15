// ============================================================
// MarketingKart.ai — Connect WhatsApp Modal (Bottom Sheet)
// ============================================================
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  ToastAndroid,
  Platform,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;

function showToast(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('', msg);
  }
}

// ─── Progress Bar ─────────────────────────────────────────────
function ProgressBar({step, total = 3}) {
  return (
    <View style={pbStyles.wrap}>
      {Array.from({length: total}).map((_, i) => (
        <View
          key={i}
          style={[
            pbStyles.segment,
            {backgroundColor: i <= step ? COLORS.metaBlue : COLORS.gray20},
            i < total - 1 && {marginRight: 6},
          ]}
        />
      ))}
    </View>
  );
}
const pbStyles = StyleSheet.create({
  wrap: {flexDirection: 'row', paddingHorizontal: 20, marginBottom: 6},
  segment: {flex: 1, height: 4, borderRadius: 2},
});

// ─── Step Labels ─────────────────────────────────────────────
function StepLabels({step}) {
  const labels = ['Welcome', 'Business', 'Number'];
  return (
    <View style={slStyles.wrap}>
      {labels.map((l, i) => (
        <Text
          key={l}
          style={[
            slStyles.label,
            i === step
              ? {color: COLORS.metaBlue, fontFamily: FONTS.semiBold}
              : i < step
              ? {color: COLORS.success, fontFamily: FONTS.medium}
              : {color: COLORS.textInactive, fontFamily: FONTS.regular},
          ]}>
          {i < step ? '✓ ' : `${i + 1}. `}{l}
        </Text>
      ))}
    </View>
  );
}
const slStyles = StyleSheet.create({
  wrap: {flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginBottom: 20},
  label: {fontSize: 12, letterSpacing: 0.3},
});

// ─── Feature Card ─────────────────────────────────────────────
function FeatureCard({icon, title, desc, gradientColors}) {
  return (
    <View style={fcStyles.card}>
      <LinearGradient colors={gradientColors} style={fcStyles.iconBox} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
        <Icon name={icon} size={20} color="#fff" />
      </LinearGradient>
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={fcStyles.title}>{title}</Text>
        <Text style={fcStyles.desc}>{desc}</Text>
      </View>
    </View>
  );
}
const fcStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusMd,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTitle, marginBottom: 2},
  desc: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted},
});

// ─── Input Field ─────────────────────────────────────────────
function InputField({label, placeholder, value, onChangeText, keyboardType, multiline, required}) {
  return (
    <View style={ifStyles.wrap}>
      <Text style={ifStyles.label}>
        {label}
        {required && <Text style={{color: COLORS.error}}> *</Text>}
      </Text>
      <TextInput
        style={[ifStyles.input, multiline && {height: 80, textAlignVertical: 'top'}]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textInactive}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        autoCapitalize="none"
      />
    </View>
  );
}
const ifStyles = StyleSheet.create({
  wrap: {marginBottom: 14},
  label: {fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary, marginBottom: 6},
  input: {
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: 'rgba(63,81,181,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textBody,
  },
});

// ─── Step 0: Welcome ─────────────────────────────────────────
function StepWelcome({onNext}) {
  const [showManual, setShowManual] = useState(false);
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [accessToken, setAccessToken] = useState('');

  function handleMetaOAuth() {
    showToast('Opening Meta OAuth...');
  }

  function handleFacebook() {
    showToast('Opening Facebook Login...');
  }

  function handleConnectManually() {
    if (!phoneNumberId.trim() || !wabaId.trim() || !accessToken.trim()) {
      showToast('Please fill in all manual configuration fields');
      return;
    }
    onNext();
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Illustration */}
      <View style={s0.illustrationRow}>
        <View style={[s0.circle, {backgroundColor: COLORS.metaBlue}]}>
          <Icon name="logo-facebook" size={28} color="#fff" />
        </View>
        <View style={s0.arrowRow}>
          <Icon name="arrow-forward" size={18} color={COLORS.textMuted} />
          <Icon name="arrow-back" size={18} color={COLORS.textMuted} />
        </View>
        <View style={[s0.circle, {backgroundColor: COLORS.waGreen}]}>
          <Icon name="logo-whatsapp" size={28} color="#fff" />
        </View>
      </View>

      <Text style={s0.title}>Seamlessly Connect Your Account</Text>
      <Text style={s0.subtitle}>
        Link your Meta WhatsApp Business account to start sending bulk campaigns, template messages, and manage real-time chats.
      </Text>

      {/* Feature Cards */}
      <FeatureCard
        icon="paper-plane"
        title="Send Bulk Campaigns"
        desc="Reach thousands of customers instantly"
        gradientColors={[COLORS.primary, COLORS.primaryDark]}
      />
      <FeatureCard
        icon="document-text"
        title="Template Messages"
        desc="Pre-approved Meta templates for promos"
        gradientColors={[COLORS.waGreen, COLORS.waGreenDark]}
      />
      <FeatureCard
        icon="chatbubble-ellipses"
        title="Real-time Chat"
        desc="2-way WhatsApp CRM inbox"
        gradientColors={['#8B5CF6', '#6D28D9']}
      />

      {/* Primary CTA */}
      <TouchableOpacity style={s0.metaBtn} onPress={handleMetaOAuth} activeOpacity={0.85}>
        <LinearGradient
          colors={[COLORS.waGreen, COLORS.waGreenDark]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={s0.metaBtnGradient}>
          <Icon name="logo-whatsapp" size={20} color="#fff" style={{marginRight: 8}} />
          <Text style={s0.metaBtnText}>Connect via Meta (Recommended)</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Facebook CTA */}
      <TouchableOpacity style={s0.fbBtn} onPress={handleFacebook} activeOpacity={0.85}>
        <Icon name="logo-facebook" size={18} color={COLORS.metaBlue} style={{marginRight: 8}} />
        <Text style={s0.fbBtnText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={s0.dividerRow}>
        <View style={s0.dividerLine} />
        <Text style={s0.dividerText}>OR</Text>
        <View style={s0.dividerLine} />
      </View>

      {/* Manual Config Collapse */}
      <TouchableOpacity
        style={s0.manualToggle}
        onPress={() => setShowManual(v => !v)}
        activeOpacity={0.8}>
        <Icon
          name={showManual ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={COLORS.primary}
          style={{marginRight: 6}}
        />
        <Text style={s0.manualToggleText}>Use Manual Configuration</Text>
      </TouchableOpacity>

      {showManual && (
        <View style={s0.manualBox}>
          <InputField
            label="Phone Number ID"
            placeholder="e.g. 1234567890"
            value={phoneNumberId}
            onChangeText={setPhoneNumberId}
            keyboardType="numeric"
            required
          />
          <InputField
            label="WABA ID"
            placeholder="e.g. 9876543210"
            value={wabaId}
            onChangeText={setWabaId}
            keyboardType="numeric"
            required
          />
          <InputField
            label="System User Access Token"
            placeholder="Paste your long-lived access token..."
            value={accessToken}
            onChangeText={setAccessToken}
            multiline
            required
          />
          <TouchableOpacity
            style={s0.manualConnectBtn}
            onPress={handleConnectManually}
            activeOpacity={0.85}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={s0.manualConnectGradient}>
              <Icon name="link" size={16} color="#fff" style={{marginRight: 8}} />
              <Text style={s0.manualConnectText}>Connect Manually</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <View style={{height: 30}} />
    </ScrollView>
  );
}
const s0 = StyleSheet.create({
  illustrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  arrowRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 14,
    gap: 4,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.textTitle,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  metaBtn: {borderRadius: SIZES.radiusMd, overflow: 'hidden', marginBottom: 10},
  metaBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  metaBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},
  fbBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: SIZES.radiusMd,
    borderWidth: 2,
    borderColor: COLORS.metaBlue,
    backgroundColor: COLORS.metaBlueLight,
    marginBottom: 16,
  },
  fbBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.metaBlue},
  dividerRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  dividerLine: {flex: 1, height: 1, backgroundColor: COLORS.gray20},
  dividerText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.textMuted,
    marginHorizontal: 12,
  },
  manualToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 4,
  },
  manualToggleText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.primary,
  },
  manualBox: {
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.primary + '22',
    marginBottom: 4,
  },
  manualConnectBtn: {borderRadius: SIZES.radiusMd, overflow: 'hidden', marginTop: 4},
  manualConnectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  manualConnectText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},
});

// ─── Step 1: Business ─────────────────────────────────────────
const CATEGORIES = [
  'Marketing', 'Retail', 'E-commerce', 'Education', 'Healthcare',
  'Finance', 'Real Estate', 'Food & Beverage', 'Technology', 'Other',
];

function StepBusiness({onNext, onBack}) {
  const [bizName, setBizName] = useState('');
  const [category, setCategory] = useState('');
  const [website, setWebsite] = useState('');
  const [showCatPicker, setShowCatPicker] = useState(false);

  function handleNext() {
    if (!bizName.trim()) {
      showToast('Please enter your Business Name');
      return;
    }
    if (!category) {
      showToast('Please select a Business Category');
      return;
    }
    onNext();
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Success Header */}
      <View style={s1.successHeader}>
        <View style={s1.checkCircle}>
          <Icon name="checkmark" size={22} color="#fff" />
        </View>
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={s1.successTitle}>Meta Account Connected</Text>
          <Text style={s1.successSub}>Now let's set up your business profile</Text>
        </View>
      </View>

      <InputField
        label="Business Name"
        placeholder="e.g. MarketingKart Pvt. Ltd."
        value={bizName}
        onChangeText={setBizName}
        required
      />

      {/* Category Dropdown */}
      <View style={ifStyles.wrap}>
        <Text style={ifStyles.label}>
          Category<Text style={{color: COLORS.error}}> *</Text>
        </Text>
        <TouchableOpacity
          style={[ifStyles.input, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}
          onPress={() => setShowCatPicker(v => !v)}
          activeOpacity={0.8}>
          <Text style={{fontFamily: FONTS.regular, fontSize: SIZES.body, color: category ? COLORS.textBody : COLORS.textInactive}}>
            {category || 'Select category...'}
          </Text>
          <Icon name={showCatPicker ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
        {showCatPicker && (
          <View style={s1.catDropdown}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[s1.catItem, category === cat && {backgroundColor: COLORS.primary + '15'}]}
                onPress={() => {setCategory(cat); setShowCatPicker(false);}}>
                <Text style={[s1.catItemText, category === cat && {color: COLORS.primary, fontFamily: FONTS.semiBold}]}>
                  {cat}
                </Text>
                {category === cat && <Icon name="checkmark" size={14} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Country (fixed India) */}
      <View style={ifStyles.wrap}>
        <Text style={ifStyles.label}>Country</Text>
        <View style={[ifStyles.input, {flexDirection: 'row', alignItems: 'center'}]}>
          <Text style={{fontSize: 18, marginRight: 8}}>🇮🇳</Text>
          <Text style={{fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody}}>India</Text>
          <Icon name="lock-closed" size={13} color={COLORS.textInactive} style={{marginLeft: 'auto'}} />
        </View>
      </View>

      <InputField
        label="Website (optional)"
        placeholder="https://yourbusiness.com"
        value={website}
        onChangeText={setWebsite}
        keyboardType="url"
      />

      {/* Time Zone (fixed) */}
      <View style={ifStyles.wrap}>
        <Text style={ifStyles.label}>Time Zone</Text>
        <View style={[ifStyles.input, {flexDirection: 'row', alignItems: 'center'}]}>
          <Icon name="time-outline" size={16} color={COLORS.primary} style={{marginRight: 8}} />
          <Text style={{fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody}}>
            Asia/Kolkata (IST +05:30)
          </Text>
        </View>
      </View>

      {/* Nav buttons */}
      <View style={s1.navRow}>
        <TouchableOpacity style={s1.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Icon name="arrow-back" size={16} color={COLORS.textMuted} style={{marginRight: 6}} />
          <Text style={s1.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s1.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={s1.nextBtnGradient}>
            <Text style={s1.nextBtnText}>Next</Text>
            <Icon name="arrow-forward" size={16} color="#fff" style={{marginLeft: 6}} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={{height: 30}} />
    </ScrollView>
  );
}
const s1 = StyleSheet.create({
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.waGreenSend + '33',
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.waGreenSend,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 2},
  successSub: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted},
  catDropdown: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.primary + '33',
    marginTop: 4,
    ...SHADOWS.md,
    maxHeight: 200,
    overflow: 'hidden',
  },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  catItemText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody},
  navRow: {flexDirection: 'row', gap: 12, marginTop: 8},
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: COLORS.gray20,
    backgroundColor: COLORS.white,
  },
  backBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textMuted},
  nextBtn: {flex: 2, borderRadius: SIZES.radiusMd, overflow: 'hidden'},
  nextBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  nextBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},
});

// ─── Step 2: Number ───────────────────────────────────────────
function StepNumber({onBack, onClose}) {
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verifyMethod, setVerifyMethod] = useState('sms'); // 'sms' | 'call'

  function handleConnect() {
    if (!phone.trim()) {
      showToast('Please enter your WhatsApp Business phone number');
      return;
    }
    if (!displayName.trim()) {
      showToast('Please enter a Display Name');
      return;
    }
    showToast('Connecting via Facebook...');
    setTimeout(() => onClose(), 1200);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Business info summary */}
      <View style={s2.summaryCard}>
        <Icon name="checkmark-circle" size={20} color={COLORS.waGreenSend} style={{marginRight: 8}} />
        <Text style={s2.summaryText}>Business information added successfully</Text>
      </View>

      {/* Add number radio */}
      <View style={s2.radioCard}>
        <TouchableOpacity style={s2.radioRow} activeOpacity={0.8}>
          <View style={s2.radioOuter}>
            <View style={s2.radioInner} />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={s2.radioTitle}>Add a new number</Text>
            <Text style={s2.radioDesc}>Register a fresh WhatsApp Business number</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Phone input */}
      <View style={ifStyles.wrap}>
        <Text style={ifStyles.label}>
          Phone Number<Text style={{color: COLORS.error}}> *</Text>
        </Text>
        <View style={s2.phoneRow}>
          <View style={s2.prefixBox}>
            <Text style={{fontSize: 16}}>🇮🇳</Text>
            <Text style={s2.prefixText}>+91</Text>
          </View>
          <TextInput
            style={s2.phoneInput}
            placeholder="98765 43210"
            placeholderTextColor={COLORS.textInactive}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>

      <InputField
        label="Display Name"
        placeholder="e.g. MarketingKart Business"
        value={displayName}
        onChangeText={setDisplayName}
        required
      />

      {/* Verify method */}
      <View style={ifStyles.wrap}>
        <Text style={ifStyles.label}>Verify via</Text>
        <View style={s2.verifyRow}>
          <TouchableOpacity
            style={[s2.verifyOption, verifyMethod === 'sms' && s2.verifyOptionActive]}
            onPress={() => setVerifyMethod('sms')}
            activeOpacity={0.8}>
            <Icon
              name="chatbubble-outline"
              size={16}
              color={verifyMethod === 'sms' ? COLORS.primary : COLORS.textMuted}
              style={{marginRight: 6}}
            />
            <Text style={[s2.verifyOptionText, verifyMethod === 'sms' && {color: COLORS.primary, fontFamily: FONTS.semiBold}]}>
              SMS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s2.verifyOption, verifyMethod === 'call' && s2.verifyOptionActive]}
            onPress={() => setVerifyMethod('call')}
            activeOpacity={0.8}>
            <Icon
              name="call-outline"
              size={16}
              color={verifyMethod === 'call' ? COLORS.primary : COLORS.textMuted}
              style={{marginRight: 6}}
            />
            <Text style={[s2.verifyOptionText, verifyMethod === 'call' && {color: COLORS.primary, fontFamily: FONTS.semiBold}]}>
              Phone Call
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms note */}
      <Text style={s2.termsNote}>
        By connecting, you agree to Meta's{' '}
        <Text style={{color: COLORS.metaBlue, fontFamily: FONTS.semiBold}}>
          Business Policy
        </Text>{' '}
        and{' '}
        <Text style={{color: COLORS.metaBlue, fontFamily: FONTS.semiBold}}>
          WhatsApp Terms
        </Text>
        .
      </Text>

      {/* Nav buttons */}
      <View style={s2.navRow}>
        <TouchableOpacity style={s1.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Icon name="arrow-back" size={16} color={COLORS.textMuted} style={{marginRight: 6}} />
          <Text style={s1.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s2.connectBtn} onPress={handleConnect} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.metaBlue, COLORS.metaBlueDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={s2.connectBtnGradient}>
            <Icon name="logo-facebook" size={16} color="#fff" style={{marginRight: 8}} />
            <Text style={s2.connectBtnText}>Connect via Facebook</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={{height: 30}} />
    </ScrollView>
  );
}
const s2 = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderRadius: SIZES.radiusMd,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.waGreenSend + '33',
  },
  summaryText: {fontFamily: FONTS.medium, fontSize: 13, color: COLORS.waGreenDark},
  radioCard: {
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary + '44',
  },
  radioRow: {flexDirection: 'row', alignItems: 'center'},
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 2},
  radioDesc: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted},
  phoneRow: {
    flexDirection: 'row',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: 'rgba(63,81,181,0.2)',
    overflow: 'hidden',
    backgroundColor: COLORS.pageBg,
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1.5,
    borderRightColor: 'rgba(63,81,181,0.2)',
    gap: 4,
  },
  prefixText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textBody},
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textBody,
  },
  verifyRow: {flexDirection: 'row', gap: 10},
  verifyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: COLORS.gray20,
    backgroundColor: COLORS.white,
  },
  verifyOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '0D',
  },
  verifyOptionText: {fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textMuted},
  termsNote: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginVertical: 14,
    lineHeight: 18,
  },
  navRow: {flexDirection: 'row', gap: 12, marginTop: 4},
  connectBtn: {flex: 2, borderRadius: SIZES.radiusMd, overflow: 'hidden'},
  connectBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  connectBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},
});

// ─── Main Modal ───────────────────────────────────────────────
export default function ConnectWhatsAppModal({visible, onClose}) {
  const [step, setStep] = useState(0);

  function handleClose() {
    setStep(0);
    onClose();
  }

  function handleNext() {
    setStep(s => Math.min(s + 1, 2));
  }

  function handleBack() {
    setStep(s => Math.max(s - 1, 0));
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent>
      <View style={modalStyles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={modalStyles.sheetWrap}>
          <View style={[modalStyles.sheet, {height: SHEET_HEIGHT}]}>
            {/* Drag handle */}
            <View style={modalStyles.dragHandle} />

            {/* Header row */}
            <View style={modalStyles.headerRow}>
              <View style={modalStyles.fbBranding}>
                <View style={modalStyles.fbCircle}>
                  <Icon name="logo-facebook" size={16} color="#fff" />
                </View>
                <Text style={modalStyles.headerTitle}>Facebook Login for Business</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={modalStyles.closeBtn} activeOpacity={0.7}>
                <Icon name="close" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Progress */}
            <ProgressBar step={step} total={3} />
            <StepLabels step={step} />

            {/* Step content */}
            <View style={modalStyles.stepContent}>
              {step === 0 && <StepWelcome onNext={handleNext} />}
              {step === 1 && <StepBusiness onNext={handleNext} onBack={handleBack} />}
              {step === 2 && <StepNumber onBack={handleBack} onClose={handleClose} />}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    ...SHADOWS.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray20,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  fbBranding: {flexDirection: 'row', alignItems: 'center'},
  fbCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.metaBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.pageBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
