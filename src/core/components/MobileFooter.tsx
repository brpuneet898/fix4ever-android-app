import React, { memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../theme';

// --- Types & Constants ---
export type FooterTabId =
  | 'overview'
  | 'requests'
  | 'home'
  | 'tracker'
  | 'create'
  | 'drafts';

interface TabConfig {
  id: FooterTabId;
  icon: string;
  label: string;
}

const TABS: TabConfig[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  // { id: 'overview', icon: 'grid', label: 'Overview' },
  { id: 'requests', icon: 'clipboard', label: 'Requests' },
  { id : 'create', icon : 'plus', label : 'New Request'},
  { id: 'tracker', icon: 'trending-up', label: 'Tracker' },
  { id: 'drafts', icon: 'file-plus', label: 'Drafts' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = SCREEN_WIDTH / TABS.length;

// --- Sub-Component: Individual Tab ---
const TabItem = memo(
  ({
    tab,
    isActive,
    onPress,
    colors,
  }: {
    tab: TabConfig;
    isActive: boolean;
    onPress: () => void;
    colors: any;
  }) => {
    // Use a local animation value for smooth entry/exit
    const animatedValue = React.useRef(
      new Animated.Value(isActive ? 1 : 0)
    ).current;

    React.useEffect(() => {
      Animated.spring(animatedValue, {
        toValue: isActive ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }).start();
    }, [isActive]);

    const animations = useMemo(
      () => ({
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
        glowScale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
        glowOpacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.15],
        }),
        labelY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 0],
        }),
      }),
      [animatedValue]
    );

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.tab}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <View style={styles.tabInner}>
          <Animated.View
            style={[
              styles.glow,
              {
                backgroundColor: colors.primary,
                opacity: animations.glowOpacity,
                transform: [{ scale: animations.glowScale }],
              },
            ]}
          />

          <Animated.View style={{ transform: [{ scale: animations.scale }] }}>
            <Icon
              name={tab.icon}
              size={24}
              color={isActive ? colors.primary : colors.mutedForeground}
            />
          </Animated.View>

          <Animated.Text
            style={[
              styles.label,
              {
                color: isActive ? colors.primary : colors.mutedForeground,
                transform: [{ translateY: animations.labelY }],
              },
            ]}
          >
            {tab.label}
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  }
);

// --- Main Component ---
export function MobileFooter({
  activeTab,
  onTabPress,
}: {
  activeTab: FooterTabId;
  onTabPress: (id: FooterTabId) => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const inactiveColor = isDark ? '#CBD5E1' : colors.mutedForeground;
  const footerBackground = isDark ? '#111B2D' : colors.card;

  // Active Index for the sliding indicator
  const activeIndex = TABS.findIndex(t => t.id === activeTab);
  const indicatorX = React.useRef(new Animated.Value(activeIndex)).current;

  React.useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: activeIndex,
      useNativeDriver: true,
      damping: 20,
      stiffness: 150,
    }).start();
  }, [activeIndex]);

  const translateX = indicatorX.interpolate({
    inputRange: [0, TABS.length - 1],
    outputRange: [0, (TABS.length - 1) * TAB_WIDTH],
  });

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: insets.bottom || 12,
          backgroundColor: footerBackground,
          borderTopColor: colors.border,
        },
      ]}
    >
      {/* Precision Sliding Indicator */}
      <Animated.View
        style={[
          styles.indicatorContainer,
          { width: TAB_WIDTH, transform: [{ translateX }] },
        ]}
      >
        <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
      </Animated.View>

      {TABS.map(tab => (
        <TabItem
          key={tab.id}
          tab={tab}
          colors={colors}
          isActive={activeTab === tab.id}
          onPress={() => onTabPress(tab.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  tab: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center' },
  tabInner: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 50, height: 50, borderRadius: 25 },
  label: { fontSize: 10, fontWeight: '600', marginTop: 4 },
  indicatorContainer: {
    position: 'absolute',
    top: -1, // Sits right on the border
    height: 3,
    alignItems: 'center',
  },
  indicator: {
    width: '60%',
    height: '100%',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
