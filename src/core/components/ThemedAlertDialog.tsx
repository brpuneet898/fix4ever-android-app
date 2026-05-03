import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../theme';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

type AlertButton = {
  text: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
};

type ThemedAlertDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  variant?: AlertVariant;
  buttons?: AlertButton[];
  onDismiss: () => void;
};

const iconForVariant: Record<AlertVariant, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'x-circle',
};

export function ThemedAlertDialog({
  visible,
  title,
  message,
  variant = 'info',
  buttons,
  onDismiss,
}: ThemedAlertDialogProps) {
  const { colors, spacing, borderRadius } = useTheme();

  const buttonList = buttons && buttons.length > 0
    ? buttons
    : [{ text: 'OK', onPress: onDismiss, variant: 'primary' as const }];

  const accentColor =
    variant === 'success'
      ? colors.success
      : variant === 'warning'
        ? colors.warning
        : variant === 'error'
          ? colors.destructive
          : colors.primary;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={[styles.overlay, { backgroundColor: 'rgba(15, 23, 42, 0.55)' }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
            },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18` }]}>
            <Feather name={iconForVariant[variant]} size={24} color={accentColor} />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.mutedForeground }]}>{message}</Text>

          <View style={styles.buttonRow}>
            {buttonList.map((button, index) => {
              const isPrimary = (button.variant || 'primary') === 'primary';
              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  style={[
                    styles.button,
                    {
                      backgroundColor: isPrimary ? colors.primary : colors.background,
                      borderColor: isPrimary ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    button.onPress?.();
                    onDismiss();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: isPrimary ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  } as ViewStyle,
  card: {
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  } as ViewStyle,
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  } as TextStyle,
  message: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  } as TextStyle,
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
  } as ViewStyle,
  button: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  } as TextStyle,
});
