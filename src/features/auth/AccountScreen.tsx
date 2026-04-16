import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../core/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../lib/contexts/auth-context';

type AccountScreenProps = {
  onLogout: () => void;
};

const fonts = {
  regular: 'Montserrat-Regular',
  medium: 'Montserrat-Medium',
  semibold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
} as const;

export function AccountScreen({ onLogout }: AccountScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, isDark } = useTheme();
  const {user } = useAuth();

  const profileCardColor = isDark ? '#08244A' : '#043063';
  const pageSubtle = isDark ? colors.textMuted : '#2E2E2E';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: insets.bottom + spacing.xl,
      alignItems: 'center',
    },
    logoCircle: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: profileCardColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 6,
    },
    logoText: {
      fontSize: 58,
      color: '#FFFFFF',
      letterSpacing: -2.3,
      fontFamily: fonts.bold,
    },
    title: {
      fontSize: 48,
      lineHeight: 48,
      letterSpacing: -2.4,
      fontFamily: fonts.bold,
      color: isDark ? colors.foreground : '#082c50',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 20,
      letterSpacing: -0.18,
      color: pageSubtle,
      fontFamily: fonts.medium,
      marginBottom: 22,
    },
    card: {
      width: 336,
      height: 232,
      backgroundColor: profileCardColor,
      paddingHorizontal: 28,
      paddingVertical: 26,
      borderRadius: 16,
      marginBottom: 22,
      alignSelf: 'center',
      shadowColor: '#000000',
      shadowOpacity: isDark ? 0.28 : 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 7,
      justifyContent: 'center',
    },
    row: { marginBottom: 22 },
    label: {
      fontSize: 15,
      lineHeight: 20,
      color: '#D8E2F0',
      fontFamily: fonts.medium,
      marginBottom: 6,
    },
    value: {
      fontSize: 18,
      lineHeight: 24,
      color: '#FFFFFF',
      fontFamily: fonts.medium,
    },
    logoutButton: {
      width: 336,
      height: 52,
      backgroundColor: profileCardColor,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22,
      alignSelf: 'center',
      shadowColor: '#000000',
      shadowOpacity: isDark ? 0.22 : 0.16,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    },
    logoutText: {
      fontSize: 16,
      lineHeight: 18,
      color: '#FFFFFF',
      fontFamily: fonts.medium,
    },
    illustrationWrap: {
      width: '100%',
      alignItems: 'center',
      marginTop: spacing.xs,
      opacity: isDark ? 0.45 : 0.7,
    },
    illustrationCloud: {
      width: 250,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark ? '#1B2E48' : '#E8F0FA',
      position: 'absolute',
      bottom: 0,
    },
    deviceRow: {
      width: 228,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingBottom: 14,
    },
    deviceColor: {
      color: isDark ? '#B9C7D8' : '#AAB8C8',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>fx</Text>
        </View>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Your personal details</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user?.username || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email || '-'}</Text>
          </View>
          {user?.phone ? (
            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity onPress={onLogout} activeOpacity={0.85} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
        <View style={styles.illustrationWrap}>
          <View style={styles.illustrationCloud} />
          <View style={styles.deviceRow}>
            <Icon name="smartphone" size={48} style={styles.deviceColor} />
            <Icon name="monitor" size={90} style={styles.deviceColor} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
