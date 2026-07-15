// ============================================================
// MarketingKart.ai — WhatsApp Dashboard Screen
// ============================================================
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {
  MOCK_WA_ACCOUNT,
  MOCK_WA_STATS,
  MOCK_CAMPAIGNS,
} from '../../../utils/mockData';
import ConnectWhatsAppModal from '../components/ConnectWhatsAppModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// ─── Helpers ─────────────────────────────────────────────────
function showToast(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('', msg);
  }
}

function formatNumber(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

// Campaign status → color
const STATUS_COLORS = {
  COMPLETED: COLORS.waDone,
  RUNNING: COLORS.waRunning,
  PAUSED: COLORS.waPaused,
  QUEUED: COLORS.waQueued,
  FAILED: COLORS.waFailed,
  DRAFT: COLORS.waDraft,
};

function StatusPill({status}) {
  const color = STATUS_COLORS[status] || COLORS.textMuted;
  return (
    <View style={[pillStyles.wrap, {backgroundColor: color + '22', borderColor: color + '55'}]}>
      <View style={[pillStyles.dot, {backgroundColor: color}]} />
      <Text style={[pillStyles.label, {color}]}>{status}</Text>
    </View>
  );
}
const pillStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
  },
  dot: {width: 6, height: 6, borderRadius: 3, marginRight: 5},
  label: {fontFamily: FONTS.semiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5},
});

// ─── Quick Action Tile ────────────────────────────────────────
const QUICK_ACTIONS = [
  {id: 'contacts', label: 'Contacts', icon: 'people', colors: COLORS.qaContacts, tab: 'contacts'},
  {id: 'campaigns', label: 'Campaigns', icon: 'paper-plane', colors: COLORS.qaCampaigns, tab: 'campaigns'},
  {id: 'inbox', label: 'Inbox', icon: 'chatbox-ellipses', colors: COLORS.qaInbox, tab: 'chat'},
  {id: 'reports', label: 'Reports', icon: 'bar-chart', colors: COLORS.qaReports, tab: 'reports'},
  {id: 'templates', label: 'Templates', icon: 'document-text', colors: COLORS.qaTemplates, tab: 'templates'},
];

function QuickActionTile({item, disabled, onPress}) {
  return (
    <TouchableOpacity
      style={[qaStyles.tile, disabled && {opacity: 0.55}]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}>
      <LinearGradient
        colors={item.colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={qaStyles.iconBox}>
        <Icon name={item.icon} size={22} color="#fff" />
      </LinearGradient>
      <Text style={qaStyles.label}>{item.label}</Text>
    </TouchableOpacity>
  );
}
const qaStyles = StyleSheet.create({
  tile: {
    width: 82,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXl,
    alignItems: 'center',
    paddingVertical: 14,
    marginRight: 12,
    ...SHADOWS.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

// ─── Dashboard Stats (glass row) ─────────────────────────────
function DashboardStats({totalContacts, messagesSent, deliveryRate}) {
  const stats = [
    {label: 'Total Leads', value: formatNumber(totalContacts), icon: 'people-outline'},
    {label: 'Msgs Sent', value: formatNumber(messagesSent), icon: 'send-outline'},
    {label: 'Delivered', value: deliveryRate + '%', icon: 'checkmark-done-outline'},
  ];
  return (
    <View style={statsStyles.row}>
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <View style={statsStyles.col}>
            <Icon name={s.icon} size={18} color="rgba(255,255,255,0.8)" style={{marginBottom: 4}} />
            <Text style={statsStyles.value}>{s.value}</Text>
            <Text style={statsStyles.label}>{s.label}</Text>
          </View>
          {i < stats.length - 1 && <View style={statsStyles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
}
const statsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.radiusMd,
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  col: {flex: 1, alignItems: 'center'},
  divider: {width: 1, backgroundColor: 'rgba(255,255,255,0.25)'},
  value: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.title,
    color: '#fff',
    marginBottom: 2,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});

// ─── Recent Campaign Card ─────────────────────────────────────
function CampaignCard({campaign, onPress}) {
  return (
    <TouchableOpacity style={campStyles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={campStyles.top}>
        <Text style={campStyles.name} numberOfLines={1}>{campaign.name}</Text>
        <StatusPill status={campaign.status} />
      </View>
      <Text style={campStyles.template} numberOfLines={1}>
        Template: {campaign.templateName}
      </Text>
      <View style={campStyles.stats}>
        <View style={campStyles.statItem}>
          <Icon name="people-outline" size={13} color={COLORS.textMuted} />
          <Text style={campStyles.statText}>{formatNumber(campaign.totalContacts)}</Text>
        </View>
        <View style={campStyles.statItem}>
          <Icon name="send-outline" size={13} color={COLORS.textMuted} />
          <Text style={campStyles.statText}>{formatNumber(campaign.sent)} sent</Text>
        </View>
        <View style={campStyles.statItem}>
          <Icon name="checkmark-done-outline" size={13} color={COLORS.waGreenSend} />
          <Text style={[campStyles.statText, {color: COLORS.waGreenSend}]}>
            {formatNumber(campaign.delivered)} delivered
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const campStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...SHADOWS.sm,
  },
  top: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4},
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textTitle,
    flex: 1,
    marginRight: 8,
  },
  template: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  stats: {flexDirection: 'row', gap: 14},
  statItem: {flexDirection: 'row', alignItems: 'center', gap: 4},
  statText: {fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textMuted},
});

// ─── Main DashboardScreen ─────────────────────────────────────
export default function DashboardScreen({setActiveTab, navigation}) {
  const [account] = useState(MOCK_WA_ACCOUNT);
  const [stats] = useState(MOCK_WA_STATS);
  const [campaigns] = useState(MOCK_CAMPAIGNS);
  const [connectModalVisible, setConnectModalVisible] = useState(false);

  const isConnected = account?.status === 'CONNECTED';
  const hasCampaigns = campaigns && campaigns.length > 0;
  const recentCampaigns = campaigns.slice(0, 3);

  function handleQuickAction(item) {
    if (!isConnected) {
      showToast('Connect WhatsApp First');
      return;
    }
    if (item.tab && ['chat', 'wallet'].includes(item.tab)) {
      setActiveTab(item.tab);
    } else if (item.tab === 'campaigns') {
      setActiveTab('campaigns');
    } else {
      showToast(`Opening ${item.label}...`);
    }
  }

  function handleLaunchCampaign() {
    if (!isConnected) {
      showToast('Connect WhatsApp First');
      return;
    }
    setActiveTab('campaigns');
  }

  function handleDisconnect() {
    Alert.alert(
      'Disconnect WhatsApp?',
      'This will disconnect your WhatsApp Business account. You can reconnect anytime.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Disconnect', style: 'destructive', onPress: () => showToast('Account disconnected')},
      ],
    );
  }

  const campaignBtnColors = !hasCampaigns
    ? [COLORS.primary, COLORS.primaryDark]
    : [COLORS.success, COLORS.successDark];

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ─── Hero Header ─────────────────────────── */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.hero}>

          {/* Top row */}
          <View style={styles.heroTopRow}>
            {/* Back chip */}
            <TouchableOpacity
              style={styles.backChip}
              onPress={() => navigation && navigation.goBack && navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="arrow-back" size={12} color="#fff" style={{marginRight: 4}} />
              <Text style={styles.backChipText}>MARKETINGKART</Text>
            </TouchableOpacity>

            {/* Bell */}
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
              <Icon name="notifications-outline" size={22} color="#fff" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* WA Status row */}
          <View style={styles.waStatusRow}>
            <View
              style={[
                styles.waDot,
                {backgroundColor: isConnected ? COLORS.waGreen : COLORS.warning},
              ]}
            />
            <Text style={styles.waStatusText}>
              WhatsApp Business{' '}
              <Text style={{color: isConnected ? COLORS.waGreen : COLORS.warning}}>
                {isConnected ? 'Active' : 'Not Connected'}
              </Text>
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.heroTitle}>Marketing</Text>
          <Text style={styles.heroSubtitle}>Dashboard</Text>

          {/* Glass stats */}
          <DashboardStats
            totalContacts={stats.totalLeads}
            messagesSent={stats.messagesSent}
            deliveryRate={stats.deliveryRate}
          />
        </LinearGradient>

        {/* ─── Body ────────────────────────────────── */}
        <View style={styles.body}>

          {/* Connection Card */}
          {isConnected ? (
            <View style={[styles.connectionCard, {backgroundColor: COLORS.successBg}]}>
              <View style={styles.connectionCardTop}>
                <View style={styles.waIconCircle}>
                  <Icon name="logo-whatsapp" size={22} color={COLORS.waGreenSend} />
                </View>
                <View style={{flex: 1, marginLeft: 10}}>
                  <View style={styles.activePillRow}>
                    <View style={styles.activePill}>
                      <View style={styles.activePillDot} />
                      <Text style={styles.activePillText}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.connectionPhone}>{account.phoneNumber}</Text>
                  <Text style={styles.connectionBiz}>{account.businessName}</Text>
                </View>
              </View>
              <View style={styles.connectionActions}>
                <TouchableOpacity
                  style={[styles.connBtn, {borderColor: COLORS.waGreenSend}]}
                  onPress={() => setConnectModalVisible(true)}
                  activeOpacity={0.8}>
                  <Icon name="refresh-outline" size={14} color={COLORS.waGreenSend} style={{marginRight: 5}} />
                  <Text style={[styles.connBtnText, {color: COLORS.waGreenSend}]}>Reconnect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.connBtn, {borderColor: COLORS.error}]}
                  onPress={handleDisconnect}
                  activeOpacity={0.8}>
                  <Icon name="unlink-outline" size={14} color={COLORS.error} style={{marginRight: 5}} />
                  <Text style={[styles.connBtnText, {color: COLORS.error}]}>Disconnect</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[styles.connectionCard, {backgroundColor: COLORS.warningBg}]}>
              <View style={styles.disconnectedTop}>
                <Icon name="warning-outline" size={28} color={COLORS.warning} />
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.disconnectedTitle}>Connect Meta Account</Text>
                  <Text style={styles.disconnectedSub}>
                    Required to launch campaigns and send messages to customers.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => setConnectModalVisible(true)}
                activeOpacity={0.85}>
                <LinearGradient
                  colors={[COLORS.waGreen, COLORS.waGreenDark]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.connectBtnGradient}>
                  <Icon name="logo-whatsapp" size={18} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.connectBtnText}>Connect</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}>
            {QUICK_ACTIONS.map(item => (
              <QuickActionTile
                key={item.id}
                item={item}
                disabled={!isConnected}
                onPress={() => handleQuickAction(item)}
              />
            ))}
          </ScrollView>

          {/* Launch Campaign CTA */}
          <TouchableOpacity
            style={[styles.launchBtn, !isConnected && {opacity: 0.72}]}
            onPress={handleLaunchCampaign}
            activeOpacity={0.85}>
            <LinearGradient
              colors={campaignBtnColors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.launchBtnGradient}>
              <Text style={styles.launchBtnText}>
                {hasCampaigns ? '📊 Manage Campaigns →' : '🚀 Launch Campaign →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Recent Campaigns */}
          <View style={[styles.sectionHeader, {marginTop: 4}]}>
            <Text style={styles.sectionTitle}>Recent Campaigns</Text>
            <TouchableOpacity onPress={() => setActiveTab('campaigns')} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentCampaigns.length === 0 ? (
            <View style={styles.emptyCard}>
              <Icon name="paper-plane-outline" size={36} color={COLORS.textInactive} />
              <Text style={styles.emptyText}>No campaigns yet</Text>
              <Text style={styles.emptySubText}>Launch your first campaign above</Text>
            </View>
          ) : (
            recentCampaigns.map(c => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onPress={() => setActiveTab('campaigns')}
              />
            ))
          )}

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsIconWrap}>
              <Text style={styles.tipsEmoji}>💡</Text>
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.tipsTitle}>Pro Tip</Text>
              <Text style={styles.tipsBody}>
                In your Excel/CSV file, make sure the phone number column is named{' '}
                <Text style={{fontFamily: FONTS.semiBold}}>"phone"</Text>. Map template variables like{' '}
                <Text style={{fontFamily: FONTS.semiBold}}>{'{{1}}'}</Text> to Name,{' '}
                <Text style={{fontFamily: FONTS.semiBold}}>{'{{2}}'}</Text> to Phone, etc.
              </Text>
            </View>
          </View>

          <View style={{height: 100}} />
        </View>
      </ScrollView>

      {/* Connect Modal */}
      <ConnectWhatsAppModal
        visible={connectModalVisible}
        onClose={() => setConnectModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.pageBg},
  scroll: {flex: 1},
  scrollContent: {flexGrow: 1},

  // Hero
  hero: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  backChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  backChipText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: '#fff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.waGreen,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  waStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  waDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  waStatusText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  heroTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h1,
    color: '#fff',
    paddingHorizontal: 20,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.title,
    color: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 20,
  },

  // Body
  body: {paddingHorizontal: 16, paddingTop: 20},

  // Connection Card
  connectionCard: {
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...SHADOWS.sm,
  },
  connectionCardTop: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  waIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.successBg,
    borderWidth: 2,
    borderColor: COLORS.waGreenSend + '44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePillRow: {flexDirection: 'row', marginBottom: 3},
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.waGreenSend + '22',
    borderColor: COLORS.waGreenSend + '55',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
  },
  activePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.waGreenSend,
    marginRight: 4,
  },
  activePillText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.waGreenSend,
    letterSpacing: 0.8,
  },
  connectionPhone: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textTitle,
    marginTop: 2,
  },
  connectionBiz: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  connectionActions: {flexDirection: 'row', gap: 10},
  connBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  connBtnText: {fontFamily: FONTS.semiBold, fontSize: 13},

  // Disconnected
  disconnectedTop: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14},
  disconnectedTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.subtitle,
    color: COLORS.textTitle,
    marginBottom: 3,
  },
  disconnectedSub: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  connectBtn: {borderRadius: SIZES.radiusMd, overflow: 'hidden'},
  connectBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  connectBtnText: {fontFamily: FONTS.bold, fontSize: SIZES.body, color: '#fff'},

  // Quick Actions
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.subtitle,
    color: COLORS.textTitle,
  },
  viewAllText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.primary,
  },
  quickActionsScroll: {paddingBottom: 4, paddingLeft: 2},

  // Launch CTA
  launchBtn: {borderRadius: SIZES.radiusMd, overflow: 'hidden', marginBottom: 20},
  launchBtnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchBtnText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.bodyLg,
    color: '#fff',
    letterSpacing: 0.3,
  },

  // Empty
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 28,
    alignItems: 'center',
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  emptyText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    marginTop: 10,
  },
  emptySubText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textInactive,
    marginTop: 4,
  },

  // Tips
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warningBg,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.warning + '33',
  },
  tipsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.warning + '22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsEmoji: {fontSize: 18},
  tipsTitle: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.warningDark,
    marginBottom: 3,
  },
  tipsBody: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
