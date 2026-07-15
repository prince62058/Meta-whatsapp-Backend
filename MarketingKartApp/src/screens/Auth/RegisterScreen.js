import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import GradientButton from '../../components/common/GradientButton';

function showToast(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravityAndOffset(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 80);
  } else {
    Alert.alert('MarketingKart.ai', msg);
  }
}

export default function RegisterScreen({navigation}) {
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = key => val => setForm(f => ({...f, [key]: val}));
  const clearErr = key => setErrors(e => ({...e, [key]: ''}));

  const validate = () => {
    const errs = {};
    if (!form.businessName.trim()) errs.businessName = 'Business name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      errs.email = 'Enter a valid email';
    }
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit phone';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Minimum 6 characters';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    showToast('Account created! Please login to continue.');
    navigation.navigate('Login');
  };

  const fields = [
    {
      key: 'businessName',
      label: 'Business Name',
      icon: 'business-outline',
      placeholder: 'Rahul Digital Agency',
      keyboardType: 'default',
      autoCapitalize: 'words',
    },
    {
      key: 'email',
      label: 'Email Address',
      icon: 'mail-outline',
      placeholder: 'you@example.com',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      key: 'phone',
      label: 'Phone Number',
      icon: 'call-outline',
      placeholder: '9876543210',
      keyboardType: 'phone-pad',
      autoCapitalize: 'none',
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.header}>
            <View style={styles.mkIconWrap}>
              <LinearGradient
                colors={[COLORS.brandOrange, COLORS.brandOrangeLight]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.mkIcon}>
                <Text style={styles.mkIconText}>MK</Text>
              </LinearGradient>
            </View>
            <Text style={styles.logoText}>MarketingKart.ai</Text>
            <Text style={styles.tagline}>Grow your business smarter</Text>
          </LinearGradient>

          {/* ── Card ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSub}>Start your free journey today</Text>

            {/* Text fields */}
            {fields.map(f => (
              <View key={f.key} style={styles.fieldWrap}>
                <Text style={styles.label}>{f.label}</Text>
                <View style={[styles.inputRow, errors[f.key] ? styles.inputErr : null]}>
                  <Icon name={f.icon} size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={f.placeholder}
                    placeholderTextColor={COLORS.textInactive}
                    keyboardType={f.keyboardType}
                    autoCapitalize={f.autoCapitalize}
                    autoCorrect={false}
                    value={form[f.key]}
                    onChangeText={v => {set(f.key)(v); clearErr(f.key);}}
                  />
                </View>
                {!!errors[f.key] && <Text style={styles.errText}>{errors[f.key]}</Text>}
              </View>
            ))}

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password ? styles.inputErr : null]}>
                <Icon name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={COLORS.textInactive}
                  secureTextEntry={!showPass}
                  value={form.password}
                  onChangeText={v => {set('password')(v); clearErr('password');}}
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                  <Icon name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {!!errors.password && <Text style={styles.errText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputRow, errors.confirmPassword ? styles.inputErr : null]}>
                <Icon name="shield-checkmark-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor={COLORS.textInactive}
                  secureTextEntry={!showConfirm}
                  value={form.confirmPassword}
                  onChangeText={v => {set('confirmPassword')(v); clearErr('confirmPassword');}}
                />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                  <Icon name={showConfirm ? 'eye-outline' : 'eye-off-outline'} size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {!!errors.confirmPassword && <Text style={styles.errText}>{errors.confirmPassword}</Text>}
            </View>

            {/* CTA */}
            <GradientButton
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.ctaBtn}
            />

            {/* Terms */}
            <Text style={styles.termsText}>
              By registering you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> &{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Login link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.pageBg},
  flex: {flex: 1},
  scroll: {flexGrow: 1, paddingBottom: 40},

  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 48,
    alignItems: 'center',
  },
  mkIconWrap: {marginBottom: 14, ...SHADOWS.lg},
  mkIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mkIconText: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.white,
    letterSpacing: 1,
  },
  logoText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: SIZES.radius2xl,
    padding: 24,
    marginTop: -24,
    ...SHADOWS.lg,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.titleLg,
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  cardSub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    marginBottom: 24,
  },

  fieldWrap: {marginBottom: 16},
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  inputErr: {borderColor: COLORS.error},
  inputIcon: {marginRight: 8},
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textBody,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  eyeBtn: {padding: 4},
  errText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 2,
  },

  ctaBtn: {marginBottom: 16, marginTop: 8},

  termsText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },

  bottomRow: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  bottomText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted},
  linkText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary},
});
