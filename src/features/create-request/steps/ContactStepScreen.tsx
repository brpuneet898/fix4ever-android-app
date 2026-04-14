import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Config from 'react-native-config';
import { useTheme } from '../../../core/theme';
import { Input } from '../../../core/components';

import Icon from 'react-native-vector-icons/Feather';

import { FormData } from '../ServiceRequestStack';


interface ContactStepScreenProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  addressQuery: string;
  setAddressQuery: (value: string) => void;
  addressPredictions: any[];
  fetchAutocomplete: (value: string) => void;
  loadingAddress: boolean;
  getCurrentLocation: () => void;
  isGettingLocation: boolean;
  locationError: string | null;
}

export function ContactStepScreen({
  formData,
  updateFormData,
  errors,
  onNext,
  onBack,
  addressQuery,
  setAddressQuery,
  addressPredictions,
  fetchAutocomplete,
  loadingAddress,
  getCurrentLocation,
  isGettingLocation,
  locationError,
}: ContactStepScreenProps) {
  const { colors, spacing } = useTheme();

  const defaultRegion: Region = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  const [mapRegion, setMapRegion] = useState<Region>(defaultRegion);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  
  // Simple text change handler - only update parent
  const handleTextChange = (field: string, value: string) => {
    updateFormData(field as any, value);
  };

  const hasLatLong =
    Number.isFinite(formData.latitude) &&
    Number.isFinite(formData.longitude) &&
    !(formData.latitude === 1 && formData.longitude === 1);

  const selectedCoordinate = hasLatLong
    ? { latitude: formData.latitude, longitude: formData.longitude }
    : null;

  const setMapPin = (latitude: number, longitude: number) => {
    updateFormData('latitude', latitude);
    updateFormData('longitude', longitude);
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const reverseGeocodeLatLng = async (latitude: number, longitude: number) => {
    const geocodingKey = Config.GOOGLE_MAPS_API_KEY;

    if (!geocodingKey) {
      return;
    }

    setIsResolvingAddress(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${geocodingKey}`
      );
      if (!response.ok) {
        return;
      }

      const geocode = await response.json();
      if (geocode?.status !== 'OK' || !Array.isArray(geocode?.results) || !geocode.results.length) {
        return;
      }

      const first = geocode.results[0];
      const resolvedAddress = first?.formatted_address || '';
      const cityComponent = (first?.address_components || []).find((component: any) =>
        component?.types?.includes('locality') ||
        component?.types?.includes('administrative_area_level_3') ||
        component?.types?.includes('administrative_area_level_2') ||
        component?.types?.includes('sublocality') ||
        component?.types?.includes('postal_town')
      );

      if (resolvedAddress) {
        updateFormData('address', resolvedAddress);
        setAddressQuery(resolvedAddress);
      }
      if (cityComponent?.long_name) {
        updateFormData('city', cityComponent.long_name);
      }
    } catch (error) {
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const resolveAddressToRegion = async (inputAddress: string, placeId?: string) => {
    const geocodingKey = Config.GOOGLE_MAPS_API_KEY;

    if (!geocodingKey || !inputAddress.trim()) {
      return;
    }

    setIsResolvingAddress(true);
    try {
      const params = placeId
        ? `place_id=${encodeURIComponent(placeId)}`
        : `address=${encodeURIComponent(inputAddress)}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params}&key=${geocodingKey}`
      );
      if (!response.ok) {
        return;
      }

      const geocode = await response.json();
      if (geocode?.status !== 'OK' || !Array.isArray(geocode?.results) || !geocode.results.length) {
        return;
      }

      const first = geocode.results[0];
      const location = first?.geometry?.location;
      const latitude = Number(location?.lat);
      const longitude = Number(location?.lng);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      setMapPin(latitude, longitude);

      const cityComponent = (first?.address_components || []).find((component: any) =>
        component?.types?.includes('locality') ||
        component?.types?.includes('administrative_area_level_2') ||
        component?.types?.includes('postal_town')
      );
      if (cityComponent?.long_name && !formData.city) {
        updateFormData('city', cityComponent.long_name);
      }
    } catch (e) {
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const onAddressChange = (value: string) => {
    handleTextChange('address', value);
    setAddressQuery(value);
    fetchAutocomplete(value);
  };

  const onSelectPrediction = async (item: any) => {
    const selectedAddress = item?.description || '';
    updateFormData('address', selectedAddress);
    setAddressQuery(selectedAddress);
    fetchAutocomplete('');
    Keyboard.dismiss();
    await resolveAddressToRegion(selectedAddress, item?.place_id);
  };

  const handleMapPress = async (event: any) => {
    const coordinate = event?.nativeEvent?.coordinate;
    const latitude = Number(coordinate?.latitude);
    const longitude = Number(coordinate?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    setMapPin(latitude, longitude);
    await reverseGeocodeLatLng(latitude, longitude);
  };

  const handleMarkerDragEnd = async (event: any) => {
    const coordinate = event?.nativeEvent?.coordinate;
    const latitude = Number(coordinate?.latitude);
    const longitude = Number(coordinate?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return;
    }

    setMapPin(latitude, longitude);
    await reverseGeocodeLatLng(latitude, longitude);
  };

  useEffect(() => {
    if (!hasLatLong) {
      return;
    }

    setMapRegion({
      latitude: formData.latitude,
      longitude: formData.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [formData.latitude, formData.longitude, hasLatLong]);

  useEffect(() => {
  }, [mapRegion]);

  useEffect(() => {
  }, [selectedCoordinate, hasLatLong]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
    } as ViewStyle,
    scroll: {
      flex: 1,
    } as ViewStyle,
    scrollContent: {
      padding: spacing.md,
    } as ViewStyle,
    section: {
      marginBottom: spacing.lg,
    } as ViewStyle,
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.foreground,
      marginBottom: spacing.md,
    } as TextStyle,
    optionsGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: spacing.sm,
      marginBottom: spacing.md,
    } as ViewStyle,
    optionButton: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: spacing.md,
      alignItems: 'center' as const,
      minHeight: 60,
      justifyContent: 'center' as const,
    } as ViewStyle,
    optionButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    } as ViewStyle,
    optionText: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: colors.mutedForeground,
      textAlign: 'center' as const,
    } as TextStyle,
    optionTextSelected: {
      color: colors.primaryForeground,
    } as TextStyle,
    addressInputContainer: {
      position: 'relative' as const,
    } as ViewStyle,
    loadingIndicator: {
      position: 'absolute' as const,
      right: 12,
      top: 12,
    } as ViewStyle,
    suggestionsContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: 200,
      zIndex: 1000,
    } as ViewStyle,
    suggestionsList: {
      maxHeight: 180,
    } as ViewStyle,
    suggestionItem: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    } as ViewStyle,
    suggestionText: {
      fontSize: 14,
      color: colors.foreground,
    } as TextStyle,
    locationSection: {
      marginTop: spacing.md,
    } as ViewStyle,
    locationLabel: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: colors.foreground,
      marginBottom: spacing.sm,
    } as TextStyle,
    locationButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: spacing.md,
      gap: spacing.sm,
    } as ViewStyle,
    locationButtonDisabled: {
      opacity: 0.6,
    } as ViewStyle,
    locationButtonText: {
      fontSize: 16,
      color: colors.foreground,
    } as TextStyle,
    locationButtonTextDisabled: {
      color: colors.mutedForeground,
    } as TextStyle,
    locationError: {
      fontSize: 14,
      color: colors.destructive,
      marginTop: spacing.sm,
    } as TextStyle,
    locationDetailsCard: {
      marginTop: spacing.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.card,
    } as ViewStyle,
    locationDetailsTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.foreground,
      marginBottom: spacing.sm,
      textAlign: 'center' as const,
    } as TextStyle,
    searchRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    } as ViewStyle,
    searchInput: {
      flex: 1,
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      paddingHorizontal: spacing.md,
      color: colors.foreground,
      backgroundColor: colors.background,
      fontSize: 15,
    } as TextStyle,
    currentLocationIconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
      borderColor: colors.foreground,
      backgroundColor: colors.card,
    } as ViewStyle,
    miniMapContainer: {
      borderRadius: 12,
      overflow: 'hidden' as const,
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,
    miniMap: {
      width: '100%',
      height: 220,
    } as ViewStyle,
    mapOverlay: {
      position: 'absolute' as const,
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: colors.card,
      borderRadius: 999,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,
    mapOverlayText: {
      fontSize: 12,
      color: colors.foreground,
      fontWeight: '500' as const,
    } as TextStyle,
    mapHelp: {
      marginTop: spacing.sm,
      fontSize: 12,
      color: colors.mutedForeground,
      textAlign: 'center' as const,
    } as TextStyle,
    mapHint: {
      marginTop: spacing.xs,
      fontSize: 12,
      color: colors.mutedForeground,
    } as TextStyle,
  });

  const renderLocationPicker = () => {
    return (
    <View style={styles.locationDetailsCard}>
      <Text style={styles.locationDetailsTitle}>Location Details</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={addressQuery || formData.address}
          onChangeText={onAddressChange}
          placeholder="Search for a location or address..."
          placeholderTextColor={colors.mutedForeground}
        />
        <TouchableOpacity
          style={styles.currentLocationIconButton}
          onPress={getCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Icon name="map-pin" size={18} color={colors.foreground} />
          )}
        </TouchableOpacity>
      </View>

      {addressPredictions && addressPredictions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            data={addressPredictions}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => onSelectPrediction(item)}
              >
                <Text style={styles.suggestionText} numberOfLines={1}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.miniMapContainer}>
        <MapView
          style={styles.miniMap}
          region={mapRegion}
          onPress={handleMapPress}
          onMapReady={() => {}}
          onMapLoaded={() => {}}
          onRegionChangeComplete={() => {}}
          zoomEnabled
          scrollEnabled
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
        >
          {selectedCoordinate && (
            <Marker
              coordinate={selectedCoordinate}
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </MapView>
        <View style={styles.mapOverlay}>
          <Text style={styles.mapOverlayText}>Tap map to drop pin</Text>
        </View>
      </View>

      <Text style={styles.mapHelp}>
        Tip: Search, tap the map, drag the pin, or use current location.
      </Text>
      {(isResolvingAddress || locationError) && (
        <Text style={styles.mapHint}>
          {isResolvingAddress ? 'Resolving selected location...' : locationError}
        </Text>
      )}
    </View>
    );
  };

  return (
    <ScrollView
    
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Request Type</Text>
        <View style={styles.optionsGrid}>
          {['self', 'other'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                formData.requestType === type && styles.optionButtonSelected,
              ]}
              onPress={() => updateFormData('requestType', type as 'self' | 'other')}
            >
              <Text
                style={[
                  styles.optionText,
                  formData.requestType === type && styles.optionTextSelected,
                ]}
              >
                {type === 'self' ? 'For Myself' : 'For Someone Else'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Service Type</Text>
        <View style={styles.optionsGrid}>
          {[
            { id: 'pickup-drop', label: 'Pickup & Drop' },
            { id: 'visit-shop', label: 'Visit Shop' },
            { id: 'onsite', label: 'Onsite' },
          ].map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.optionButton,
                formData.serviceType === type.id && styles.optionButtonSelected,
              ]}
              onPress={() => updateFormData('serviceType', type.id as any)}
            >
              <Text
                style={[
                  styles.optionText,
                  formData.serviceType === type.id && styles.optionTextSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {formData.requestType === 'self' ? (
          <>
            <Input
              label="Your Name"
              value={formData.userName}
              onChangeText={(value: string) => handleTextChange('userName', value)}
              placeholder="Enter your full name"
              error={errors.userName}
              keyboardType="default"
            />
            <Input
              label="Phone Number"
              value={formData.userPhone}
              onChangeText={(value: string) => handleTextChange('userPhone', value)}
              placeholder="Enter your 10-digit phone number"
              error={errors.userPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              <View style={styles.addressInputContainer}>
                <TextInput
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: spacing.md,
                      fontSize: 16,
                      color: colors.foreground,
                      backgroundColor: colors.background,
                      height: 120,
                    },
                    errors.address && { borderColor: colors.destructive },
                  ]}
                  value={formData.address}
                  onChangeText={onAddressChange}
                  placeholder="Enter your complete address"
                  multiline
                  textAlignVertical="top"
                />
              </View>
              {errors.address && (
                <Text style={{ color: colors.destructive, fontSize: 12, marginTop: 4 }}>
                  {errors.address}
                </Text>
              )}
            </View>
            <Input
              label="City"
              value={formData.city}
              onChangeText={(value: string) => handleTextChange('city', value)}
              error={errors.city}
              placeholder="Enter your city"
            />
            {renderLocationPicker()}
          </>
        ) : (
          <>
            <Input
              label="Beneficiary Name"
              value={formData.beneficiaryName}
              onChangeText={(value: string) => handleTextChange('beneficiaryName', value)}
              error={errors.beneficiaryName}
              placeholder="Enter beneficiary's full name"
            />
            <Input
              label="Beneficiary Phone Number"
              value={formData.beneficiaryPhone}
              onChangeText={(value: string) => handleTextChange('beneficiaryPhone', value)}
              error={errors.beneficiaryPhone}
              placeholder="Enter beneficiary's 10-digit phone number"
              keyboardType="phone-pad"
              maxLength={10}
            />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              <View style={styles.addressInputContainer}>
                <TextInput
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: spacing.md,
                      fontSize: 16,
                      color: colors.foreground,
                      backgroundColor: colors.background,
                      height: 120,
                    },
                    errors.address && { borderColor: colors.destructive },
                  ]}
                  value={formData.address}
                  onChangeText={onAddressChange}
                  placeholder="Enter complete address"
                  multiline
                  textAlignVertical="top"
                />
              </View>
              {errors.address && (
                <Text style={{ color: colors.destructive, fontSize: 12, marginTop: 4 }}>
                  {errors.address}
                </Text>
              )}
            </View>
            <Input
              label="City"
              value={formData.city}
              onChangeText={(value: string) => handleTextChange('city', value)}
              error={errors.city}
              placeholder="Enter city"
            />
            {renderLocationPicker()}
          </>
        )}
      </View>
    </View>
  </View>
    </ScrollView>
);
}
