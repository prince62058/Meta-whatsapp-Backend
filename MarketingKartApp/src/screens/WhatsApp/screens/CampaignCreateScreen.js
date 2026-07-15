// ============================================================
// CampaignCreateScreen.js — "Send WhatsApp Message"
// ============================================================
import React, {useState, useMemo} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Modal, Alert, ActivityIndicator, Platform,
  ToastAndroid, KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_TEMPLATES, MOCK_WA_ACCOUNT, MOCK_CONTACTS, VARIABLE_FIELD_OPTIONS} from '../../../utils/mockData';
import WhatsAppPreview from '../components/WhatsAppPreview';

const APPROVED_TEMPLATES = MOCK_TEMPLATES.filter(t => t.status === 'APPROVED');
const TO_TABS = ['Manually', 'Contacts', 'CSV file'];

function showToast(msg) {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert('', msg);
}

function SectionLabel({text, required}) {
  return (
    <Text style={styles.sectionLabel}>
      {text}
      {required ? <Text style={{color: COLORS.error}}> *</Text> : null}
    </Text>
  );
}

function TabBar({tabs, active, onSelect}) {
  return (
    <View style={styles.tabBar}>
      {tabs.map(t => (
        <TouchableOpacity
          key={t} style={[styles.tab, active === t && styles.tabActive]}
          onPress={() => onSelect(t)} activeOpacity={0.8}>
          <Text style={[styles.tabText, active === t && styles.tabTextActive]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Contact Picker Modal ──────────────────────────────────
function ContactPickerModal({visible, onClose, onConfirm}) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const filtered = MOCK_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search),
  );
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const confirm = () => {
    onConfirm(MOCK_CONTACTS.filter(c => selected.includes(c.id)));
    onClose();
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHandle} />
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Contacts</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
          </View>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={COLORS.textMuted} style={{marginRight: 8}} />
            <TextInput
              style={styles.searchInput} placeholder="Search contacts…"
              placeholderTextColor={COLORS.textInactive}
              value={search} onChangeText={setSearch}
            />
          </View>
          <ScrollView style={{flex: 1}}>
            {filtered.map(c => {
              const isSelected = selected.includes(c.id);
              return (
                <TouchableOpacity key={c.id} style={styles.contactRow} onPress={() => toggle(c.id)} activeOpacity={0.8}>
                  <View style={[styles.contactAvatar, {backgroundColor: COLORS.primary + '20'}]}>
                    <Text style={styles.contactAvatarText}>{c.name[0]}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactPhone}>{c.phone}</Text>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={[styles.confirmBtn, selected.length === 0 && {opacity: 0.5}]}
            onPress={confirm} disabled={selected.length === 0} activeOpacity={0.85}>
            <Text style={styles.confirmBtnText}>
              Add {selected.length > 0 ? `${selected.length} Contact${selected.length > 1 ? 's' : ''}` : 'Contacts'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Template Picker Modal ─────────────────────────────────
function TemplatePicker({visible, onClose, onSelect}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHandle} />
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Template</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
          </View>
          <ScrollView style={{flex: 1, paddingHorizontal: 16}}>
            <Text style={styles.helperText}>Showing approved templates only</Text>
            {APPROVED_TEMPLATES.map(t => (
              <TouchableOpacity key={t.id} style={styles.templateOption} onPress={() => { onSelect(t); onClose(); }} activeOpacity={0.8}>
                <View style={{flex: 1}}>
                  <Text style={styles.templateOptionName}>{t.name}</Text>
                  <Text style={styles.templateOptionBody} numberOfLines={2}>{t.body}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────
export default function CampaignCreateScreen({navigation, setActiveTab}) {
  const [campaignName, setCampaignName] = useState('');
  const [toTab, setToTab] = useState('Manually');
  const [manualNumbers, setManualNumbers] = useState(['']);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [varMapping, setVarMapping] = useState({});
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [sending, setSending] = useState(false);

  // Parse variables from template body
  const variables = useMemo(() => {
    if (!selectedTemplate) return [];
    const matches = selectedTemplate.body.match(/{{[^}]+}}/g) || [];
    return [...new Set(matches)];
  }, [selectedTemplate]);

  // Live preview body text
  const previewBody = useMemo(() => {
    if (!selectedTemplate) return '';
    let body = selectedTemplate.body;
    Object.entries(varMapping).forEach(([v, field]) => {
      body = body.replace(new RegExp(v.replace(/[{}]/g, '\\$&'), 'g'), `[${field}]`);
    });
    return body;
  }, [selectedTemplate, varMapping]);

  const handleAddNumber = () => setManualNumbers(prev => [...prev, '']);
  const handleRemoveNumber = (idx) => setManualNumbers(prev => prev.filter((_, i) => i !== idx));
  const handleNumberChange = (idx, val) => {
    setManualNumbers(prev => prev.map((n, i) => i === idx ? val : n));
  };

  const handleCSVPick = () => {
    setTimeout(() => setCsvFileName('contacts_batch_jan2024.csv'), 600);
    showToast('CSV file selected');
  };

  const handleSelectTemplate = (t) => {
    setSelectedTemplate(t);
    setVarMapping({});
  };

  const validate = () => {
    if (!campaignName.trim()) { showToast('Campaign name is required'); return false; }
    if (toTab === 'Manually' && manualNumbers.every(n => !n.trim())) {
      showToast('Add at least one phone number'); return false;
    }
    if (toTab === 'Contacts' && selectedContacts.length === 0) {
      showToast('Select at least one contact'); return false;
    }
    if (toTab === 'CSV file' && !csvFileName) {
      showToast('Upload a CSV file'); return false;
    }
    if (!selectedTemplate) { showToast('Select a WhatsApp template'); return false; }
    return true;
  };

  const handleSend = () => {
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast('Campaign created! Messages are being sent.');
      if (setActiveTab) setActiveTab('campaigns');
      else if (navigation) navigation.goBack();
    }, 2000);
  };

  const handleClose = () => {
    if (navigation) navigation.goBack();
    else if (setActiveTab) setActiveTab('campaigns');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>Send WhatsApp Message</Text>
          <Text style={styles.headerSub}>New Campaign</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.8}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Campaign Name */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="CAMPAIGN NAME" required />
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Diwali Festival Blast"
              placeholderTextColor={COLORS.textInactive}
              value={campaignName}
              onChangeText={setCampaignName}
            />
          </View>
        </View>

        {/* TO section */}
        <View style={styles.fieldGroup}>
          <View style={styles.rowBetween}>
            <SectionLabel text="TO" required />
            <TouchableOpacity>
              <Text style={styles.helpLink}>Need Help? CSV</Text>
            </TouchableOpacity>
          </View>
          <TabBar tabs={TO_TABS} active={toTab} onSelect={setToTab} />

          {toTab === 'Manually' && (
            <View style={styles.manualSection}>
              {manualNumbers.map((num, idx) => (
                <View key={idx} style={styles.numberRow}>
                  <View style={styles.prefixBox}><Text style={styles.prefixText}>+91</Text></View>
                  <TextInput
                    style={styles.numberInput}
                    placeholder="98765 43210"
                    placeholderTextColor={COLORS.textInactive}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={num}
                    onChangeText={v => handleNumberChange(idx, v)}
                  />
                  {manualNumbers.length > 1 && (
                    <TouchableOpacity onPress={() => handleRemoveNumber(idx)} style={styles.removeBtn}>
                      <Ionicons name="close-circle" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addMoreBtn} onPress={handleAddNumber} activeOpacity={0.8}>
                <Ionicons name="add-circle-outline" size={16} color={COLORS.primary} style={{marginRight: 6}} />
                <Text style={styles.addMoreText}>+ Add More</Text>
              </TouchableOpacity>
            </View>
          )}

          {toTab === 'Contacts' && (
            <View style={styles.contactsSection}>
              {selectedContacts.length > 0 && (
                <View style={styles.selectedContactsWrap}>
                  {selectedContacts.map(c => (
                    <View key={c.id} style={styles.contactChip}>
                      <Text style={styles.contactChipText}>{c.name}</Text>
                      <TouchableOpacity onPress={() => setSelectedContacts(prev => prev.filter(x => x.id !== c.id))}>
                        <Ionicons name="close-circle" size={15} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              <TouchableOpacity style={styles.pickContactsBtn} onPress={() => setShowContactPicker(true)} activeOpacity={0.85}>
                <Ionicons name="people-outline" size={18} color={COLORS.primary} style={{marginRight: 8}} />
                <Text style={styles.pickContactsBtnText}>
                  {selectedContacts.length > 0 ? `${selectedContacts.length} selected — Change` : 'Pick from Contacts'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {toTab === 'CSV file' && (
            <View style={styles.csvSection}>
              {csvFileName ? (
                <View style={styles.csvFileRow}>
                  <Ionicons name="document-text" size={20} color={COLORS.success} style={{marginRight: 10}} />
                  <Text style={styles.csvFileName}>{csvFileName}</Text>
                  <TouchableOpacity onPress={() => setCsvFileName('')}>
                    <Ionicons name="close-circle" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.csvUploadBtn} onPress={handleCSVPick} activeOpacity={0.85}>
                  <Ionicons name="cloud-upload-outline" size={28} color={COLORS.primary} />
                  <Text style={styles.csvUploadTitle}>Upload CSV / XLSX</Text>
                  <Text style={styles.csvUploadSub}>Must include a "phone" column (10-digit numbers)</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* FROM */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="FROM" />
          <View style={styles.fromCard}>
            <View style={styles.waIcon}>
              <Ionicons name="logo-whatsapp" size={20} color={COLORS.waGreen} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.fromNumber}>{MOCK_WA_ACCOUNT.phoneNumber}</Text>
              <Text style={styles.fromName}>{MOCK_WA_ACCOUNT.displayName}</Text>
            </View>
            <View style={styles.connectedBadge}>
              <View style={[styles.statusDot, {backgroundColor: COLORS.success}]} />
              <Text style={styles.connectedText}>Connected</Text>
            </View>
          </View>
        </View>

        {/* WHATSAPP TEMPLATE */}
        <View style={styles.fieldGroup}>
          <SectionLabel text="WHATSAPP TEMPLATE" required />
          <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowTemplatePicker(true)} activeOpacity={0.8}>
            {selectedTemplate ? (
              <View style={{flex: 1}}>
                <Text style={styles.selectedTemplateName}>{selectedTemplate.name}</Text>
                <Text style={styles.selectedTemplateCat}>{selectedTemplate.category} · {selectedTemplate.language}</Text>
              </View>
            ) : (
              <Text style={styles.pickerPlaceholder}>Select an approved template…</Text>
            )}
            <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* PERSONALIZE */}
        {variables.length > 0 && (
          <View style={styles.fieldGroup}>
            <SectionLabel text="PERSONALIZE VARIABLES" />
            <Text style={styles.personalizeHint}>Map each variable to a contact field</Text>
            {variables.map((v, i) => (
              <View key={i} style={styles.varRow}>
                <View style={styles.varChip}>
                  <Text style={styles.varChipText}>{v}</Text>
                </View>
                <Ionicons name="arrow-forward" size={14} color={COLORS.textMuted} style={{marginHorizontal: 8}} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                  <View style={{flexDirection: 'row', gap: 6}}>
                    {VARIABLE_FIELD_OPTIONS.map(opt => (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.fieldOptionChip, varMapping[v] === opt && styles.fieldOptionActive]}
                        onPress={() => setVarMapping(m => ({...m, [v]: opt}))}
                        activeOpacity={0.8}>
                        <Text style={[styles.fieldOptionText, varMapping[v] === opt && {color: '#fff'}]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}
          </View>
        )}

        {/* TEMPLATE PREVIEW */}
        {selectedTemplate && (
          <View style={styles.fieldGroup}>
            <SectionLabel text="TEMPLATE PREVIEW" />
            <WhatsAppPreview
              headerType={selectedTemplate.headerType}
              headerText={selectedTemplate.headerText}
              bodyText={previewBody}
              footerText={selectedTemplate.footer}
              buttons={selectedTemplate.buttons}
            />
          </View>
        )}

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} activeOpacity={0.8}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sendBtn, sending && {opacity: 0.8}]} onPress={handleSend} disabled={sending} activeOpacity={0.85}>
          {sending ? (
            <ActivityIndicator color="#fff" size="small" style={{marginRight: 8}} />
          ) : (
            <Ionicons name="send-outline" size={16} color="#fff" style={{marginRight: 8}} />
          )}
          <Text style={styles.sendBtnText}>{sending ? 'Sending…' : 'Review & Send'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <ContactPickerModal
        visible={showContactPicker}
        onClose={() => setShowContactPicker(false)}
        onConfirm={contacts => setSelectedContacts(contacts)}
      />
      <TemplatePicker
        visible={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        onSelect={handleSelectTemplate}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.pageBg},

  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 18,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.titleLg, color: '#fff'},
  headerSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 18},

  fieldGroup: {marginBottom: 18},
  sectionLabel: {
    fontFamily: FONTS.semiBold, fontSize: 11,
    color: COLORS.textMuted, textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 8,
  },
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  helpLink: {fontFamily: FONTS.medium, fontSize: 12, color: COLORS.primary, textDecorationLine: 'underline'},

  inputBox: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', ...SHADOWS.sm,
  },
  textInput: {
    fontFamily: FONTS.regular, fontSize: SIZES.body,
    color: COLORS.textBody, paddingHorizontal: 14, paddingVertical: 13,
  },

  tabBar: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    padding: 4, marginBottom: 12, ...SHADOWS.sm,
  },
  tab: {flex: 1, paddingVertical: 9, borderRadius: SIZES.radiusSm, alignItems: 'center'},
  tabActive: {backgroundColor: COLORS.primary, ...SHADOWS.sm},
  tabText: {fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textMuted},
  tabTextActive: {color: '#fff', fontFamily: FONTS.semiBold},

  manualSection: {},
  numberRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  prefixBox: {
    backgroundColor: COLORS.pageBg, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: SIZES.radiusMd, paddingHorizontal: 12, paddingVertical: 12,
    marginRight: 8, borderRightWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0,
  },
  prefixText: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textSecondary},
  numberInput: {
    flex: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: SIZES.radiusMd, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody,
  },
  removeBtn: {marginLeft: 8},
  addMoreBtn: {flexDirection: 'row', alignItems: 'center', paddingVertical: 8},
  addMoreText: {fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.primary},

  contactsSection: {},
  selectedContactsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10},
  contactChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary + '18', borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.primary + '33',
  },
  contactChipText: {fontFamily: FONTS.medium, fontSize: 12, color: COLORS.primary},
  pickContactsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.primary + '66',
    borderRadius: SIZES.radiusMd, paddingVertical: 16,
    backgroundColor: COLORS.primary + '08',
  },
  pickContactsBtnText: {fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.primary},

  csvSection: {},
  csvUploadBtn: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.primary + '55',
    borderRadius: SIZES.radiusMd, paddingVertical: 28,
    alignItems: 'center', backgroundColor: COLORS.primary + '06',
  },
  csvUploadTitle: {fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.primary, marginTop: 8},
  csvUploadSub: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginTop: 4, textAlign: 'center', paddingHorizontal: 16},
  csvFileRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.successBg, borderRadius: SIZES.radiusMd,
    padding: 14, borderWidth: 1, borderColor: COLORS.success + '33',
  },
  csvFileName: {flex: 1, fontFamily: FONTS.medium, fontSize: 13, color: COLORS.success},

  fromCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOWS.sm,
  },
  waIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.waGreen + '18',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  fromNumber: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: COLORS.textTitle},
  fromName: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginTop: 2},
  connectedBadge: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: SIZES.radiusFull},
  statusDot: {width: 6, height: 6, borderRadius: 3, marginRight: 5},
  connectedText: {fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.success},

  pickerTrigger: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', ...SHADOWS.sm,
  },
  pickerPlaceholder: {flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textInactive},
  selectedTemplateName: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textTitle},
  selectedTemplateCat: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginTop: 2},

  personalizeHint: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginBottom: 10},
  varRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  varChip: {
    backgroundColor: COLORS.info + '20', borderRadius: SIZES.radiusFull,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.info + '44',
  },
  varChipText: {fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.info},
  fieldOptionChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: SIZES.radiusFull, borderWidth: 1, borderColor: COLORS.gray20,
    backgroundColor: COLORS.white,
  },
  fieldOptionActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  fieldOptionText: {fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textMuted},

  footer: {
    flexDirection: 'row', padding: 16, paddingBottom: 28,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)',
    gap: 12, ...SHADOWS.lg,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: SIZES.radiusFull,
    borderWidth: 1.5, borderColor: COLORS.gray20, alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.textMuted},
  sendBtn: {
    flex: 2.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.primary, ...SHADOWS.md,
  },
  sendBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},

  // Modal styles
  modalOverlay: {flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end'},
  pickerSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '80%', paddingBottom: 28,
  },
  pickerHandle: {width: 40, height: 4, backgroundColor: COLORS.gray20, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4},
  pickerHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14},
  pickerTitle: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle},
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
  },
  searchInput: {flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody},
  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  contactAvatar: {width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12},
  contactAvatarText: {fontFamily: FONTS.bold, fontSize: 16, color: COLORS.primary},
  contactName: {fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textTitle},
  contactPhone: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginTop: 2},
  checkbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.gray20,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  confirmBtn: {
    marginHorizontal: 16, marginTop: 14,
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusFull,
    paddingVertical: 15, alignItems: 'center', ...SHADOWS.md,
  },
  confirmBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},
  helperText: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginBottom: 12, marginTop: 4},
  templateOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  templateOptionName: {fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textTitle, marginBottom: 4},
  templateOptionBody: {fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, lineHeight: 18},
});
