// ============================================================
// MarketingKart.ai — Help & Support Screen
// ============================================================
import React, {useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
  TextInput, Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_TICKETS} from '../mockData';

const CATEGORIES = ['TRANSACTION', 'TECHNICAL', 'PLAN', 'CALLBACK', 'GENERAL'];
const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

const PRIORITY_COLORS = {HIGH: COLORS.error, MEDIUM: COLORS.warning, LOW: COLORS.waGreen};
const STATUS_COLORS = {OPEN: COLORS.warning, RESOLVED: COLORS.success};

function TicketCard({ticket}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity style={styles.ticketCard} onPress={() => setExpanded(e => !e)} activeOpacity={0.85}>
      <View style={styles.ticketTop}>
        <View style={styles.ticketIdRow}>
          <Text style={styles.ticketId}>{ticket.id}</Text>
          <View style={[styles.statusChip, {backgroundColor: STATUS_COLORS[ticket.status] + '22'}]}>
            <Text style={[styles.statusChipText, {color: STATUS_COLORS[ticket.status]}]}>{ticket.status}</Text>
          </View>
        </View>
        <Text style={styles.ticketSubject}>{ticket.subject}</Text>
        <View style={styles.ticketMeta}>
          <Text style={styles.ticketDate}>{ticket.date}</Text>
          <View style={[styles.priorityChip, {backgroundColor: PRIORITY_COLORS[ticket.priority] + '22'}]}>
            <Text style={[styles.priorityText, {color: PRIORITY_COLORS[ticket.priority]}]}>{ticket.priority}</Text>
          </View>
        </View>
        {expanded && (
          <Text style={styles.ticketMessage}>{ticket.message}</Text>
        )}
      </View>
      <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

export default function HelpSupportScreen({navigation}) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState('');
  const [callback, setCallback] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!subject.trim()) {
      Toast.show({type: 'error', text1: 'Subject required', position: 'top'});
      return;
    }
    if (!message.trim()) {
      Toast.show({type: 'error', text1: 'Message required', position: 'top'});
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubject('');
      setMessage('');
      setCategory('GENERAL');
      setPriority('MEDIUM');
      setCallback(false);
      Toast.show({
        type: 'success',
        text1: 'Ticket Submitted! 🎫',
        text2: "We'll respond within 24 hours.",
        position: 'top',
        visibilityTime: 4000,
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{width: 34}} />
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Create Ticket Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Ticket</Text>

          {/* Subject */}
          <Text style={styles.inputLabel}>Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe your issue briefly..."
            placeholderTextColor={COLORS.textInactive}
            value={subject}
            onChangeText={setSubject}
          />

          {/* Category */}
          <Text style={styles.inputLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}>
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Priority */}
          <Text style={styles.inputLabel}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityBtn,
                  priority === p && {backgroundColor: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p]},
                ]}
                onPress={() => setPriority(p)}>
                <Text style={[styles.priorityBtnText, priority === p && {color: COLORS.white}]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Message */}
          <Text style={styles.inputLabel}>Message *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue in detail..."
            placeholderTextColor={COLORS.textInactive}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          {/* Callback Checkbox */}
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setCallback(c => !c)}>
            <View style={[styles.checkbox, callback && styles.checkboxChecked]}>
              {callback && <Ionicons name="checkmark" size={13} color={COLORS.white} />}
            </View>
            <Text style={styles.checkboxLabel}>Request a callback from our team</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={{marginTop: 4}}>
            <LinearGradient
              colors={submitting ? [COLORS.lightGray, COLORS.lightGray] : [COLORS.primary, COLORS.primaryDark]}
              style={styles.submitBtn}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Ionicons name={submitting ? 'hourglass-outline' : 'send-outline'} size={18} color={COLORS.white} style={{marginRight: 8}} />
              <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Ticket'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Ticket History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Tickets</Text>
          {MOCK_TICKETS.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </View>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.pageBg},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.lg, paddingVertical: 14},
  backBtn: {width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.title, color: COLORS.white},
  body: {flex: 1},
  section: {backgroundColor: COLORS.white, marginHorizontal: SIZES.lg, marginTop: 16, borderRadius: SIZES.radiusMd, padding: 16, ...SHADOWS.sm},
  sectionTitle: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginBottom: 14},
  inputLabel: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textSecondary, marginBottom: 6, marginTop: 12},
  input: {backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusSm, paddingHorizontal: 12, paddingVertical: 10, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody, borderWidth: 1, borderColor: COLORS.pageBg},
  textArea: {height: 110, paddingTop: 10},
  chipScroll: {marginBottom: 4},
  chip: {paddingHorizontal: 14, paddingVertical: 7, borderRadius: SIZES.radiusFull, borderWidth: 1.5, borderColor: COLORS.primaryLight, marginRight: 8, backgroundColor: COLORS.pageBg},
  chipActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  chipText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.primary},
  chipTextActive: {color: COLORS.white},
  priorityRow: {flexDirection: 'row', gap: 10},
  priorityBtn: {flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: SIZES.radiusMd, borderWidth: 1.5, borderColor: COLORS.lightGray, backgroundColor: COLORS.pageBg},
  priorityBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.textMuted},
  checkboxRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, marginBottom: 14},
  checkbox: {width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.pageBg},
  checkboxChecked: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  checkboxLabel: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary, flex: 1},
  submitBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: SIZES.radiusMd, paddingVertical: 14},
  submitBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.bodyLg, color: COLORS.white},
  ticketCard: {backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusMd, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  ticketTop: {flex: 1, marginRight: 8},
  ticketIdRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4},
  ticketId: {fontFamily: FONTS.semiBold, fontSize: SIZES.small, color: COLORS.primary},
  statusChip: {borderRadius: SIZES.radiusFull, paddingHorizontal: 8, paddingVertical: 2},
  statusChipText: {fontFamily: FONTS.bold, fontSize: 10},
  ticketSubject: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textTitle, marginBottom: 6},
  ticketMeta: {flexDirection: 'row', alignItems: 'center', gap: 10},
  ticketDate: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted},
  priorityChip: {borderRadius: SIZES.radiusFull, paddingHorizontal: 8, paddingVertical: 2},
  priorityText: {fontFamily: FONTS.bold, fontSize: 10},
  ticketMessage: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textSecondary, marginTop: 10, lineHeight: 20},
});
