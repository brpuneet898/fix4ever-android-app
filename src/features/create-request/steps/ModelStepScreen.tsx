import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInput,
} from 'react-native';
import { useTheme } from '../../../core/theme';

import { FormData } from '../ServiceRequestStack';

interface ModelStepScreenProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  models: any[];
  modelSearchQuery: string;
  setModelSearchQuery: (value: string) => void;
}



const createStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { flex: 1, padding: spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: spacing.md },
  searchContainer: { marginBottom: spacing.md },
  searchInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, fontSize: 16, color: colors.foreground, backgroundColor: colors.background },
  modelItem: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md, alignItems: 'center', flexDirection: 'row', minHeight: 90 },
  brandItemSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  brandName: { fontSize: 14, fontWeight: '500', color: colors.mutedForeground, flex: 1 },
  brandNameSelected: { color: colors.primary },
  otherBrandIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  otherBrandIconText: { fontSize: 24, color: colors.mutedForeground, fontWeight: 'bold' },
  imageStyle: { width: 60, height: 60, marginRight: spacing.md, resizeMode: 'contain' }
});



// 2. Debounced search hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 3. Separate SearchHeader component to isolate input state
const SearchHeader = React.memo(({ value, onChangeText, placeholder, styles }: any) => (
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
));

// 2. Wrap Item in React.memo to prevent unnecessary row re-renders
const ModelItem = React.memo(({ item, isSelected, onPress, itemStyles, spacing, colors }: any) => (
  <TouchableOpacity
    style={[itemStyles.modelItem, isSelected && itemStyles.brandItemSelected]}
    onPress={() => onPress(item)}
  >
    {item.url ? (
      <Image
        source={{ uri: item.url }}
        style={itemStyles.imageStyle}
        onError={(error: any) => console.log('Image load error for', item.url, ':', error)}
      />
    ) : (
      <View style={itemStyles.otherBrandIcon}>
        <Text style={itemStyles.otherBrandIconText}>+</Text>
      </View>
    )}
    <Text style={[itemStyles.brandName, isSelected && itemStyles.brandNameSelected]}>
      {item.name.toUpperCase()}
    </Text>
  </TouchableOpacity>
));

export function ModelStepScreen({
  formData,
  updateFormData,
  errors,
  onNext,
  onBack,
  models,
  modelSearchQuery,
  setModelSearchQuery,
}: ModelStepScreenProps) {
  const { colors, spacing } = useTheme();
  const styles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);
  
  // Memoize styles ONCE for the whole screen
  const itemStyles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);

  // 5. Debounce search input to prevent excessive re-renders
  const debouncedSearchQuery = useDebounce(modelSearchQuery, 300);

  // 6. Move filtering to a separate worker-like useMemo with early return
  const filteredModels = useMemo(() => {
    if (!debouncedSearchQuery) return models;
    return models.filter(m => m.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
  }, [models, debouncedSearchQuery]);

  // 7. Memoized header component
  const listHeader = useMemo(() => (
    <SearchHeader
      value={modelSearchQuery}
      onChangeText={setModelSearchQuery}
      placeholder="Search for model (eg. MacBook Pro)"
      styles={styles}
    />
  ), [modelSearchQuery, setModelSearchQuery, styles]);

  // 8. Stable renderItem function
  const renderItem = useCallback(({ item }: any) => (
    <ModelItem 
      item={item}
      isSelected={
        formData.selectedModel === item.id ||
        formData.selectedModel === item.name ||
        formData.model === item.name
      }
      itemStyles={itemStyles}
      spacing={spacing}
      colors={colors}
      onPress={(model: any) => {
        updateFormData('selectedModel', model.id);
        updateFormData('model', model.name);
      }}
    />
  ), [formData.selectedModel, itemStyles, colors, spacing, updateFormData]);

  
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Model</Text>
        
        {/* Model List with aggressive performance optimizations */}
        <FlatList
          data={filteredModels}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={formData.selectedModel}
          ListHeaderComponent={listHeader}
          // Aggressive performance props
          windowSize={3}
          maxToRenderPerBatch={1}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          removeClippedSubviews={Platform.OS === 'android'}
          getItemLayout={(data, index) => ({
            length: 90,
            offset: 90 * index,
            index,
          })}
        />
      </View>
    </View>
  );
}
