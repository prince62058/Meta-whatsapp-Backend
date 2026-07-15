// ============================================================
// MarketingKart.ai — WhatsApp Module Shell
// ============================================================
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {BottomFabBar} from 'rn-wave-bottom-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, SIZES, SHADOWS} from '../../theme';

import DashboardScreen from './screens/DashboardScreen';
import ChatScreen from './screens/ChatScreen';
import WalletScreen from './screens/WalletScreen';
import ProfileScreen from './screens/ProfileScreen';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const TABS = [
  {id: 'dashboard', label: 'Home', icon: 'home', outlineIcon: 'home-outline'},
  {id: 'chat', label: 'Inbox', icon: 'chatbubble-ellipses', outlineIcon: 'chatbubble-ellipses-outline'},
  {id: 'wallet', label: 'Wallet', icon: 'wallet', outlineIcon: 'wallet-outline'},
  {id: 'profile', label: 'Settings', icon: 'settings', outlineIcon: 'settings-outline'},
];

export default function WhatsAppShell({navigation}) {
  const [splashVisible, setSplashVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const splashOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // FAB drag position
  const fabPan = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const fabBase = useRef({x: SCREEN_WIDTH - 74, y: SCREEN_HEIGHT - 160}).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setSplashVisible(false));
    }, 1500);
    return () => clearTimeout(timer);
  }, [splashOpacity, contentOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        fabPan.setOffset({x: fabPan.x._value, y: fabPan.y._value});
        fabPan.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [null, {dx: fabPan.x, dy: fabPan.y}],
        {useNativeDriver: false},
      ),
      onPanResponderRelease: (_, gesture) => {
        fabPan.flattenOffset();
        // Clamp within screen bounds
        const newX = Math.max(0, Math.min(SCREEN_WIDTH - 54, fabBase.x + fabPan.x._value));
        const newY = Math.max(60, Math.min(SCREEN_HEIGHT - 160, fabBase.y + fabPan.y._value));
        fabBase.x = newX - (SCREEN_WIDTH - 74);
        fabBase.y = newY - (SCREEN_HEIGHT - 160);
      },
    }),
  ).current;

  function renderActiveScreen() {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen setActiveTab={setActiveTab} navigation={navigation} />;
      case 'chat':
        return <ChatScreen setActiveTab={setActiveTab} navigation={navigation} />;
      case 'wallet':
        return <WalletScreen navigation={navigation} />;
      case 'profile':
        return <ProfileScreen setActiveTab={setActiveTab} navigation={navigation} />;
      default:
        return <DashboardScreen setActiveTab={setActiveTab} navigation={navigation} />;
    }
  }

  const tabItems = TABS.map(tab => ({
    id: tab.id,
    activeIcon: (
      <Icon name={tab.icon} size={24} color={COLORS.primary} />
    ),
    inactiveIcon: (
      <Icon name={tab.outlineIcon} size={24} color={COLORS.textInactive} />
    ),
    label: tab.label,
  }));

  const activeTabIndex = TABS.findIndex(t => t.id === activeTab);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Main Content */}
      <Animated.View style={[styles.contentWrap, {opacity: contentOpacity}]}>
        <View style={styles.screenArea}>{renderActiveScreen()}</View>

        {/* Wave Bottom Nav */}
        <BottomFabBar
          mode="default"
          selectedIndex={activeTabIndex < 0 ? 0 : activeTabIndex}
          onChange={index => setActiveTab(TABS[index].id)}
          items={tabItems}
          activeTintColor={COLORS.primary}
          inactiveTintColor={COLORS.textInactive}
          barStyle={styles.bottomBar}
          activeTabStyle={styles.activeTabStyle}
          dotStyle={{backgroundColor: COLORS.primary}}
          focusedButtonStyle={styles.focusedBtn}
          labelStyle={styles.navLabel}
          activeLabelStyle={styles.activeNavLabel}
          barHeight={64}
          bottomPadding={Platform.OS === 'ios' ? 20 : 8}
        />
      </Animated.View>

      {/* Splash */}
      {splashVisible && (
        <Animated.View style={[styles.splash, {opacity: splashOpacity}]}>
          {/* Back chip */}
          <TouchableOpacity
            style={styles.backChip}
            onPress={() => navigation && navigation.goBack && navigation.goBack()}>
            <Icon name="arrow-back" size={14} color="#fff" style={{marginRight: 4}} />
            <Text style={styles.backChipText}>Back to MarketingKart</Text>
          </TouchableOpacity>

          {/* Centered logo */}
          <View style={styles.splashCenter}>
            <View style={styles.splashLogoBox}>
              <Text style={styles.splashLogoMk}>Marketing</Text>
              <Text style={styles.splashLogoKart}>Kart</Text>
              <Text style={styles.splashLogoAi}>.ai</Text>
            </View>
            <Text style={styles.splashTagline}>WhatsApp Marketing</Text>
          </View>
        </Animated.View>
      )}

      {/* Draggable Help FAB */}
      {!splashVisible && activeTab !== 'help-support' && (
        <Animated.View
          style={[
            styles.fab,
            {
              transform: fabPan.getTranslateTransform(),
              bottom: 90,
              right: 20,
            },
          ]}
          {...panResponder.panHandlers}>
          <TouchableOpacity
            style={styles.fabInner}
            onPress={() => setActiveTab('help-support')}
            activeOpacity={0.85}>
            <Icon name="headset" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  contentWrap: {
    flex: 1,
  },
  screenArea: {
    flex: 1,
  },
  // Splash
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  backChip: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: SIZES.radiusFull,
  },
  backChipText: {
    color: '#fff',
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    letterSpacing: 0.3,
  },
  splashCenter: {
    alignItems: 'center',
  },
  splashLogoBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  splashLogoMk: {
    fontFamily: FONTS.bold,
    fontSize: 34,
    color: '#fff',
    letterSpacing: -0.5,
  },
  splashLogoKart: {
    fontFamily: FONTS.bold,
    fontSize: 34,
    color: COLORS.waGreen,
    letterSpacing: -0.5,
  },
  splashLogoAi: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  splashTagline: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.subtitle,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  // Bottom Nav
  bottomBar: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.md,
  },
  activeTabStyle: {
    backgroundColor: COLORS.primary + '15',
  },
  focusedBtn: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  navLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textInactive,
  },
  activeNavLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.primary,
  },
  // FAB
  fab: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    zIndex: 200,
    ...SHADOWS.lg,
  },
  fabInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
