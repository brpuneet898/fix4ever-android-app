import React, { useMemo } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../features/home';
import { ServiceRequestsScreen } from '../features/service-requests';
import { ServiceRequestDetailsScreen } from '../features/service-requests/ServiceRequestDetailsScreen';
import { CreateRequestScreen } from '../features/create-request';
import { CreateServiceRequestScreen } from '../features/create-request/CreateServiceRequestScreen';
import { TrackerScreen } from '../features/tracker';
import { DraftsScreen } from '../features/drafts';
import AuthStack from '../features/auth';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../core/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ServiceRequestStack } from '../features/create-request/ServiceRequestStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab configuration similar to MobileFooter
const TABS = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'requests', icon: 'clipboard', label: 'Requests' },
  { id: 'create', icon: 'plus', label: 'New Request'},
  { id: 'tracker', icon: 'trending-up', label: 'Tracker' },
  { id: 'drafts', icon: 'file-plus', label: 'Drafts' },
];

// Custom tab component with animations
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: colors.card,
      paddingBottom: insets.bottom,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border
    }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = TABS[index];

        // Animation setup
        const animatedValue = React.useRef(
          new Animated.Value(isFocused ? 1 : 0)
        ).current;

        React.useEffect(() => {
          Animated.spring(animatedValue, {
            toValue: isFocused ? 1 : 0,
            useNativeDriver: true,
            friction: 8,
            tension: 100,
          }).start();
        }, [isFocused]);

        const animations = useMemo(
          () => ({
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2],
            }),
            glowScale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1.4],
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

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}
            activeOpacity={0.7}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  opacity: animations.glowOpacity,
                  transform: [{ scale: animations.glowScale }],
                }}
              />
              
              <Animated.View style={{ transform: [{ scale: animations.scale }] }}>
                <Icon
                  name={tab.icon}
                  size={24}
                  color={isFocused ? colors.primary : colors.mutedForeground}
                />
              </Animated.View>

              <Animated.Text
                style={{
                  fontSize: 11,
                  marginTop: 2,
                  color: isFocused ? colors.primary : colors.mutedForeground,
                  transform: [{ translateY: animations.labelY }],
                }}
              >
                {tab.label}
              </Animated.Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
            tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
            detachInactiveScreens={true} // Optimize performance by detaching inactive screens
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="Requests"
                component={ServiceRequestsScreen}
                options={{
                    tabBarLabel: 'Requests',
                }}
            />
            <Tab.Screen
                name="Create"
                component={CreateRequestScreen}
                options={{
                    tabBarLabel: 'New Request',
                }}
            />
            <Tab.Screen
                name="Tracker"
                component={TrackerScreen}
                options={{
                    tabBarLabel: 'Tracker',
                }}
            />
            <Tab.Screen
                name="Drafts"
                component={DraftsScreen}
                options={{
                    tabBarLabel: 'Drafts',
                }}
            />
        </Tab.Navigator>
    )
}

export default function NavigationTab() {
    const { colors, isDark } = useTheme();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} options={{ navigationBarColor: colors.card }} />
            <Stack.Screen name="ServiceRequestDetails" component={ServiceRequestDetailsScreen} options={{ headerShown: false}} />
            <Stack.Screen 
                name="Auth" 
                component={AuthStack} 
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Login';
                    return {
                        headerShown: false,
                        navigationBarColor: routeName === 'Account' ? (isDark ? '#242D3B' : colors.background) : colors.background,
                    };
                }}
            />
            <Stack.Screen name="CreateServiceRequestScreen" component={CreateServiceRequestScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ServiceRequestStack" component={ServiceRequestStack} options={{ headerShown: false }} />        
        </Stack.Navigator>
    )
}

