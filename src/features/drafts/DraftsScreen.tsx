import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../core/theme';
import { Button } from '../../core/components';
import {
  deleteDraftServiceRequest,
  DraftServiceRequest,
  getMyDraftServiceRequests,
} from '../../core/api';

type DraftCard = {
  id: string;
  title: string;
  brand: string;
  model: string;
  issueType: string;
  description: string;
  completionPercentage: number;
  lastSaved: string;
};


const formatDateTime = (value?: string): string => {
  if (!value) {
    return 'Just now';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const toDraftCard = (draft: DraftServiceRequest): DraftCard => {
  const serverCompletion = Number(draft.completionPercentage);
  const completionPercentage = Math.max(0, Math.min(100, Math.round(serverCompletion)))
  const titleParts = [draft.brand, draft.model].filter(Boolean);
  const title = draft.title || (titleParts.length ? titleParts.join(' ') : 'Untitled Draft');

  return {
    id: draft._id || draft.id || '',
    title,
    brand: draft.brand || '-',
    model: draft.model || '-',
    issueType: draft.problemType || 'Not specified',
    description: draft.problemDescription || 'No description yet',
    completionPercentage,
    lastSaved: formatDateTime(draft.updatedAt || draft.createdAt),
  };
};

export function DraftsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, spacing, typography } = useTheme();
  const [drafts, setDrafts] = useState<DraftCard[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyDraftServiceRequests();
      const rows = response.data?.drafts || response.data?.data?.drafts || [];
      const mapped = Array.isArray(rows)
        ? rows.map(toDraftCard).filter((row) => Boolean(row.id))
        : [];
      setDrafts(mapped);
    } catch {
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDrafts();
    }, [loadDrafts])
  );

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 75) return colors.success;
    if (percentage >= 50) return colors.warning;
    return colors.mutedForeground;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: insets.top + spacing.lg,
      paddingBottom: insets.bottom + spacing.xxl,
    },
    header: {
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.title,
      fontSize: 28,
      color: colors.foreground,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: colors.mutedForeground,
    },
    draftCard: {
      backgroundColor: colors.card,
      padding: spacing.lg,
      borderRadius: 12,
      marginBottom: spacing.md,
      shadowColor: colors.foreground,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    draftHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    draftTitle: {
      ...typography.subtitle,
      color: colors.foreground,
      flex: 1,
      marginRight: spacing.sm,
    },
    completionBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 6,
    },
    completionText: {
      ...typography.caption,
      fontSize: 10,
      fontWeight: '600',
    },
    draftDetails: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    detailLabel: {
      ...typography.bodySmall,
      color: colors.mutedForeground,
    },
    detailValue: {
      ...typography.bodySmall,
      color: colors.foreground,
      fontWeight: '500',
      flex: 1,
      textAlign: 'right',
    },
    description: {
      ...typography.bodySmall,
      color: colors.mutedForeground,
      marginBottom: spacing.md,
      lineHeight: 16,
    },
    draftFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    lastSaved: {
      ...typography.caption,
      color: colors.mutedForeground,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    actionButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 4,
    },
    editButton: {
      backgroundColor: colors.primary + '20',
    },
    deleteButton: {
      backgroundColor: colors.destructive + '20',
    },
    actionText: {
      ...typography.caption,
      fontSize: 10,
      fontWeight: '600',
    },
    editText: {
      color: colors.primary,
    },
    deleteText: {
      color: colors.destructive,
    },
    progressBar: {
      height: 3,
      backgroundColor: colors.border,
      borderRadius: 1.5,
      marginTop: spacing.sm,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 1.5,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xxl,
    },
    emptyTitle: {
      ...typography.subtitle,
      color: colors.foreground,
      marginBottom: spacing.sm,
    },
    emptySubtitle: {
      ...typography.body,
      color: colors.mutedForeground,
      textAlign: 'center',
    },
    createButton: {
      marginBottom: spacing.lg,
    },
  });

  const handleEditDraft = (draftId: string) => {
    if (typeof navigation.push === 'function') {
      navigation.push('ServiceRequestStack', { draftId });
      return;
    }
    navigation.navigate('ServiceRequestStack', { draftId });
  };

  const handleDeleteDraft = (draftId: string) => {
    Alert.alert('Delete Draft', 'Are you sure you want to delete this draft?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const response = await deleteDraftServiceRequest(draftId);
          if (response.data?.success) {
            setDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
            return;
          }
          Alert.alert('Error', response.error?.message || 'Failed to delete draft');
        },
      },
    ]);
  };

  const subtitle = useMemo(() => {
    if (loading) {
      return 'Loading your saved drafts...';
    }
    return 'Continue working on your saved requests';
  }, [loading]);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Drafts</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.createButton}>
          <Button
            title="Create New Request"
            variant="outline"
            onPress={() => {
              navigation.navigate('ServiceRequestStack');
            }}
          />
        </View>

        {drafts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Drafts</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any saved drafts. Start creating a new request and save it as a draft.
            </Text>
          </View>
        ) : (
          drafts.map((draft) => (
            <View key={draft.id} style={styles.draftCard}>
              <View style={styles.draftHeader}>
                <Text style={styles.draftTitle}>{draft.title}</Text>
                <View
                  style={[
                    styles.completionBadge,
                    { backgroundColor: getCompletionColor(draft.completionPercentage) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.completionText,
                      { color: getCompletionColor(draft.completionPercentage) },
                    ]}
                  >
                    {draft.completionPercentage}%
                  </Text>
                </View>
              </View>

              <View style={styles.draftDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Device</Text>
                  <Text style={styles.detailValue}>{draft.brand} {draft.model}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Issue</Text>
                  <Text style={styles.detailValue}>{draft.issueType}</Text>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {draft.description}
              </Text>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${draft.completionPercentage}%`,
                      backgroundColor: getCompletionColor(draft.completionPercentage),
                    },
                  ]}
                />
              </View>

              <View style={styles.draftFooter}>
                <Text style={styles.lastSaved}>Last saved: {draft.lastSaved}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditDraft(draft.id)}
                  >
                    <Text style={[styles.actionText, styles.editText]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteDraft(draft.id)}
                  >
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}
