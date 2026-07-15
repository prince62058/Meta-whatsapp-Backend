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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import GradientButton from '../../components/common/GradientButton';

const DEMO_EMAIL = 'demo@marketingkart.in';
const DEMO_PASS = 'demo123';

function showToast(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravityAndOffset(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 80);
  } else {
    Alert.alert('MarketingKart.ai', msg);
  }
}

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');

  const validate = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailErr('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailErr('Enter a valid email');
      valid = false;
    } else {
      setEmailErr('');
    }
    if (!password) {
      setPassErr('Password is required');
      valid = false;
    } else {
      setPassErr('');
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      if (
        email.trim().toLowerCase() === DEMO_EMAIL &&
        password === DEMO_PASS
      ) {
        await AsyncStorage.setItem('auth_token', 'demo_token');
        await AsyncStorage.setItem(
          'user_data',
          JSON.stringify({
            id: '1',
            name: 'Rahul Sharma',
            businessName: 'Rahul Digital Agency',
            email: 'rahul@example.com',
          }),
        );
        showToast('Welcome back, Rahul! 👋');
        navigation.replace('MainTabs');
      } else {
        showToast('Invalid credentials. Use demo@marketingkart.in / demo123');
      }
    } catch (e) {
      showToast('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            {/* MK Icon */}
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
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSub}>Sign in to your account</Text>

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputRow, emailErr ? styles.inputErr : null]}>
                <Icon name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.textInactive}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={t => {setEmail(t); setEmailErr('');}}
                />
              </View>
              {!!emailErr && <Text style={styles.errText}>{emailErr}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, passErr ? styles.inputErr : null]}>
                <Icon name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textInactive}
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={t => {setPassword(t); setPassErr('');}}
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                  <Icon
                    name={showPass ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {!!passErr && <Text style={styles.errText}>{passErr}</Text>}
            </View>

            {/* Forgot */}
            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => showToast('Reset link will be sent to your email.')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <GradientButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.loginBtn}
            />

            {/* Demo hint */}
            <View style={styles.demoBox}>
              <Icon name="information-circle-outline" size={16} color={COLORS.primary} />
              <Text style={styles.demoText}>
                {'  '}Demo: demo@marketingkart.in / demo123
              </Text>
            </View>

            {/* Register link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Register</Text>
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

  // Header
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

  // Card
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

  // Fields
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

  // Forgot
  forgotWrap: {alignSelf: 'flex-end', marginBottom: 24, marginTop: -4},
  forgotText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },

  // Button
  loginBtn: {marginBottom: 16},

  // Demo hint
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusMd,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  demoText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.primary,
    flexShrink: 1,
  },

  // Bottom
  bottomRow: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  bottomText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted},
  linkText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary},
});
