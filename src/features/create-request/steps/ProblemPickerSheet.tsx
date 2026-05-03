import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetFlatList, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../core/theme';



interface Props {
  title: string;
  options: Record<string, string>[];
  selectedValue?: string;
  onSelect: (value: Record<string, string>) => void;
  sheetRef: React.RefObject<BottomSheetModal>;
}

export const ProblemPickerSheet = ({ title, options, selectedValue, onSelect, sheetRef }: Props) => {
  const { colors, spacing } = useTheme();
  const snapPoints = useMemo(() => ['50%', '80%'], []);

  // Renders the darkened background
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  const renderItem = useCallback(({ item, index }: { item: Record<string, string>; index: number }) => {
    const isSelected = selectedValue === item.id;
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.item,
          isSelected && {
            backgroundColor: colors.primary + '12',
            borderColor: colors.primary,
          },
        ]}
        onPress={() => {
          onSelect(item);
          sheetRef.current?.dismiss();
        }}
      >
        <Text style={[styles.itemText, { color: isSelected ? colors.primary : colors.foreground }]}>
          {item.title}
        </Text>
        {isSelected && <Text style={{ color: colors.primary }}>✓</Text>}
      </TouchableOpacity>
    );
  }, [selectedValue, colors, onSelect]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      backgroundStyle={{ backgroundColor: colors.card }}
    >
      <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary }}>{title}</Text>
      </View>
      <BottomSheetFlatList
        data={options}
        keyExtractor={(item: Record<string, string>, index: number) => index}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md }}
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemText: { fontSize: 16 },
});
