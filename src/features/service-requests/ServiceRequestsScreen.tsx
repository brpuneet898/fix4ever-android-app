import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../core/theme';
import { Button, ServiceRequestTimer } from '../../core/components';
import { useFocusEffect } from '@react-navigation/native';

import { getStoredToken } from '../../core/storage';
import { requestWithAuth } from '../../core/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../home/HomeScreen';


export interface ServiceRequest {
  _id: string;
  brand: string;
  model: string;
  deviceType?: string;
  category?: string;
  problemType: string;
  status: string;
  priority?: string;
  urgency?: string;
  createdAt: string;
  updatedAt: string;
  preferredDate?: string;
  preferredTime?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  scheduleStatus?: 'pending' | 'proposed' | 'accepted' | 'rejected' | 'scheduled';
  scheduleNotes?: string;
  availableSlots?: string[];
  budget?: number;
  estimatedCost?: number;
  vendorServiceCharge?: number;
  city?: string;
  address?: string;
  assignedTechnician?: {
    pocInfo: {
      fullName: string;
    };
  };
  assignedVendor?: any;
  issueImages?: string[];
  paymentStatus?: string;
  timerExpiresAt?: string;
  isTimerActive?: boolean;
  completedAt?: string;
  adminFinalPrice?: number;
  // Additional fields for timer functionality
  userName?: string;
  userPhone?: string;
  requestType?: string;
  serviceType?: string;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  isUrgent?: boolean;
  issueLevel?: string;
  wantsWarranty?: boolean;
  wantsDataSafety?: boolean;
  calculatedPricing?: any;
  latitude?: number;
  longitude?: number;
  location?: any;
}

interface ServiceRequestResponse {
  success: boolean;
  requests: ServiceRequest[];
}

export function ServiceRequestsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { colors, spacing, typography } = useTheme();

  const getServiceRequests = async () => {
      const token: string | null = await getStoredToken();
      if (!token) {
          setLoading(false);
          // Redirect to login screen when no token found
          navigation.replace('Auth', { screen: 'Login' });
          return;
      }
      try {
        const response = await requestWithAuth<ServiceRequestResponse>('/service-requests/my-requests', token);
        console.log(response)
        if (response.data?.success) {
          const data = response.data.requests;
          setServiceRequests(data);
        }

        return response; 
      } catch (error) {
        console.error('Error fetching service requests:', error);
      } finally {
        setLoading(false);
      }
  }


  useEffect(() => {
    getServiceRequests();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getServiceRequests();
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return colors.success;
      case 'In Progress':
        return colors.warning;
      case 'Pending':
        return colors.mutedForeground;
      default:
        return colors.mutedForeground;
    }
  };

    const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const styles = useMemo(
      ()=>
        StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: colors.background,
          },
          scroll: {
            flex: 1,
            backgroundColor: colors.background,
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
          requestCard: {
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
          requestHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing.md,
          },
          requestTitle: {
            flex: 1,
          },
          deviceModel: {
            ...typography.subtitle,
            color: colors.foreground,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: spacing.xs,
          },
          issueDescription: {
            ...typography.body,
            color: colors.mutedForeground,
            fontSize: 14,
            lineHeight: 20,
          },
          statusBadge: {
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: 6,
          },
          statusText: {
            ...typography.caption,
            fontSize: 10,
            fontWeight: '600',
          },
          requestDetails: {
            gap: spacing.sm,
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
          },
          createButton: {
            marginBottom: spacing.lg,
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
        })
      ,[colors, spacing, typography, insets])

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Service Requests</Text>
          <Text style={styles.subtitle}>Track and manage your repair requests</Text>
        </View>

        <View style={styles.createButton}>
          <Button
            title="Create New Request"
            variant="primary"
            onPress={  (() => {
              navigation.navigate('ServiceRequestStack');
          })} 
          />
        </View>
        

        {serviceRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Service Requests</Text>
            <Text style={styles.emptySubtitle}>
              You haven't created any service requests yet. Tap the button above to get started.
            </Text>
          </View>
        ) : (
          serviceRequests.map((request) => (
            <TouchableOpacity 
              key={request._id} 
              style={styles.requestCard}
              onPress={() => (navigation as any).navigate('ServiceRequestDetails', { serviceRequest: request })}
            >
              <View style={styles.requestHeader}>
                <View style={styles.requestTitle}>
                  <Text style={styles.deviceModel}>{request.brand?.toUpperCase()} {request.model}</Text>
                  <Text style={styles.issueDescription}>{request.problemType}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                    {request.status}
                  </Text>
                </View>
              </View>
              <View style={styles.requestDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{formatDate(request.createdAt)}</Text>
                </View>
                {request.category && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailValue}>{request.category}</Text>
                  </View>
                )}
                {request.status === 'Pending' &&
                  request.isTimerActive &&
                  request.timerExpiresAt && (
                    <ServiceRequestTimer serviceRequest={request} />
                  )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
  );
}

