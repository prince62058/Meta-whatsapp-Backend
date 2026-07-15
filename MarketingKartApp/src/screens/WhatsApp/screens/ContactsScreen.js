// ============================================================
// MarketingKart.ai — Contacts Screen
// ============================================================
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_CONTACTS} from '../mockData';

function getInitials(name) {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

const AVATAR_COLORS = [
  '#7C3AED', '#0EA5E9', '#F59E0B', '#10B981',
  '#EF4444', '#EC4899', '#6366F1', '#14B8A6',
];

function ContactRow({item, index, onPress}) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.75}>
      <View style={[styles.avatar, {backgroundColor: color}]}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.phoneText}>{item.phone}</Text>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={[styles.statusDot, {backgroundColor: item.status === 'active' ? COLORS.waGreen : COLORS.lightGray}]} />
    </TouchableOpacity>
  );
}

function ContactDetailSheet({contact, visible, onClose, index}) {
  if (!contact) return null;
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <View style={[styles.sheetAvatar, {backgroundColor: color}]}>
            <Text style={styles.sheetAvatarText}>{getInitials(contact.name)}</Text>
          </View>
          <Text style={styles.sheetName}>{contact.name}</Text>
          <View style={[styles.statusPill, {backgroundColor: contact.status === 'active' ? COLORS.successBg : COLORS.pageBg}]}>
            <Text style={[styles.statusPillText, {color: contact.status === 'active' ? COLORS.success : COLORS.textMuted}]}>
              {contact.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
        <View style={styles.detailRows}>
          <DetailRow icon="call-outline" label="Phone" value={contact.phone} />
          <DetailRow icon="mail-outline" label="Email" value={contact.email} />
          <DetailRow icon="document-text-outline" label="Note" value={contact.note} />
        </View>
        <TouchableOpacity style={styles.sheetBtn} onPress={onClose}>
          <Text style={styles.sheetBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function DetailRow({icon, label, value}) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color={COLORS.primary} style={{marginRight: 10}} />
      <View style={{flex: 1}}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ContactsScreen({navigation, setActiveTab}) {
  const [contacts] = useState(MOCK_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sheetVisible, setSheetVisible] = useState(false);

  const filtered = searchQuery.trim()
    ? contacts.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery),
      )
    : contacts;

  const handlePress = useCallback((item, index) => {
    setSelectedContact(item);
    setSelectedIndex(index);
    setSheetVisible(true);
  }, []);

  const handleImport = useCallback(async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx, DocumentPicker.types.xls, DocumentPicker.types.csv],
      });
      Toast.show({
        type: 'success',
        text1: 'Import Successful',
        text2: `${res[0]?.name || 'File'} imported! Contacts will appear shortly.`,
        position: 'top',
      });
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        Toast.show({type: 'error', text1: 'Import Failed', text2: 'Please select a valid Excel or CSV file.'});
      }
    }
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity style={styles.importBtn} onPress={handleImport}>
          <Ionicons name="cloud-upload-outline" size={16} color={COLORS.white} />
          <Text style={styles.importBtnText}>Import Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} style={{marginRight: 8}} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={COLORS.textInactive}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Count strip */}
      <View style={styles.countStrip}>
        <Text style={styles.countText}>{filtered.length} contact{filtered.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <ContactRow item={item} index={index} onPress={i => handlePress(i, index)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={COLORS.primaryLight} />
            <Text style={styles.emptyTitle}>No contacts found</Text>
            <Text style={styles.emptySubtitle}>Import an Excel file to add contacts.</Text>
          </View>
        }
      />

      <ContactDetailSheet
        contact={selectedContact}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        index={selectedIndex}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.primary},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: 14,
  },
  headerTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.title, color: COLORS.white},
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  importBtnText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.white},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.lg,
    marginBottom: 12,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...SHADOWS.sm,
  },
  searchInput: {flex: 1, fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody, paddingVertical: 0},
  countStrip: {
    backgroundColor: COLORS.pageBg,
    paddingHorizontal: SIZES.lg,
    paddingVertical: 8,
  },
  countText: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textMuted},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.lg,
    paddingVertical: 12,
  },
  avatar: {width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 12},
  avatarText: {fontFamily: FONTS.bold, fontSize: SIZES.subtitle, color: COLORS.white},
  rowBody: {flex: 1},
  nameText: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.textTitle},
  phoneText: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.primary, marginTop: 2},
  tagsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4},
  tag: {
    backgroundColor: COLORS.metaBlueLight,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {fontFamily: FONTS.medium, fontSize: 10, color: COLORS.primary},
  statusDot: {width: 10, height: 10, borderRadius: 5},
  separator: {height: 1, backgroundColor: COLORS.pageBg, marginLeft: 74},
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'},
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  sheetHandle: {width: 40, height: 4, backgroundColor: COLORS.lightGray, borderRadius: 2, alignSelf: 'center', marginVertical: 12},
  sheetHeader: {alignItems: 'center', marginBottom: 20},
  sheetAvatar: {width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 10},
  sheetAvatarText: {fontFamily: FONTS.bold, fontSize: 24, color: COLORS.white},
  sheetName: {fontFamily: FONTS.semiBold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 6},
  statusPill: {borderRadius: SIZES.radiusFull, paddingHorizontal: 12, paddingVertical: 4},
  statusPillText: {fontFamily: FONTS.medium, fontSize: SIZES.small},
  detailRows: {gap: 16, marginBottom: 24},
  detailRow: {flexDirection: 'row', alignItems: 'flex-start'},
  detailLabel: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textMuted},
  detailValue: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textBody, marginTop: 2},
  sheetBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sheetBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.white},
  emptyContainer: {alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40},
  emptyTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.textTitle, marginTop: 16, marginBottom: 8},
  emptySubtitle: {fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.textMuted, textAlign: 'center'},
});
