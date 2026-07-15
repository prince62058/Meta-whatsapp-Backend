// ============================================================
// MarketingKart.ai — Meta Ads Create Wizard — Step 2: Creative + Copy
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
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';
import {MOCK_INTERESTS} from '../../utils/mockData';

const AD_TYPES_WA = ['WhatsApp Ads', 'Call Ads'];
const AD_TYPES_APP = ['App Install Ads'];

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

function FormField({label, required, error, children}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={{color: COLORS.error}}> *</Text>}
      </Text>
      {children}
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

function MediaTypeSheet({visible, onClose, onSelect}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.sheetOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Select Media Type</Text>
          {[
            {type: 'image', icon: 'images', label: 'Images', sub: 'Upload up to 5 images (JPG, PNG)'},
            {type: 'video', icon: 'videocam', label: 'Video', sub: 'Upload 1 video (MP4, max 4GB)'},
          ].map(item => (
            <TouchableOpacity key={item.type} style={styles.sheetOption} onPress={() => {onSelect(item.type); onClose();}} activeOpacity={0.8}>
              <View style={[styles.sheetOptionIcon, {backgroundColor: COLORS.primary + '15'}]}>
                <Ionicons name={item.icon} size={22} color={COLORS.primary} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.sheetOptionLabel}>{item.label}</Text>
                <Text style={styles.sheetOptionSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function AIModal({visible, onClose, onGenerate}) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGenerate({
        campaignName: `${prompt.slice(0, 20)} Campaign`,
        headline: `Transform Your Business with ${prompt.slice(0, 15)}`,
        primaryText: `Discover the best ${prompt} solutions tailored for you. Limited offer available now! Don't miss out on this incredible opportunity to grow your business.`,
        caption: `Get started today – Special offer!`,
      });
      setPrompt('');
      onClose();
    }, 1800);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <TouchableOpacity style={styles.sheetOverlay} onPress={onClose} activeOpacity={1}>
          <View style={[styles.sheet, {paddingBottom: 28}]}>
            <View style={styles.sheetHandle} />
            <LinearGradient colors={[COLORS.primary, '#7C3AED']} style={styles.aiModalHeader} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
              <Ionicons name="sparkles" size={20} color={COLORS.white} />
              <Text style={styles.aiModalTitle}>Generate Content with AI</Text>
            </LinearGradient>
            <Text style={styles.aiModalSub}>Describe your product or service and let AI craft your ad copy</Text>
            <TextInput
              style={styles.aiPromptInput}
              placeholder="e.g. luxury apartments in Mumbai with lake view..."
              placeholderTextColor={COLORS.textInactive}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity onPress={handleGenerate} disabled={loading || !prompt.trim()} activeOpacity={0.85}>
              <LinearGradient
                colors={prompt.trim() ? [COLORS.primary, '#7C3AED'] : [COLORS.gray20, COLORS.gray40]}
                style={styles.aiGenerateBtn}
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
                {loading
                  ? <ActivityIndicator color={COLORS.white} />
                  : <>
                      <Ionicons name="sparkles" size={16} color={COLORS.white} />
                      <Text style={styles.aiGenerateBtnText}>Generate</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function InterestSelector({selected, onAdd, onRemove}) {
  const [query, setQuery] = useState('');
  const filtered = MOCK_INTERESTS.filter(
    i => i.label.toLowerCase().includes(query.toLowerCase()) && !selected.find(s => s.id === i.id),
  );
  return (
    <View>
      <View style={styles.searchInput}>
        <Ionicons name="search" size={16} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInputText}
          placeholder="Search interests..."
          placeholderTextColor={COLORS.textInactive}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {query.length > 0 && filtered.length > 0 && (
        <View style={styles.suggestionsBox}>
          {filtered.slice(0, 8).map(item => (
            <TouchableOpacity key={item.id} style={styles.suggestionItem} onPress={() => {onAdd(item); setQuery('');}} activeOpacity={0.7}>
              <Text style={styles.suggestionText}>{item.label}</Text>
              <Ionicons name="add-circle" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selected.length > 0 && (
        <View style={styles.chipsWrap}>
          {selected.map(item => (
            <View key={item.id} style={styles.chip}>
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

// ─── Main Screen ─────────────────────────────────────────────

export default function AdsPageSecond({navigation, route}) {
  const params = route?.params || {};
  const {adType = 'Lead Ads'} = params;

  const isWACall = AD_TYPES_WA.includes(adType);
  const isAppInstall = AD_TYPES_APP.includes(adType);

  const [mediaType, setMediaType] = useState('image');
  const [mockImages, setMockImages] = useState([]);
  const [showMediaSheet, setShowMediaSheet] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [campaignName, setCampaignName] = useState('');
  const [headline, setHeadline] = useState('');
  const [primaryText, setPrimaryText] = useState('');
  const [caption, setCaption] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [appId, setAppId] = useState('');
  const [platform, setPlatform] = useState('Android');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [interests, setInterests] = useState([]);

  const [errors, setErrors] = useState({});

  const handleMockUpload = useCallback((type) => {
    setMediaType(type);
    setUploading(true);
    setUploadProgress(0);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start(() => {
      setUploading(false);
      setUploadProgress(100);
      if (type === 'image') {
        setMockImages(prev => {
          if (prev.length >= 5) return prev;
          return [...prev, {id: Date.now(), color: `hsl(${Math.floor(Math.random() * 360)},60%,70%)`}];
        });
      } else {
        setMockImages([{id: Date.now(), color: '#6366f1', isVideo: true}]);
      }
    });
  }, [progressAnim]);

  const removeImage = useCallback(id => setMockImages(prev => prev.filter(img => img.id !== id)), []);

  const handleAIGenerate = useCallback(data => {
    setCampaignName(data.campaignName);
    setHeadline(data.headline.slice(0, 40));
    setPrimaryText(data.primaryText.slice(0, 125));
    setCaption(data.caption.slice(0, 50));
  }, []);

  const validate = () => {
    const e = {};
    if (!campaignName.trim()) e.campaignName = 'Campaign name is required';
    if (!headline.trim()) e.headline = 'Ad headline is required';
    if (!primaryText.trim()) e.primaryText = 'Primary text is required';
    if (!caption.trim()) e.caption = 'Ad caption is required';
    if (isWACall && (!waNumber.trim() || waNumber.length !== 10)) e.waNumber = 'Enter a valid 10-digit mobile number';
    if (isAppInstall && !appId.trim()) e.appId = 'App ID is required';
    if (interests.length === 0) e.interests = 'Select at least 1 interest';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canNext =
    campaignName.trim() &&
    headline.trim() &&
    primaryText.trim() &&
    caption.trim() &&
    interests.length > 0 &&
    (!isWACall || waNumber.length === 10) &&
    (!isAppInstall || appId.trim());

  const handleNext = () => {
    if (!validate()) return;
    navigation.navigate('AdsPageThird', {
      ...params,
      campaignName,
      headline,
      primaryText,
      caption,
      waNumber: isWACall ? waNumber : undefined,
      appId: isAppInstall ? appId : undefined,
      appPlatform: isAppInstall ? platform : undefined,
      destinationUrl,
      interests: interests.map(i => i.id),
      mediaType,
      mediaCount: mockImages.length,
    });
  };

  const progressWidth = progressAnim.interpolate({inputRange: [0, 1], outputRange: ['0%', '100%']});

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create an Ad</Text>
        <View style={{width: 38}} />
      </View>

      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <ProgressBar current={2} total={3} />

          {/* Media Upload */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Ad Media</Text>
            <Text style={styles.sectionSubtitle}>Upload images/video or use our custom templates</Text>
            <View style={styles.mediaCards}>
              <TouchableOpacity
                style={styles.mediaCard}
                onPress={() => setShowMediaSheet(true)}
                activeOpacity={0.8}>
                <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
                <Text style={styles.mediaCardLabel}>Upload Media</Text>
                <Text style={styles.mediaCardSub}>{mediaType === 'video' ? '1 video' : 'Up to 5 images'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.mediaCard, {borderColor: '#7C3AED'}]}
                onPress={() => setShowMediaSheet(true)}
                activeOpacity={0.8}>
                <LinearGradient colors={[COLORS.primary, '#7C3AED']} style={styles.mediaCardGradIcon} start={{x:0,y:0}} end={{x:1,y:1}}>
                  <Ionicons name="sparkles" size={20} color={COLORS.white} />
                </LinearGradient>
                <Text style={[styles.mediaCardLabel, {color: '#7C3AED'}]}>AI Custom</Text>
                <Text style={styles.mediaCardSub}>MarketingKart.ai</Text>
              </TouchableOpacity>
            </View>

            {uploading && (
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, {width: progressWidth}]} />
                <Text style={styles.progressPercent}>Uploading...</Text>
              </View>
            )}

            {mockImages.length > 0 && (
              <View style={styles.thumbnailRow}>
                {mockImages.map(img => (
                  <View key={img.id} style={[styles.thumbnail, {backgroundColor: img.color}]}>
                    {img.isVideo && <Ionicons name="play-circle" size={24} color={COLORS.white} />}
                    <TouchableOpacity style={styles.thumbRemove} onPress={() => removeImage(img.id)}>
                      <Ionicons name="close-circle" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
                {!mockImages[0]?.isVideo && mockImages.length < 5 && (
                  <TouchableOpacity style={styles.thumbnailAdd} onPress={() => handleMockUpload('image')}>
                    <Ionicons name="add" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* AI Generate Button */}
          <TouchableOpacity onPress={() => setShowAIModal(true)} activeOpacity={0.85}>
            <LinearGradient colors={[COLORS.primary, '#7C3AED']} style={styles.aiBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Ionicons name="sparkles" size={18} color={COLORS.white} />
              <Text style={styles.aiBtnText}>✦ Generate content with AI</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Ad Copy</Text>

            <FormField label="Campaign Name" required error={errors.campaignName}>
              <TextInput
                style={[styles.input, errors.campaignName && styles.inputError]}
                placeholder="e.g. Summer Sale 2024"
                placeholderTextColor={COLORS.textInactive}
                value={campaignName}
                onChangeText={t => {setCampaignName(t); setErrors(e => ({...e, campaignName: null}));}}
              />
            </FormField>

            <FormField label={`Ad Headline (${headline.length}/40)`} required error={errors.headline}>
              <TextInput
                style={[styles.input, errors.headline && styles.inputError]}
                placeholder="Grab attention in 40 characters"
                placeholderTextColor={COLORS.textInactive}
                value={headline}
                onChangeText={t => {setHeadline(t.slice(0, 40)); setErrors(e => ({...e, headline: null}));}}
                maxLength={40}
              />
            </FormField>

            <FormField label={`Primary Text (${primaryText.length}/125)`} required error={errors.primaryText}>
              <TextInput
                style={[styles.input, styles.inputMulti, errors.primaryText && styles.inputError]}
                placeholder="Tell your story in 125 characters..."
                placeholderTextColor={COLORS.textInactive}
                value={primaryText}
                onChangeText={t => {setPrimaryText(t.slice(0, 125)); setErrors(e => ({...e, primaryText: null}));}}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={125}
              />
            </FormField>

            <FormField label={`Ad Caption (${caption.length}/50)`} required error={errors.caption}>
              <TextInput
                style={[styles.input, errors.caption && styles.inputError]}
                placeholder="Short tagline or CTA"
                placeholderTextColor={COLORS.textInactive}
                value={caption}
                onChangeText={t => {setCaption(t.slice(0, 50)); setErrors(e => ({...e, caption: null}));}}
                maxLength={50}
              />
            </FormField>

            {isWACall && (
              <FormField label="WhatsApp / Call Number" required error={errors.waNumber}>
                <View style={[styles.input, styles.inputRow, errors.waNumber && styles.inputError]}>
                  <Text style={styles.phonePrefix}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="10-digit mobile number"
                    placeholderTextColor={COLORS.textInactive}
                    keyboardType="phone-pad"
                    value={waNumber}
                    onChangeText={t => {setWaNumber(t.replace(/\D/g, '').slice(0, 10)); setErrors(e => ({...e, waNumber: null}));}}
                    maxLength={10}
                  />
                </View>
              </FormField>
            )}

            {isAppInstall && (
              <>
                <FormField label="App ID" required error={errors.appId}>
                  <TextInput
                    style={[styles.input, errors.appId && styles.inputError]}
                    placeholder="e.g. com.example.myapp"
                    placeholderTextColor={COLORS.textInactive}
                    value={appId}
                    onChangeText={t => {setAppId(t); setErrors(e => ({...e, appId: null}));}}
                  />
                </FormField>
                <FormField label="Platform">
                  <View style={styles.platformRow}>
                    {['Android', 'iOS'].map(p => (
                      <TouchableOpacity key={p} style={[styles.platformBtn, platform === p && styles.platformBtnActive]} onPress={() => setPlatform(p)} activeOpacity={0.8}>
                        <Ionicons name={p === 'Android' ? 'logo-android' : 'logo-apple'} size={18} color={platform === p ? COLORS.white : COLORS.primary} />
                        <Text style={[styles.platformBtnText, platform === p && {color: COLORS.white}]}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </FormField>
              </>
            )}

            {!isWACall && !isAppInstall && (
              <FormField label="Destination URL">
                <TextInput
                  style={styles.input}
                  placeholder="https://your-website.com"
                  placeholderTextColor={COLORS.textInactive}
                  value={destinationUrl}
                  onChangeText={setDestinationUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </FormField>
            )}
          </View>

          {/* Interests */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Target Interests</Text>
            <Text style={styles.sectionSubtitle}>Select at least 1 interest to target your audience</Text>
            {errors.interests && <Text style={styles.fieldError}>{errors.interests}</Text>}
            <InterestSelector
              selected={interests}
              onAdd={item => setInterests(prev => [...prev, item])}
              onRemove={id => setInterests(prev => prev.filter(i => i.id !== id))}
            />
          </View>

          <View style={{height: 100}} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity onPress={handleNext} disabled={!canNext} activeOpacity={0.85} style={{flex: 1}}>
          <LinearGradient
            colors={canNext ? [COLORS.primary, COLORS.primaryDark] : [COLORS.gray20, COLORS.gray40]}
            style={styles.nextBtn}
            start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={styles.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{marginLeft: 6}} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <MediaTypeSheet
        visible={showMediaSheet}
        onClose={() => setShowMediaSheet(false)}
        onSelect={type => handleMockUpload(type)}
      />
      <AIModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
      />
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
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.pageBg,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.primary},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16},
  progressContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 6},
  progressSegment: {flex: 1, height: 4, borderRadius: 2},
  progressLabel: {fontFamily: FONTS.medium, fontSize: SIZES.caption, color: COLORS.textMuted, marginLeft: 8, minWidth: 56, textAlign: 'right'},
  sectionCard: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, marginBottom: 14, ...SHADOWS.sm},
  sectionTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginBottom: 4},
  sectionSubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginBottom: 16},
  mediaCards: {flexDirection: 'row', gap: 12, marginBottom: 14},
  mediaCard: {
    flex: 1, borderWidth: 2, borderColor: COLORS.primary,
    borderStyle: 'dashed', borderRadius: SIZES.radiusMd,
    padding: 16, alignItems: 'center', gap: 8,
  },
  mediaCardGradIcon: {width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center'},
  mediaCardLabel: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.primary},
  mediaCardSub: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted, textAlign: 'center'},
  progressBar: {height: 8, backgroundColor: COLORS.pageBg, borderRadius: 4, overflow: 'hidden', marginBottom: 14, position: 'relative'},
  progressFill: {height: '100%', backgroundColor: COLORS.primary, borderRadius: 4},
  progressPercent: {position: 'absolute', right: 0, top: 10, fontSize: SIZES.caption, fontFamily: FONTS.medium, color: COLORS.textMuted},
  thumbnailRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  thumbnail: {
    width: 72, height: 72, borderRadius: SIZES.radiusSm,
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  thumbRemove: {position: 'absolute', top: -6, right: -6},
  thumbnailAdd: {
    width: 72, height: 72, borderRadius: SIZES.radiusSm,
    borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  aiBtn: {borderRadius: SIZES.radiusFull, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14},
  aiBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.white},
  fieldWrap: {marginBottom: 16},
  fieldLabel: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textSecondary, marginBottom: 8},
  fieldError: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.error, marginTop: 4},
  input: {
    borderWidth: 1.5, borderColor: COLORS.gray20,
    borderRadius: SIZES.radiusSm, paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textTitle,
    backgroundColor: COLORS.white,
  },
  inputError: {borderColor: COLORS.error},
  inputMulti: {minHeight: 90, paddingTop: 12},
  inputRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 0, paddingHorizontal: 0},
  phonePrefix: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textTitle, paddingHorizontal: 14, paddingVertical: 12, borderRightWidth: 1, borderColor: COLORS.gray20},
  phoneInput: {flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textTitle},
  platformRow: {flexDirection: 'row', gap: 10},
  platformBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: SIZES.radiusSm, borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.white},
  platformBtnActive: {backgroundColor: COLORS.primary},
  platformBtnText: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.primary},
  searchInput: {flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.gray20, borderRadius: SIZES.radiusSm, paddingHorizontal: 12, paddingVertical: 10, gap: 8, backgroundColor: COLORS.white, marginBottom: 10},
  searchInputText: {flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textTitle},
  suggestionsBox: {backgroundColor: COLORS.white, borderRadius: SIZES.radiusSm, borderWidth: 1, borderColor: COLORS.gray20, marginBottom: 10, ...SHADOWS.sm, overflow: 'hidden'},
  suggestionItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderColor: COLORS.pageBg},
  suggestionText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textTitle},
  chipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4},
  chip: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '15', borderRadius: SIZES.radiusFull, paddingHorizontal: 12, paddingVertical: 6, gap: 6, borderWidth: 1, borderColor: COLORS.primary + '33'},
  chipText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.primary},
  sheetOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end'},
  sheet: {backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20},
  sheetHandle: {width: 40, height: 4, backgroundColor: COLORS.gray20, borderRadius: 2, alignSelf: 'center', marginBottom: 16},
  sheetTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 16},
  sheetOption: {flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: COLORS.pageBg, gap: 14},
  sheetOptionIcon: {width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center'},
  sheetOptionLabel: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 2},
  sheetOptionSub: {fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.textMuted},
  aiModalHeader: {flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: SIZES.radiusSm, padding: 14, marginBottom: 12},
  aiModalTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.white},
  aiModalSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginBottom: 14, lineHeight: 20},
  aiPromptInput: {borderWidth: 1.5, borderColor: COLORS.gray20, borderRadius: SIZES.radiusSm, padding: 14, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textTitle, minHeight: 100, marginBottom: 16, textAlignVertical: 'top'},
  aiGenerateBtn: {borderRadius: SIZES.radiusFull, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8},
  aiGenerateBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.white},
  stickyBottom: {backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12, ...SHADOWS.lg, flexDirection: 'row'},
  nextBtn: {borderRadius: SIZES.radiusFull, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'},
  nextBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.white, letterSpacing: 0.3},
});
