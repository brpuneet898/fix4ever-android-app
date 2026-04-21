import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MobileLaptop from '../../assets/icons/mobile-laptop.svg';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Button } from '../../core/components';
import { useTheme } from '../../core/theme';

import type { User } from '../../core/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@fix4ever/auth_user';

import AuthStack from '../auth';


import {
  hasCompletedOnboarding,
  setOnboardingCompleted,
  getStoredUser,
  setAuth,
  clearAuth,
} from '../../core/storage';

import { AppBar } from '../../core/components';
import { useAuth } from '../../lib/contexts/auth-context';


type MainTabParamList = {
  Home: undefined;
  Requests: undefined;
  Create: undefined;
  Tracker: undefined;
  Drafts: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Auth: { screen: 'Login' | 'Signup' | 'Account' | 'ResetPassword' | 'GoogleOAuth' };
  ServiceRequestStack: { draftId?: string } | undefined;
  ServiceRequestDetails: { requestId: string };
  CreateServiceRequestScreen: undefined;
};

type HomeScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export function HomeScreen( { navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, borderRadius, typography, isDark } = useTheme();

  const {  isLoadingUser,user, setUser, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  const fonts = {
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semibold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
  } as const;

  const brandBlue = '#01325D';
  const primaryBlue = isDark ? '#1C4E7E' : brandBlue;
  const headingColor = isDark ? '#F3F7FF' : '#082C50';
  const mutedText = isDark ? '#D0D8E5' : '#3A3A3A';
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if(!isLoadingUser){
      console.log(user);
    }
  }, [isLoadingUser,mounted]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scroll: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        scrollContent: {
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
          alignItems: 'center',
          position: 'relative',
        },
        illustrationBehind: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -80,
          alignItems: 'center',
          opacity: isDark ? 0.5 : 0.7, // Increased opacity for better visibility
        },
        hero: {
          alignItems: 'center',
          paddingTop: spacing.xl,
          paddingBottom: spacing.md,
          width: '100%',
        },
        logoCircle: {
          width: 120,
          height: 120,
          borderRadius: 60,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.lg,
          shadowColor: '#000000',
          shadowOpacity: 0.24,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        },
        logoClip: {
          width: 120,
          height: 120,
          borderRadius: 60,
          overflow: 'hidden',
          backgroundColor: brandBlue,
          alignItems: 'center',
          justifyContent: 'center',
        },
        logoImage: {
          width: 140,
          height: 140,
        },
        brand: {
          fontSize: 36,
          lineHeight: 44,
          letterSpacing: -1,
          fontFamily: fonts.bold,
          color: headingColor,
          marginBottom: spacing.md,
          textAlign: 'center',
        },
        heroHeadline: {
          fontSize: 24,
          lineHeight: 32,
          fontFamily: fonts.bold,
          color: headingColor,
          textAlign: 'center',
          marginBottom: spacing.sm,
          maxWidth: 320,
        },
        heroSubtext: {
          fontSize: 14,
          lineHeight: 22,
          color: mutedText,
          textAlign: 'center',
          fontFamily: fonts.medium,
          marginBottom: spacing.lg,
          maxWidth: 300,
        },
        processIconsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.lg,
        },
        processIconCircle: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: brandBlue,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: isDark ? '#242D3B' : '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        },
        overlappingIcon: {
          marginLeft: -12,
        },
        heroBadge: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
          paddingHorizontal: spacing.md,
          paddingVertical: 10,
          borderRadius: borderRadius.full,
          marginBottom: spacing.xl,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
        },
        heroBadgeText: {
          fontFamily: fonts.medium,
          color: mutedText,
          fontSize: 14,
          letterSpacing: 0.2,
        },
        ctaSection: {
          alignItems: 'center',
          width: '100%',
          maxWidth: 360,
          marginBottom: spacing.xxl,
        },
        primaryCta: { 
          borderRadius: 12,
          width: '100%',
          minHeight: 56,
          backgroundColor: primaryBlue,
          shadowColor: '#000000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        },
        primaryCtaText: {
          fontFamily: fonts.semibold,
          fontSize: 17,
          color: '#FFFFFF',
        },
        footer: { alignItems: 'center' },
        footerText: {
          fontSize: 12,
          fontFamily: fonts.medium,
          color: mutedText,
        },
      }),
    [colors, spacing, borderRadius, typography, isDark, primaryBlue, headingColor, mutedText, fonts]
  );

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: isDark ? '#242D3B' : '#FFFFFF' }}>
        <AppBar 
          isLoggedIn={!!user}
          user={user}
          onLoginPress={() => navigation.navigate('Auth', { screen: 'Login' })} 
          onSignupPress={() => navigation.navigate('Auth', { screen: 'Signup' })}
          onProfilePress={() => navigation.navigate('Auth', { screen: 'Account' })} 
          onNotificationsPress={() =>
            Alert.alert(
              'Notifications',
              'Your notifications will appear here soon.'
            )
          }
          onLogoutPress={handleLogout}
          onOpenTerms={() =>
            Alert.alert(
              'Terms & policies',
              'Link to detailed terms and privacy policy will go here.'
            )
          }
        />
      <View style={{ flex: 1, position: 'relative' }}>
        {/* Background Illustration - Fixed at bottom */}
        <View style={styles.illustrationBehind} pointerEvents="none">
          <MobileLaptop width={600} height={220} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          showsVerticalScrollIndicator={false}
        >

        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <View style={styles.logoClip}>
              <Image
                source={require('../../assets/icons/blue-icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
          
          <Text style={styles.brand}>fix4ever</Text>
          
          <Text style={styles.heroHeadline}>
            Getting Your Device Fixed{'\n'}Is Easier Than Ever!
          </Text>
          
          <Text style={styles.heroSubtext}>
            Our seamless process connects you with expert technicians in just minutes.
          </Text>

          <View style={styles.processIconsRow}>
            <View style={styles.processIconCircle}>
              <Icon name="tool" size={22} color="#FFFFFF" />
            </View>
            <View style={[styles.processIconCircle, styles.overlappingIcon, { overflow: 'hidden' }]}>
              <Image 
                source={require('../../assets/icons/blue-icon.png')} 
                style={{ width: '103%', height: '103%' }}
                resizeMode="contain"
              />
            </View>
            <View style={[styles.processIconCircle, styles.overlappingIcon]}>
              <Icon name="user" size={22} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Simple Process</Text>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Button
            title="Create Service Request"
            onPress={() => navigation.navigate('ServiceRequestStack')}
            variant="primary"
            style={styles.primaryCta}
            textStyle={styles.primaryCtaText}
          />
          {!user && (
            <TouchableOpacity
              style={{ marginTop: spacing.lg }}
              onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
              activeOpacity={0.7}
            >
              <Text style={{ fontFamily: fonts.semibold, color: colors.primary, fontSize: 15 }}>
                I already have an account
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      </View>
      </View>
    </SafeAreaProvider>
  );
}
