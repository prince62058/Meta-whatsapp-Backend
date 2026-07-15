// ============================================================
// MarketingKart.ai — WhatsApp CRM Inbox (ChatScreen)
// ============================================================
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {ChatSkeletonRow} from '../../../components/common/SkeletonCard';
import {MOCK_CONVERSATIONS} from '../../../utils/mockData';

function getInitials(name) {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

function formatTime(time) {
  return time;
}

function ConversationRow({item, onPress}) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.75}>
      <View style={[styles.avatar, {backgroundColor: item.avatarColor}]}>
        <Text style={styles.avatarText}>{getInitials(item.customerName)}</Text>
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.nameText} numberOfLines={1}>{item.customerName}</Text>
          <Text style={styles.timeText}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        <View style={styles.rowBottom}>
          <Text style={styles.phoneText} numberOfLines={1}>
            {item.customerPhone}
          </Text>
        </View>
        <View style={styles.rowMeta}>
          <Text style={styles.previewText} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChatScreen({navigation, setActiveTab}) {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const filtered = searchQuery.trim()
    ? conversations.filter(
        c =>
          c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.customerPhone.includes(searchQuery),
      )
    : conversations;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setConversations([...MOCK_CONVERSATIONS]);
      setRefreshing(false);
    }, 1200);
  }, []);

  const handleConversationPress = useCallback(
    item => {
      navigation.navigate('ChatThread', {
        conversationId: item.id,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
      });
    },
    [navigation],
  );

  const renderSkeleton = () => (
    <View>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <ChatSkeletonRow key={i} />
      ))}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubbles-outline" size={64} color={COLORS.primaryLight} />
      </View>
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>
        Start a WhatsApp campaign to see customer replies here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>WhatsApp CRM</Text>
          {totalUnread > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => {
            setSearchVisible(v => !v);
            setSearchQuery('');
          }}>
          <Ionicons
            name={searchVisible ? 'close' : 'search'}
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {searchVisible && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or phone..."
            placeholderTextColor={COLORS.textInactive}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Content */}
      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ConversationRow item={item} onPress={handleConversationPress} />
          )}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={filtered.length === 0 ? {flex: 1} : {paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerLeft: {flexDirection: 'row', alignItems: 'center', gap: 8},
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.title,
    color: COLORS.white,
  },
  headerBadge: {
    backgroundColor: COLORS.waGreen,
    borderRadius: SIZES.radiusFull,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.white,
  },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.lg,
    marginBottom: 8,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...SHADOWS.sm,
  },
  searchIcon: {marginRight: 8},
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textBody,
    paddingVertical: 0,
  },
  divider: {height: 1, backgroundColor: 'rgba(255,255,255,0.15)'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.lg,
    paddingVertical: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.subtitle,
    color: COLORS.white,
  },
  rowBody: {flex: 1},
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.bodyLg,
    color: COLORS.textTitle,
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
  },
  rowBottom: {marginBottom: 3},
  phoneText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textMuted,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: COLORS.waGreen,
    borderRadius: SIZES.radiusFull,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.white,
  },
  separator: {height: 1, backgroundColor: COLORS.pageBg, marginLeft: 76},
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: COLORS.white,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.subtitle,
    color: COLORS.textTitle,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
