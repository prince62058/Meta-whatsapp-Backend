// ============================================================
// TemplateCreateScreen.js — WhatsApp Template Builder
// ============================================================
import React, {useState, useMemo} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Modal, Alert, ActivityIndicator, Platform,
  ToastAndroid, KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {LANGUAGES} from '../../../utils/mockData';
import WhatsAppPreview from '../components/WhatsAppPreview';

const CATEGORIES = ['MARKETING', 'UTILITY', 'AUTHENTICATION'];
const HEADER_TYPES = ['NONE', 'TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'];
const BUTTON_TYPES = ['QUICK_REPLY', 'CALL', 'URL'];

function showToast(msg) {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert('', msg);
}

function SectionLabel({text, required}) {
  return (
    <Text style={styles.sectionLabel}>
      {text}{required && <Text style={{color: COLORS.error}}> *</Text>}
    </Text>
  );
}

// ── Language Picker Modal ────────────────────────────────
function LanguagePicker({visible, selected, onSelect, onClose}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
          </View>
          <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 24}}>
            {LANGUAGES.map(l => (
              <TouchableOpacity key={l.code} style={styles.langOption} onPress={() => { onSelect(l); onClose(); }} activeOpacity={0.8}>
                <Text style={[styles.langOptionText, selected?.code === l.code && {color: COLORS.primary, fontFamily: FONTS.semiBold}]}>{l.label}</Text>
                {selected?.code === l.code && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── AI Generate Modal ─────────────────────────────────────
function AIModal({visible, onClose, onGenerate}) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) { showToast('Enter a prompt first'); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      onGenerate({
        name: 'ai_generated_promo',
        category: 'MARKETING',
        language: {code: 'en_US', label: 'English (US)'},
        headerType: 'TEXT',
        headerText: '🎉 Exclusive Offer Just for You!',
        body: 'Hi {{1}}, we have a special deal tailored just for you! Get {{2}}% off on your next purchase. Valid till {{3}}. Don\'t miss out — shop now and save big!',
        footer: 'Reply STOP to opt out',
        buttons: [
          {type: 'URL', text: 'Shop Now', url: 'https://marketingkart.ai'},
          {type: 'QUICK_REPLY', text: 'Claim Offer'},
        ],
      });
      onClose();
      setPrompt('');
    }, 2200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, {maxHeight: '60%'}]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.aiIcon}><Text style={{fontSize: 18}}>✨</Text></View>
              <Text style={styles.sheetTitle}>AI Template Generator</Text>
            </View>
            <TouchableOpacity onPress={() => { onClose(); setPrompt(''); }}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: 20, flex: 1}}>
            <Text style={styles.aiSubtitle}>Describe the template you need and AI will generate it for you.</Text>
            <TextInput
              style={styles.aiPromptInput}
              placeholder="e.g. A festival discount offer for e-commerce customers with a CTA button…"
              placeholderTextColor={COLORS.textInactive}
              multiline
              numberOfLines={5}
              value={prompt}
              onChangeText={setPrompt}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.aiGenerateBtn, generating && {opacity: 0.75}]}
              onPress={handleGenerate} disabled={generating} activeOpacity={0.85}>
              {generating
                ? <ActivityIndicator color="#fff" size="small" style={{marginRight: 8}} />
                : <Text style={{fontSize: 16, marginRight: 8}}>✨</Text>}
              <Text style={styles.aiGenerateBtnText}>{generating ? 'Generating…' : 'Generate Template'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Button Row Component ──────────────────────────────────
function ButtonRow({btn, index, onChange, onRemove}) {
  return (
    <View style={styles.btnCard}>
      <View style={styles.btnCardHeader}>
        <Text style={styles.btnCardTitle}>Button {index + 1}</Text>
        <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeBtnIcon}>
          <Ionicons name="trash-outline" size={15} color={COLORS.error} />
        </TouchableOpacity>
      </View>
      {/* Type selector */}
      <View style={styles.btnTypeRow}>
        {BUTTON_TYPES.map(t => (
          <TouchableOpacity
            key={t} style={[styles.btnTypeChip, btn.type === t && styles.btnTypeChipActive]}
            onPress={() => onChange(index, 'type', t)} activeOpacity={0.8}>
            <Text style={[styles.btnTypeText, btn.type === t && {color: '#fff'}]}>{t.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Text */}
      <TextInput
        style={styles.btnInput} placeholder="Button text" placeholderTextColor={COLORS.textInactive}
        value={btn.text} onChangeText={v => onChange(index, 'text', v)} maxLength={25}
      />
      {btn.type === 'CALL' && (
        <TextInput
          style={styles.btnInput} placeholder="+91 98765 43210" placeholderTextColor={COLORS.textInactive}
          keyboardType="phone-pad" value={btn.phone || ''}
          onChangeText={v => onChange(index, 'phone', v)}
        />
      )}
      {btn.type === 'URL' && (
        <TextInput
          style={styles.btnInput} placeholder="https://example.com" placeholderTextColor={COLORS.textInactive}
          keyboardType="url" value={btn.url || ''}
          onChangeText={v => onChange(index, 'url', v)}
        />
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────
export default function TemplateCreateScreen({navigation, setActiveTab}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('MARKETING');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [headerType, setHeaderType] = useState('NONE');
  const [headerText, setHeaderText] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [buttons, setButtons] = useState([]);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Body formatting helpers
  const wrapBodySelection = (wrapper) => {
    setBody(prev => prev + wrapper);
  };

  const addVariable = () => {
    const varNum = (body.match(/{{(\d+)}}/g) || []).length + 1;
    setBody(prev => prev + `{{${varNum}}}`);
  };

  // Buttons helpers
  const addButton = () => {
    if (buttons.length >= 3) { showToast('Maximum 3 buttons allowed'); return; }
    setButtons(prev => [...prev, {type: 'QUICK_REPLY', text: '', phone: '', url: ''}]);
  };
  const changeButton = (idx, field, val) => {
    setButtons(prev => prev.map((b, i) => i === idx ? {...b, [field]: val} : b));
  };
  const removeButton = (idx) => {
    setButtons(prev => prev.filter((_, i) => i !== idx));
  };

  // AI fill
  const handleAIGenerate = (data) => {
    setName(data.name || '');
    setCategory(data.category || 'MARKETING');
    setLanguage(data.language || LANGUAGES[0]);
    setHeaderType(data.headerType || 'NONE');
    setHeaderText(data.headerText || '');
    setBody(data.body || '');
    setFooter(data.footer || '');
    setButtons(data.buttons || []);
    showToast('Template generated by AI!');
  };

  // Validate name (lowercase snake_case)
  const nameValid = !name || /^[a-z0-9_]+$/.test(name);

  const validate = () => {
    if (!name.trim()) { showToast('Template name is required'); return false; }
    if (!nameValid) { showToast('Name must be lowercase letters, numbers, underscores only'); return false; }
    if (!body.trim()) { showToast('Template body is required'); return false; }
    if (body.length > 1024) { showToast('Body must not exceed 1024 characters'); return false; }
    if (headerType === 'TEXT' && headerText.length > 60) { showToast('Header text max 60 characters'); return false; }
    if (footer.length > 60) { showToast('Footer max 60 characters'); return false; }
    for (const btn of buttons) {
      if (!btn.text.trim()) { showToast('Each button must have a text'); return false; }
      if (btn.type === 'CALL' && !btn.phone.trim()) { showToast('CALL button requires a phone number'); return false; }
      if (btn.type === 'URL' && !btn.url.trim()) { showToast('URL button requires a URL'); return false; }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast('Template submitted for Meta review!');
      if (navigation) navigation.goBack();
      else if (setActiveTab) setActiveTab('templates');
    }, 2000);
  };

  const handleBack = () => {
    if (navigation) navigation.goBack();
    else if (setActiveTab) setActiveTab('templates');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>Template Builder</Text>
          <Text style={styles.headerSub}>New WhatsApp Template</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Template Name */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="TEMPLATE NAME" required />
          <View style={[styles.inputBox, !nameValid && {borderColor: COLORS.error}]}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. festival_offer_2024"
              placeholderTextColor={COLORS.textInactive}
              value={name} onChangeText={t => setName(t.toLowerCase())}
              autoCapitalize="none"
            />
          </View>
          <Text style={[styles.hintText, !nameValid && {color: COLORS.error}]}>
            {nameValid ? 'Lowercase letters, numbers, and underscores only' : '⚠ Invalid: use lowercase letters, numbers, underscores only'}
          </Text>
        </View>

        {/* Category */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="CATEGORY" required />
          <View style={styles.radioGroup}>
            {CATEGORIES.map(cat => {
              const isActive = category === cat;
              const catColors = {MARKETING: '#7c3aed', UTILITY: '#1d4ed8', AUTHENTICATION: '#9d174d'};
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.radioOption, isActive && {borderColor: catColors[cat], backgroundColor: catColors[cat] + '12'}]}
                  onPress={() => setCategory(cat)} activeOpacity={0.8}>
                  <View style={[styles.radio, isActive && {borderColor: catColors[cat]}]}>
                    {isActive && <View style={[styles.radioDot, {backgroundColor: catColors[cat]}]} />}
                  </View>
                  <Text style={[styles.radioText, isActive && {color: catColors[cat], fontFamily: FONTS.semiBold}]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Language */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="LANGUAGE" required />
          <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowLangPicker(true)} activeOpacity={0.8}>
            <Ionicons name="globe-outline" size={18} color={COLORS.primary} style={{marginRight: 10}} />
            <Text style={styles.pickerValue}>{language.label}</Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="HEADER" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8, marginBottom: 12}}>
            {HEADER_TYPES.map(ht => {
              const icons = {NONE: 'remove-outline', TEXT: 'text-outline', IMAGE: 'image-outline', VIDEO: 'videocam-outline', DOCUMENT: 'document-outline'};
              return (
                <TouchableOpacity
                  key={ht}
                  style={[styles.headerTypeChip, headerType === ht && styles.headerTypeChipActive]}
                  onPress={() => { setHeaderType(ht); if (ht !== 'TEXT') setHeaderText(''); }}
                  activeOpacity={0.8}>
                  <Ionicons name={icons[ht]} size={14} color={headerType === ht ? '#fff' : COLORS.textMuted} style={{marginRight: 5}} />
                  <Text style={[styles.headerTypeText, headerType === ht && {color: '#fff'}]}>{ht}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {headerType === 'TEXT' && (
            <View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput} placeholder="Header text (max 60 chars)"
                  placeholderTextColor={COLORS.textInactive}
                  value={headerText} onChangeText={setHeaderText} maxLength={60}
                />
              </View>
              <Text style={styles.charCount}>{headerText.length}/60</Text>
            </View>
          )}
          {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
            <View style={styles.mediaHint}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.info} style={{marginRight: 6}} />
              <Text style={styles.mediaHintText}>Media URL provided at campaign send time</Text>
            </View>
          )}
        </View>

        {/* Body */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="BODY" required />
          {/* Formatting toolbar */}
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolBtn} onPress={() => wrapBodySelection('*bold*')} activeOpacity={0.8}>
              <Text style={styles.toolBtnBold}>B</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={() => wrapBodySelection('_italic_')} activeOpacity={0.8}>
              <Text style={styles.toolBtnItalic}>I</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={() => wrapBodySelection('~strike~')} activeOpacity={0.8}>
              <Text style={styles.toolBtnStrike}>S</Text>
            </TouchableOpacity>
            <View style={styles.toolDivider} />
            <TouchableOpacity style={[styles.toolBtn, styles.addVarBtn]} onPress={addVariable} activeOpacity={0.8}>
              <Ionicons name="add-circle-outline" size={14} color={COLORS.primary} style={{marginRight: 4}} />
              <Text style={styles.addVarText}>Add Variable</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputBox, styles.bodyInput]}>
            <TextInput
              style={[styles.textInput, {minHeight: 110, textAlignVertical: 'top'}]}
              placeholder="Enter your message body…\n\nUse {{1}}, {{2}} for personalization."
              placeholderTextColor={COLORS.textInactive}
              multiline value={body} onChangeText={setBody} maxLength={1024}
            />
          </View>
          <Text style={[styles.charCount, body.length > 900 && {color: COLORS.error}]}>{body.length}/1024</Text>
        </View>

        {/* Footer */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="FOOTER (optional)" />
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput} placeholder="e.g. Reply STOP to unsubscribe"
              placeholderTextColor={COLORS.textInactive}
              value={footer} onChangeText={setFooter} maxLength={60}
            />
          </View>
          <Text style={styles.charCount}>{footer.length}/60</Text>
        </View>

        {/* Buttons */}
        <View style={styles.fieldGroup}>
          <View style={styles.rowBetween}>
            <SectionLabel text="BUTTONS (up to 3)" />
            <Text style={styles.btnCount}>{buttons.length}/3</Text>
          </View>
          {buttons.map((btn, idx) => (
            <ButtonRow key={idx} btn={btn} index={idx} onChange={changeButton} onRemove={removeButton} />
          ))}
          {buttons.length < 3 && (
            <TouchableOpacity style={styles.addBtnRow} onPress={addButton} activeOpacity={0.8}>
              <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} style={{marginRight: 8}} />
              <Text style={styles.addBtnText}>Add Button</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Live Preview */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="LIVE PREVIEW" />
          <WhatsAppPreview
            headerType={headerType}
            headerText={headerText}
            bodyText={body}
            footerText={footer}
            buttons={buttons}
          />
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* AI FAB */}
      <TouchableOpacity style={styles.aiFab} onPress={() => setShowAIModal(true)} activeOpacity={0.85}>
        <Text style={styles.aiFabIcon}>✨</Text>
      </TouchableOpacity>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, submitting && {opacity: 0.8}]}
          onPress={handleSubmit} disabled={submitting} activeOpacity={0.85}>
          {submitting
            ? <ActivityIndicator color="#fff" size="small" style={{marginRight: 8}} />
            : <Ionicons name="paper-plane-outline" size={18} color="#fff" style={{marginRight: 8}} />}
          <Text style={styles.submitBtnText}>{submitting ? 'Submitting…' : 'Submit for Review'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <LanguagePicker
        visible={showLangPicker}
        selected={language}
        onSelect={setLanguage}
        onClose={() => setShowLangPicker(false)}
      />
      <AIModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 18,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  headerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: '#fff'},
  headerSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.75)', marginTop: 2},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 18},

  fieldGroup: {marginBottom: 20},
  sectionLabel: {
    fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},

  inputBox: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', ...SHADOWS.sm,
  },
  bodyInput: {paddingTop: 4},
  textInput: {
    fontFamily: FONTS.regular, fontSize: SIZES.body,
    color: COLORS.textBody, paddingHorizontal: 14, paddingVertical: 13,
  },
  hintText: {fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, marginTop: 5},
  charCount: {fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginTop: 5},

  radioGroup: {gap: 10},
  radioOption: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: SIZES.radiusMd, borderWidth: 1.5, borderColor: COLORS.gray20,
    backgroundColor: COLORS.white, ...SHADOWS.sm,
  },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: COLORS.gray20, marginRight: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  radioDot: {width: 10, height: 10, borderRadius: 5},
  radioText: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textMuted},

  pickerTrigger: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', ...SHADOWS.sm,
  },
  pickerValue: {flex: 1, fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textBody},

  headerTypeChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: SIZES.radiusFull, borderWidth: 1,
    borderColor: COLORS.gray20, backgroundColor: COLORS.white,
  },
  headerTypeChipActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  headerTypeText: {fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted},
  mediaHint: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.info + '12', borderRadius: SIZES.radiusSm,
    padding: 10, borderWidth: 1, borderColor: COLORS.info + '33',
  },
  mediaHintText: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.info},

  toolbar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8, paddingVertical: 6,
    marginBottom: 8, gap: 4, ...SHADOWS.sm,
  },
  toolBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: SIZES.radiusSm, backgroundColor: COLORS.pageBg,
  },
  toolBtnBold: {fontFamily: FONTS.bold, fontSize: 14, color: COLORS.textTitle},
  toolBtnItalic: {fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textTitle, fontStyle: 'italic'},
  toolBtnStrike: {fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textTitle, textDecorationLine: 'line-through'},
  toolDivider: {width: 1, height: 22, backgroundColor: COLORS.gray20, marginHorizontal: 4},
  addVarBtn: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '12', borderWidth: 1, borderColor: COLORS.primary + '33'},
  addVarText: {fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.primary},

  btnCount: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted},
  btnCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    padding: 14, marginBottom: 10, ...SHADOWS.sm,
  },
  btnCardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10},
  btnCardTitle: {fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textTitle},
  removeBtnIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.error + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  btnTypeRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
  btnTypeChip: {
    flex: 1, alignItems: 'center', paddingVertical: 7,
    borderRadius: SIZES.radiusSm, borderWidth: 1, borderColor: COLORS.gray20,
    backgroundColor: COLORS.pageBg,
  },
  btnTypeChipActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  btnTypeText: {fontFamily: FONTS.medium, fontSize: 10, color: COLORS.textMuted},
  btnInput: {
    backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusSm,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 12, paddingVertical: 10,
    fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textBody,
    marginBottom: 8,
  },
  addBtnRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.primary + '55',
    borderRadius: SIZES.radiusMd, paddingVertical: 14,
    justifyContent: 'center', backgroundColor: COLORS.primary + '06',
  },
  addBtnText: {fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.primary},

  footer: {
    padding: 16, paddingBottom: 28,
    backgroundColor: COLORS.white,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)', ...SHADOWS.lg,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 16,
    borderRadius: SIZES.radiusFull, ...SHADOWS.md,
  },
  submitBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},

  aiFab: {
    position: 'absolute', bottom: 100, right: 20,
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.lg,
  },
  aiFabIcon: {fontSize: 24},

  // Modal
  overlay: {flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end'},
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '80%', paddingBottom: 28,
  },
  sheetHandle: {width: 40, height: 4, backgroundColor: COLORS.gray20, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4},
  sheetHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14},
  sheetTitle: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle},
  langOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  langOptionText: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody},

  aiIcon: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#7c3aed20',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  aiSubtitle: {fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textMuted, marginBottom: 14, lineHeight: 20},
  aiPromptInput: {
    backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusMd,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 14, paddingVertical: 12, height: 120,
    fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody,
    textAlignVertical: 'top', marginBottom: 16,
  },
  aiGenerateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#7c3aed', paddingVertical: 15,
    borderRadius: SIZES.radiusFull, ...SHADOWS.md,
  },
  aiGenerateBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},
});
