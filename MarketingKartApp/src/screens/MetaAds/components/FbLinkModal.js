// ============================================================
// MarketingKart.ai — FbLinkModal (Facebook Page Connector)
// ============================================================
import React, {useState} from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ActivityIndicator, Platform, Pressable,
  ToastAndroid, Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_FB_PAGES} from '../../../utils/mockData';

// ─── Helpers ───────────────────────────────────────────────
const showToast = msg => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('', msg);
  }
};

// ─── Facebook "f" Logo ─────────────────────────────────────
function FBLogo({size = 22, color = COLORS.white}) {
  return (
    <View style={[styles.fbLogoBox, {width: size + 8, height: size + 8, borderRadius: (size + 8) / 2}]}>
      <Text style={[styles.fbLogoText, {fontSize: size, color}]}>f</Text>
    </View>
  );
}

// ─── Page Avatar ───────────────────────────────────────────
function PageAvatar({name}) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <View style={styles.pageAvatar}>
      <Text style={styles.pageAvatarText}>{initials}</Text>
    </View>
  );
}

// ─── Step 1: Fetching ──────────────────────────────────────
function StepFetching() {
  return (
    <View style={styles.stepCenter}>
      <ActivityIndicator size="large" color={COLORS.metaBlue} />
      <Text style={styles.fetchingTitle}>Connecting to Facebook</Text>
      <Text style={styles.fetchingSubtitle}>Fetching your Facebook pages...</Text>
    </View>
  );
}

// ─── Step 2: Page Picker ───────────────────────────────────
function StepPagePicker({selectedPage, onSelect, onLink, linking}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.pickerTitle}>Select a Facebook Page</Text>
      <Text style={styles.pickerSubtitle}>Choose the page to link with MarketingKart.ai</Text>

      <View style={styles.pageList}>
        {MOCK_FB_PAGES.map(page => (
          <TouchableOpacity
            key={page.id}
            style={[styles.pageRow, selectedPage === page.id && styles.pageRowSelected]}
            onPress={() => onSelect(page.id)}
            activeOpacity={0.8}>
            <PageAvatar name={page.name} />
            <View style={styles.pageInfo}>
              <Text style={styles.pageName}>{page.name}</Text>
              <Text style={styles.pageCategory}>{page.category} · {page.followers} followers</Text>
            </View>
            <View style={[styles.pageRadio, selectedPage === page.id && styles.pageRadioSelected]}>
              {selectedPage === page.id && <View style={styles.pageRadioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.linkBtn, (!selectedPage || linking) && styles.linkBtnDisabled]}
        onPress={onLink}
        disabled={!selectedPage || linking}
        activeOpacity={0.85}>
        {linking ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.white} />
            <Text style={styles.linkBtnText}>Link Selected Page</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Modal ────────────────────────────────────────────
export default function FbLinkModal({visible, onClose, onSuccess}) {
  const [step, setStep] = useState(0); // 0=idle, 1=fetching, 2=picker
  const [selectedPage, setSelectedPage] = useState(null);
  const [linking, setLinking] = useState(false);

  const handleConnect = () => {
    setStep(1);
    setSelectedPage(null);
    // Simulate fetch delay
    setTimeout(() => setStep(2), 2000);
  };

  const handleLink = () => {
    if (!selectedPage) return;
    setLinking(true);
    setTimeout(() => {
      setLinking(false);
      const page = MOCK_FB_PAGES.find(p => p.id === selectedPage);
      showToast(`✓ "${page?.name}" linked successfully!`);
      // Reset state
      setStep(0);
      setSelectedPage(null);
      onSuccess && onSuccess(page);
      onClose && onClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep(0);
    setSelectedPage(null);
    setLinking(false);
    onClose && onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={step === 0 ? handleClose : undefined} />

      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* FB Brand Header */}
        <View style={styles.fbHeader}>
          <View style={styles.fbHeaderInner}>
            <View style={styles.fbIconWrap}>
              <Ionicons name="logo-facebook" size={36} color={COLORS.white} />
            </View>
            <View style={{flex: 1, marginLeft: 14}}>
              <Text style={styles.fbHeaderTitle}>Connect Your Facebook Page</Text>
              <Text style={styles.fbHeaderSubtitle}>Required to create and manage ads</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {step === 0 && (
            // Idle — Connect CTA
            <View style={styles.idleContent}>
              <View style={styles.idleIllustration}>
                <View style={styles.idleIconBg}>
                  <Ionicons name="logo-facebook" size={52} color={COLORS.metaBlue} />
                </View>
                <View style={styles.idleCheckBadge}>
                  <Ionicons name="link-outline" size={16} color={COLORS.white} />
                </View>
              </View>

              <Text style={styles.idleTitle}>Link Your Facebook Page</Text>
              <Text style={styles.idleDesc}>
                Connect your Facebook Page to start creating high-converting
                ads directly from MarketingKart.ai — no switching apps needed.
              </Text>

              <View style={styles.benefitList}>
                {[
                  {icon: 'megaphone-outline', text: 'Create Lead & Traffic ads'},
                  {icon: 'bar-chart-outline', text: 'Track real-time performance'},
                  {icon: 'people-outline', text: 'Reach your ideal audience'},
                ].map(b => (
                  <View key={b.text} style={styles.benefitRow}>
                    <View style={styles.benefitIcon}>
                      <Ionicons name={b.icon} size={15} color={COLORS.metaBlue} />
                    </View>
                    <Text style={styles.benefitText}>{b.text}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.connectBtn} onPress={handleConnect} activeOpacity={0.85}>
                <Ionicons name="logo-facebook" size={20} color={COLORS.white} style={{marginRight: 10}} />
                <Text style={styles.connectBtnText}>Connect with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={{marginTop: 14}}>
                <Text style={styles.cancelText}>Maybe later</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 1 && <StepFetching />}

          {step === 2 && (
            <StepPagePicker
              selectedPage={selectedPage}
              onSelect={setSelectedPage}
              onLink={handleLink}
              linking={linking}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.55)'},

  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    overflow: 'hidden',
  },

  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.gray20, alignSelf: 'center', marginTop: 10, marginBottom: 0,
  },

  // FB Header
  fbHeader: {
    backgroundColor: COLORS.metaBlue,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
  },
  fbHeaderInner: {flexDirection: 'row', alignItems: 'center'},
  fbIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
  },
  fbHeaderTitle: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.white, lineHeight: 22},
  fbHeaderSubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.8)', marginTop: 2},
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
  },

  // Body
  body: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24},

  // Idle
  idleContent: {alignItems: 'center'},
  idleIllustration: {position: 'relative', marginBottom: 20},
  idleIconBg: {
    width: 90, height: 90, borderRadius: 22,
    backgroundColor: COLORS.metaBlueLight, alignItems: 'center', justifyContent: 'center',
  },
  idleCheckBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.adActive, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.white,
  },
  idleTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 8, textAlign: 'center'},
  idleDesc: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 20},
  benefitList: {width: '100%', marginBottom: 24},
  benefitRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  benefitIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: COLORS.metaBlueLight, alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  benefitText: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textBody},

  // Connect Button
  connectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.metaBlue, borderRadius: SIZES.radiusFull,
    paddingVertical: 15, paddingHorizontal: 32, width: '100%', ...SHADOWS.md,
  },
  connectBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.white},
  cancelText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted},

  // Fetching Step
  stepCenter: {alignItems: 'center', paddingVertical: 40},
  fetchingTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginTop: 20, marginBottom: 6},
  fetchingSubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted},

  // Page Picker
  stepContent: {},
  pickerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 4},
  pickerSubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginBottom: 16},
  pageList: {gap: 10, marginBottom: 20},
  pageRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.gray20, borderRadius: SIZES.radiusMd,
    padding: 12, backgroundColor: COLORS.white,
  },
  pageRowSelected: {borderColor: COLORS.metaBlue, backgroundColor: COLORS.metaBlueLight},
  pageAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.metaBlue, alignItems: 'center', justifyContent: 'center',
  },
  pageAvatarText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.white},
  pageInfo: {flex: 1, marginLeft: 12},
  pageName: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle},
  pageCategory: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted, marginTop: 2},
  pageRadio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: COLORS.gray40, alignItems: 'center', justifyContent: 'center',
  },
  pageRadioSelected: {borderColor: COLORS.metaBlue},
  pageRadioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.metaBlue},

  // Link Button
  linkBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.metaBlue, borderRadius: SIZES.radiusFull,
    paddingVertical: 14, gap: 8, ...SHADOWS.md,
  },
  linkBtnDisabled: {backgroundColor: COLORS.gray40},
  linkBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.white},

  // FB Logo helper
  fbLogoBox: {backgroundColor: COLORS.metaBlue, alignItems: 'center', justifyContent: 'center'},
  fbLogoText: {fontFamily: FONTS.bold, color: COLORS.white},
});
