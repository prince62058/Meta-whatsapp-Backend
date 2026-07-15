import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../theme';
import {getAdStatusColor, getCampaignStatusColor} from '../../utils/helpers';

export default function StatusBadge({status, type = 'ad', style}) {
  const color =
    type === 'ad' ? getAdStatusColor(status) : getCampaignStatusColor(status);
  const label = status?.replace(/_/g, ' ') || 'UNKNOWN';

  return (
    <View style={[styles.badge, {backgroundColor: color + '22', borderColor: color + '66'}, style]}>
      <View style={[styles.dot, {backgroundColor: color}]} />
      <Text style={[styles.label, {color}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
  },
  dot: {width: 6, height: 6, borderRadius: 3, marginRight: 5},
  label: {
    fontSize: SIZES.caption,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
