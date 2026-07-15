// ============================================================
// MarketingKart.ai — WhatsApp Wallet Screen
// ============================================================
import React, {useState} from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  ScrollView, TextInput, Modal, FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_WALLET} from '../../../utils/mockData';

const QUICK_CHIPS = [500, 1000, 2000, 5000];

function TransactionRow({item}) {
  const isCredit = item.type === 'CREDIT';
  return (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, {backgroundColor: isCredit ? COLORS.successBg : COLORS.errorBg}]}>
        <Ionicons
          name={isCredit ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={18}
          color={isCredit ? COLORS.success : COLORS.error}
        />
      </View>
      <View style={styles.txBody}>
        <Text style={styles.txDesc}>{item.description}</Text>
        <Text style={styles.txDate}>{item.date}</Text>
      </View>
      <Text style={[styles.txAmount, {color: isCredit ? COLORS.success : COLORS.error}]}>
        {isCredit ? '+' : '-'}₹{item.amount.toFixed(2)}
      </Text>
    </View>
  );
}

export default function WalletScreen({navigation}) {
  const [wallet] = useState(MOCK_WALLET);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedChip, setSelectedChip] = useState(null);

  const handleChip = (val) => {
    setSelectedChip(val);
    setAmount(String(val));
  };

  const handlePay = () => {
    const num = parseInt(amount, 10);
    if (!num || num < 100) {
      Toast.show({type: 'error', text1: 'Minimum ₹100 required', position: 'top'});
      return;
    }
    setSheetVisible(false);
    setAmount('');
    setSelectedChip(null);
    setTimeout(() => {
      Toast.show({type: 'success', text1: 'Payment Initiated', text2: `₹${num} payment via Razorpay is processing.`, position: 'top'});
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Hero Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.hero}>
        <View style={styles.heroNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>WhatsApp Wallet</Text>
          <View style={{width: 34}} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            ₹{wallet.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
          </Text>
          <Text style={styles.balanceSub}>WhatsApp Marketing Credits</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setSheetVisible(true)}>
              <Ionicons name="add" size={18} color={COLORS.white} />
              <Text style={styles.addBtnText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.planBtn}
              onPress={() => navigation.navigate('Pricing')}>
              <Text style={styles.planBtnText}>Buy Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {wallet.transactions.map(item => (
          <TransactionRow key={item.id} item={item} />
        ))}
        <View style={{height: 30}} />
      </ScrollView>

      {/* Add Money Bottom Sheet */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setSheetVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Add Money to Wallet</Text>
          <Text style={styles.sheetSub}>Minimum recharge: ₹100</Text>

          <View style={styles.amountInputRow}>
            <Text style={styles.rupeePrefix}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={v => { setAmount(v.replace(/[^0-9]/g, '')); setSelectedChip(null); }}
              placeholder="Enter amount"
              placeholderTextColor={COLORS.textInactive}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <Text style={styles.quickLabel}>Quick Select</Text>
          <View style={styles.chipsRow}>
            {QUICK_CHIPS.map(val => (
              <TouchableOpacity
                key={val}
                style={[styles.chip, selectedChip === val && styles.chipActive]}
                onPress={() => handleChip(val)}>
                <Text style={[styles.chipText, selectedChip === val && styles.chipTextActive]}>₹{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
            <Ionicons name="card-outline" size={18} color={COLORS.white} style={{marginRight: 8}} />
            <Text style={styles.payBtnText}>Pay via Razorpay</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.pageBg},
  hero: {paddingBottom: 32},
  heroNav: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.lg, paddingVertical: 14},
  backBtn: {width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.title, color: COLORS.white},
  balanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXl,
    marginHorizontal: SIZES.lg,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  balanceLabel: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textMuted, marginBottom: 6},
  balanceAmount: {fontFamily: FONTS.bold, fontSize: SIZES.hero, color: COLORS.textTitle, marginBottom: 4},
  balanceSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textInactive, marginBottom: 20},
  cardActions: {flexDirection: 'row', gap: 12, width: '100%'},
  addBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: SIZES.radiusMd, paddingVertical: 12, gap: 6,
  },
  addBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.white},
  planBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: SIZES.radiusMd, paddingVertical: 12,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  planBtnText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary},
  body: {flex: 1, paddingTop: 24},
  sectionTitle: {fontFamily: FONTS.semiBold, fontSize: SIZES.subtitle, color: COLORS.textTitle, paddingHorizontal: SIZES.lg, marginBottom: 12},
  txRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, paddingHorizontal: SIZES.lg, paddingVertical: 14,
    marginHorizontal: SIZES.lg, marginBottom: 8, borderRadius: SIZES.radiusMd,
    ...SHADOWS.sm,
  },
  txIcon: {width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginRight: 12},
  txBody: {flex: 1},
  txDesc: {fontFamily: FONTS.medium, fontSize: SIZES.body, color: COLORS.textTitle},
  txDate: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginTop: 2},
  txAmount: {fontFamily: FONTS.bold, fontSize: SIZES.body},
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'},
  sheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 36,
  },
  sheetHandle: {width: 40, height: 4, backgroundColor: COLORS.lightGray, borderRadius: 2, alignSelf: 'center', marginVertical: 12},
  sheetTitle: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.textTitle, marginBottom: 4},
  sheetSub: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: COLORS.textMuted, marginBottom: 20},
  amountInputRow: {flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.pageBg, borderRadius: SIZES.radiusMd, paddingHorizontal: 14, marginBottom: 20, borderWidth: 1.5, borderColor: COLORS.primaryLight},
  rupeePrefix: {fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.primary, marginRight: 4},
  amountInput: {flex: 1, fontFamily: FONTS.medium, fontSize: SIZES.title, color: COLORS.textTitle, paddingVertical: 12},
  quickLabel: {fontFamily: FONTS.medium, fontSize: SIZES.small, color: COLORS.textMuted, marginBottom: 10},
  chipsRow: {flexDirection: 'row', gap: 10, marginBottom: 24},
  chip: {flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: SIZES.radiusMd, borderWidth: 1.5, borderColor: COLORS.primaryLight, backgroundColor: COLORS.pageBg},
  chipActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  chipText: {fontFamily: FONTS.semiBold, fontSize: SIZES.body, color: COLORS.primary},
  chipTextActive: {color: COLORS.white},
  payBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.razorpay, borderRadius: SIZES.radiusMd, paddingVertical: 14},
  payBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.bodyLg, color: COLORS.white},
});
