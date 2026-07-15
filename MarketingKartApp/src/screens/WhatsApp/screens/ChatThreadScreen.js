// ============================================================
// MarketingKart.ai — WhatsApp Chat Thread
// ============================================================
import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';
import {MOCK_MESSAGES} from '../../../utils/mockData';

function TickIcon({status}) {
  if (status === 'sent') {
    return <Text style={styles.tickGray}>✓</Text>;
  }
  if (status === 'delivered') {
    return <Text style={styles.tickGray}>✓✓</Text>;
  }
  if (status === 'read') {
    return <Text style={styles.tickBlue}>✓✓</Text>;
  }
  return null;
}

function MessageBubble({item}) {
  const isOut = item.type === 'outbound';
  return (
    <View style={[styles.bubbleWrapper, isOut ? styles.bubbleRight : styles.bubbleLeft]}>
      <View style={[styles.bubble, isOut ? styles.bubbleOut : styles.bubbleIn]}>
        <Text style={styles.bubbleText}>{item.text}</Text>
        <View style={styles.bubbleMeta}>
          <Text style={styles.bubbleTime}>{item.time}</Text>
          {isOut && <TickIcon status={item.status} />}
        </View>
      </View>
    </View>
  );
}

export default function ChatThreadScreen({route, navigation}) {
  const {customerName, customerPhone} = route.params || {};
  const [messages, setMessages] = useState([...MOCK_MESSAGES].reverse());
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg = {
      id: String(Date.now()),
      type: 'outbound',
      text,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      status: 'sent',
    };
    setMessages(prev => [newMsg, ...prev]);
    setInputText('');
  }, [inputText]);

  const handleMenu = () => {
    Alert.alert('Options', '', [
      {text: 'View Contact', onPress: () => {}},
      {text: 'Clear Chat', onPress: () => setMessages([])},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.waHeader} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {customerName
                ? customerName
                    .trim()
                    .split(' ')
                    .map(p => p[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'C'}
            </Text>
          </View>
          <View>
            <Text style={styles.headerName} numberOfLines={1}>
              {customerName || 'Customer'}
            </Text>
            <Text style={styles.headerPhone}>{customerPhone || ''}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuBtn} onPress={handleMenu}>
          <Ionicons name="ellipsis-vertical" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        {/* Chat area */}
        <View style={styles.chatArea}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({item}) => <MessageBubble item={item} />}
            inverted
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Composer */}
        <View style={styles.composer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add-circle-outline" size={26} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TextInput
            style={styles.composerInput}
            placeholder="Message (within 24hrs)..."
            placeholderTextColor={COLORS.textInactive}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={4096}
          />
          <TouchableOpacity
            style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : styles.sendBtnIdle]}
            onPress={handleSend}
            disabled={!inputText.trim()}>
            <Ionicons name="send" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.waHeader},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.waHeader,
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 8,
  },
  backBtn: {padding: 6},
  headerCenter: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10},
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {fontFamily: FONTS.bold, fontSize: 14, color: COLORS.white},
  headerName: {fontFamily: FONTS.semiBold, fontSize: SIZES.bodyLg, color: COLORS.white},
  headerPhone: {fontFamily: FONTS.regular, fontSize: SIZES.small, color: 'rgba(255,255,255,0.75)'},
  menuBtn: {padding: 6},
  chatArea: {flex: 1, backgroundColor: COLORS.waWallpaper},
  chatContent: {paddingHorizontal: 12, paddingVertical: 12},
  bubbleWrapper: {marginVertical: 3, maxWidth: '80%'},
  bubbleLeft: {alignSelf: 'flex-start'},
  bubbleRight: {alignSelf: 'flex-end'},
  bubble: {borderRadius: 12, padding: 10, paddingBottom: 6},
  bubbleIn: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 0,
    ...SHADOWS.sm,
  },
  bubbleOut: {
    backgroundColor: COLORS.waBubbleOut,
    borderTopRightRadius: 0,
    ...SHADOWS.sm,
  },
  bubbleText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textBody,
    lineHeight: 20,
  },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTime: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  tickGray: {fontSize: 11, color: COLORS.textMuted},
  tickBlue: {fontSize: 11, color: COLORS.waBlueTick},
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.pageBg,
  },
  attachBtn: {paddingBottom: 4},
  composerInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.textBody,
    backgroundColor: COLORS.pageBg,
    borderRadius: SIZES.radiusLg,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.pageBg,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {backgroundColor: COLORS.waGreenSend},
  sendBtnIdle: {backgroundColor: COLORS.lightGray},
});
