import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../theme';

function SkeletonBox({width, height, style, borderRadius = 8}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {toValue: 1, duration: 800, useNativeDriver: true}),
        Animated.timing(opacity, {toValue: 0.4, duration: 800, useNativeDriver: true}),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {width, height, backgroundColor: '#e3e3e3', borderRadius, opacity},
        style,
      ]}
    />
  );
}

export function AdSkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonBox width="100%" height={180} borderRadius={12} />
      <View style={styles.row}>
        <SkeletonBox width={80} height={14} style={{marginTop: 12}} />
        <SkeletonBox width={60} height={22} borderRadius={11} style={{marginTop: 8}} />
      </View>
      <View style={styles.kpiRow}>
        {[0, 1, 2, 3].map(i => (
          <SkeletonBox key={i} width={55} height={30} borderRadius={6} />
        ))}
      </View>
    </View>
  );
}

export function CampaignSkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <SkeletonBox width={140} height={16} />
        <SkeletonBox width={70} height={22} borderRadius={11} />
      </View>
      <SkeletonBox width={100} height={12} style={{marginTop: 8}} />
      <View style={styles.kpiRow}>
        {[0, 1, 2].map(i => (
          <SkeletonBox key={i} width={70} height={28} borderRadius={6} />
        ))}
      </View>
    </View>
  );
}

export function ChatSkeletonRow() {
  return (
    <View style={styles.chatRow}>
      <SkeletonBox width={44} height={44} borderRadius={22} />
      <View style={{flex: 1, marginLeft: 12}}>
        <SkeletonBox width={120} height={14} />
        <SkeletonBox width="80%" height={12} style={{marginTop: 6}} />
      </View>
      <SkeletonBox width={40} height={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  kpiRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 12},
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
});
