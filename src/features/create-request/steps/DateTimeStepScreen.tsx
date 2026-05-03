import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../core/theme';
import UserDateTimeSelector from './UserDateTimeSelector';

import { FormData  } from '../ServiceRequestStack';

interface DateTimeStepScreenProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export function DateTimeStepScreen({
  formData,
  updateFormData,
  errors,
  onNext,
  onBack,
}: DateTimeStepScreenProps) {
  const { colors, spacing, typography } = useTheme();

  const handleDateSlotSelect = (dateValue: string, slotValue: string) => {
    console.log('dateValue', dateValue);
    console.log('slotValue', slotValue);
    updateFormData('preferredDate', dateValue);
    updateFormData('preferredTime', slotValue);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    scroll: {
      flex: 1,
    } as ViewStyle,
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.xxl,
    } as ViewStyle,
    section: {
      marginBottom: spacing.lg,
    } as ViewStyle,
    introCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: spacing.md,
      marginBottom: spacing.lg,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    } as ViewStyle,
    introTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.foreground,
      marginBottom: 4,
    } as TextStyle,
    introText: {
      fontSize: 14,
      color: colors.mutedForeground,
      lineHeight: 20,
    } as TextStyle,
  });

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>Choose a convenient slot</Text>
        <Text style={styles.introText}>
          Pick the time window that works best and we’ll keep the rest of the request aligned with it.
        </Text>
      </View>

      <View style={styles.section}>
        <UserDateTimeSelector
          preferredDate={formData.preferredDate || undefined}
          preferredTime={formData.preferredTime || undefined}
          onDateSlotSelect={handleDateSlotSelect}
          error={errors.preferredDate || errors.preferredTime}
          preferredDateError={errors.preferredDate}
          preferredTimeError={errors.preferredTime}
        />
      </View>
    </ScrollView>
  );
}
