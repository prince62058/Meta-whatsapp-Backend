// ============================================================
// WhatsAppPreview.js — Realistic WhatsApp phone mock preview
// ============================================================
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../../theme';

function VariableChip({text}) {
  return (
    <Text style={styles.varChip}>{text}</Text>
  );
}

function renderBodyWithVars(body) {
  if (!body) return null;
  const parts = body.split(/({{[^}]+}})/g);
  return (
    <Text style={styles.bubbleBody}>
      {parts.map((part, i) => {
        if (/^{{[^}]+}}$/.test(part)) {
          return (
            <Text key={i} style={styles.varInline}>
              {part}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

function MediaPlaceholder({type}) {
  const config = {
    IMAGE: {icon: 'image-outline', label: 'Image', color: '#34B7F1'},
    VIDEO: {icon: 'videocam-outline', label: 'Video', color: '#8b5cf6'},
    DOCUMENT: {icon: 'document-outline', label: 'Document', color: '#f59e0b'},
  };
  const c = config[type] || config.IMAGE;
  return (
    <View style={[styles.mediaPlaceholder, {borderColor: c.color + '55'}]}>
      <Ionicons name={c.icon} size={32} color={c.color} />
      <Text style={[styles.mediaLabel, {color: c.color}]}>{c.label}</Text>
    </View>
  );
}

export default function WhatsAppPreview({
  headerType = 'NONE',
  headerText = '',
  headerMediaUrl = null,
  bodyText = '',
  footerText = '',
  buttons = [],
}) {
  const isEmpty = !bodyText && headerType === 'NONE' && !headerText;

  return (
    <View style={styles.phoneFrame}>
      {/* WA Header bar */}
      <View style={styles.waHeader}>
        <Ionicons name="arrow-back" size={20} color="#fff" style={{marginRight: 8}} />
        <View style={styles.avatarSmall}>
          <Ionicons name="person" size={14} color="#fff" />
        </View>
        <View style={{flex: 1, marginLeft: 8}}>
          <Text style={styles.waHeaderName}>Business</Text>
          <Text style={styles.waHeaderStatus}>online</Text>
        </View>
        <Ionicons name="videocam-outline" size={20} color="#fff" style={{marginRight: 14}} />
        <Ionicons name="call-outline" size={19} color="#fff" style={{marginRight: 14}} />
        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
      </View>

      {/* Chat area */}
      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}>
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={36} color={COLORS.gray40} />
            <Text style={styles.emptyText}>Start typing to see preview</Text>
          </View>
        ) : (
          <View style={styles.bubbleWrapper}>
            {/* Bubble */}
            <View style={styles.bubble}>
              {/* Header section */}
              {headerType === 'TEXT' && headerText ? (
                <Text style={styles.headerText}>{headerText}</Text>
              ) : headerType === 'IMAGE' ? (
                headerMediaUrl ? (
                  <Image source={{uri: headerMediaUrl}} style={styles.headerImage} />
                ) : (
                  <MediaPlaceholder type="IMAGE" />
                )
              ) : headerType === 'VIDEO' ? (
                <MediaPlaceholder type="VIDEO" />
              ) : headerType === 'DOCUMENT' ? (
                <MediaPlaceholder type="DOCUMENT" />
              ) : null}

              {/* Body */}
              {bodyText ? renderBodyWithVars(bodyText) : (
                <Text style={[styles.bubbleBody, {color: COLORS.textInactive}]}>
                  Your message body will appear here...
                </Text>
              )}

              {/* Footer */}
              {footerText ? (
                <Text style={styles.footerText}>{footerText}</Text>
              ) : null}

              {/* Time + ticks */}
              <View style={styles.timeTick}>
                <Text style={styles.timeText}>10:30 AM</Text>
                <Ionicons name="checkmark-done" size={14} color={COLORS.waBlueTick} style={{marginLeft: 3}} />
              </View>
            </View>

            {/* Action Buttons */}
            {buttons && buttons.length > 0 && (
              <View style={styles.buttonsContainer}>
                {buttons.map((btn, idx) => (
                  <View key={idx} style={styles.actionButton}>
                    <Ionicons
                      name={
                        btn.type === 'CALL'
                          ? 'call-outline'
                          : btn.type === 'URL'
                          ? 'open-outline'
                          : 'return-down-back-outline'
                      }
                      size={14}
                      color={COLORS.waGreenSend}
                      style={{marginRight: 6}}
                    />
                    <Text style={styles.actionButtonText}>{btn.text || 'Button'}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Composer bar */}
      <View style={styles.composerBar}>
        <Ionicons name="happy-outline" size={22} color={COLORS.gray60} />
        <View style={styles.composerInput}>
          <Text style={styles.composerHint}>Message</Text>
        </View>
        <Ionicons name="attach-outline" size={22} color={COLORS.gray60} style={{marginHorizontal: 8}} />
        <View style={styles.sendBtn}>
          <Ionicons name="mic-outline" size={18} color="#fff" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phoneFrame: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.waWallpaper,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  waHeader: {
    backgroundColor: COLORS.waHeader,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingTop: 14,
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waHeaderName: {
    color: '#fff',
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    lineHeight: 17,
  },
  waHeaderStatus: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: FONTS.regular,
    fontSize: 11,
  },
  chatArea: {
    backgroundColor: COLORS.waWallpaper,
    minHeight: 240,
    maxHeight: 290,
  },
  chatContent: {
    padding: 12,
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gray40 + '66',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    marginVertical: 16,
  },
  emptyText: {
    marginTop: 10,
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  bubbleWrapper: {
    alignItems: 'flex-end',
  },
  bubble: {
    backgroundColor: COLORS.waBubbleOut,
    borderRadius: 12,
    borderTopRightRadius: 2,
    padding: 10,
    maxWidth: '88%',
    ...SHADOWS.sm,
  },
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.body,
    color: COLORS.textTitle,
    marginBottom: 6,
  },
  headerImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ccc',
  },
  mediaPlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  mediaLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginTop: 4,
  },
  bubbleBody: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textBody,
    lineHeight: 19,
  },
  varInline: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.info,
    backgroundColor: '#dbeafe',
    borderRadius: 4,
    paddingHorizontal: 3,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  timeTick: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  buttonsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    overflow: 'hidden',
    maxWidth: '88%',
    ...SHADOWS.sm,
    marginTop: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.waGreenSend,
  },
  composerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  composerInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  composerHint: {
    color: COLORS.textInactive,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.waGreenSend,
    alignItems: 'center',
    justifyContent: 'center',
  },
  varChip: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.info,
    backgroundColor: '#dbeafe',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
});
