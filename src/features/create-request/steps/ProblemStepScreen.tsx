import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../core/theme';

import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ProblemPickerSheet } from './ProblemPickerSheet';

import { request, requestWithAuth } from '../../../core/api';

import { FormData } from '../ServiceRequestStack';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface ProblemStepScreenProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export function ProblemStepScreen({
  formData,
  updateFormData,
  errors,
  onNext,
  onBack,
}: ProblemStepScreenProps) {
  const { colors, spacing, typography } = useTheme();

  const hasMainProblem = Boolean(formData.mainProblem?.id || formData.mainProblem?.title);

  const [mainProblemCategories, setMainProblemCategories] = useState([]);

  const [isMainProblemSelected, setIsMainProblemSelected] = useState(false);

  const [isSelectingMainProblem, setIsSelectingMainProblem] = useState(false);
  
  const [subProblemCategories, setSubProblemCategories] = useState([]);

  const [isSubProblemSelected, setIsSubProblemSelected] = useState(false);

  const [isSelectingSubProblem, setIsSelectingSubProblem] = useState(false);

  const [relationalBehaviors, setRelationalBehaviors] = useState([]);

  const [isSelectingRelationalBehavior, setIsSelectingRelationalBehavior] = useState(false);

  const [problems, setProblems] = useState([]);

  
  const [sheetTitle, setSheetTitle] = useState("Select Problem Category");
  const [selectedValue, setSelectedValue] = useState("")

  const [formField, setFormField] = useState("");

  const problemSheetRef = React.useRef<BottomSheetModal>(null);

  const getMainProblemCategories = async () => {
    try {
      const response = await request<ApiResponse<any>>(
                `/problems`,
                {
                  method: 'GET',
                }
              );
      if (response.data?.success) {
        console.log(response.data.data)
        const problems = response.data.data;
        problems.sort((a: any, b: any) => a.title.localeCompare(b.title));
        setMainProblemCategories(problems);
      }
      // setMainProblemCategories(response);
    } catch (error) {
      console.error('Error fetching main problem categories:', error);
    }
  };

  const getSubProblemCategories = async () => {
    try {
      const response = await request<ApiResponse<any>>(
                `/problems/${formData.mainProblem.id}/sub-problems`,
                {
                  method: 'GET',
                }
              );
      if (response.data?.success) {
        const problems = response.data.data;

        problems.sort((a: any, b: any) => a.title.localeCompare(b.title));
        setSubProblemCategories(problems);
      }
      // setSubProblemCategories(response);
    } catch (error) {
      console.error('Error fetching sub problem categories:', error);
    }
  };

  const getAllBehaviors = async () => {
    try {
      const response = await request<ApiResponse<any>>(
                `/problems/${formData.mainProblem.id}/all-behaviors`,
                {
                  method: 'GET',
                }
              );
      if (response.data?.success) {
        const problems = response.data.data;

        problems.sort((a: any, b: any) => a.title.localeCompare(b.title));
        setRelationalBehaviors(problems);
      }
      // setSubProblemCategories(response);
    } catch (error) {
      console.error('Error fetching sub problem categories:', error);
    }
  };

  useEffect(() => {
    if (isSelectingMainProblem) {
      setProblems(mainProblemCategories);
      setFormField("mainProblem")
    }
    else if (isSelectingSubProblem) {
      setProblems(subProblemCategories);
      setFormField("subProblem")
    }
    else if (isSelectingRelationalBehavior) {
      setProblems(relationalBehaviors);
      setFormField("relationalBehaviors")
    }
  }, [isSelectingMainProblem, isSelectingSubProblem, isSelectingRelationalBehavior]);

  useEffect(() => {
    getMainProblemCategories();
  }, []);

  useEffect(() => {
    if (!formData.mainProblem?.id) {
      return;
    }
    getSubProblemCategories();
    getAllBehaviors();
  }, [formData.mainProblem?.id]);

  const selectedLabel = useMemo(() => 
    formData.mainProblem.title || 'Select Problem Type',
    [formData.mainProblem]
  );

  const selectedSubLabel = useMemo(() => 
    formData.subProblem.title || 'Select Sub Problem Type',
    [formData.subProblem]
  );

  const selectedRelationalBehaviorLabel = useMemo(() => 
    (formData.relationalBehaviors[0]?.title) || 'Select the specific issue',
    [formData.relationalBehaviors]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    scroll: {
      flex: 1,
    } as ViewStyle,
    scrollContent: {
      padding: spacing.sm,
    } as ViewStyle,
    section: {
      marginBottom: spacing.md,
    } as ViewStyle,
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.foreground,
      marginBottom: spacing.sm,
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
      borderRadius: 14,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center' as const,
      minHeight: 52,
      justifyContent: 'center' as const,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 1,
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
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: spacing.md,
      marginBottom: spacing.md,
      fontSize: 16,
      color: colors.foreground,
      backgroundColor: colors.card,
    } as ViewStyle,
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top' as const,
    } as ViewStyle,
    inputError: {
      borderColor: colors.destructive,
      borderWidth: 1.5,
    } as ViewStyle,
    errorText: {
      fontSize: 12,
      color: colors.destructive,
      marginTop: spacing.xs,
    } as TextStyle,
  });

  return (
    <BottomSheetModalProvider>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Do you know the problem?</Text>
        <View style={styles.optionsGrid}>
          {[
            { id: true, label: 'Yes, I know the problem' },
            { id: false, label: 'No, I need help identifying' },
          ].map((option) => (
            <TouchableOpacity
              key={option.id.toString()}
              style={[
                styles.optionButton,
                formData.knowsProblem === option.id && styles.optionButtonSelected,
              ]}
              onPress={() => updateFormData('knowsProblem', option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  formData.knowsProblem === option.id && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {formData.knowsProblem && (
            <>
              <Text style={styles.sectionTitle}>Problem Category</Text>
              <TouchableOpacity 
                style={[styles.input, errors.mainProblem && styles.inputError]} 
                onPress={() => {
                  setSheetTitle("Select Problem Category")
                  setSelectedValue(formData.mainProblem.title)
                  setIsSelectingSubProblem(false)
                  setIsSelectingMainProblem(true)
                  setIsSelectingRelationalBehavior(false)
                  problemSheetRef.current?.present()
                }}
              >
                <Text style={{ color: formData.mainProblem?.title ? colors.foreground : colors.mutedForeground }}>
                  {selectedLabel}
                </Text>
              </TouchableOpacity>
              {errors.mainProblem && <Text style={styles.errorText}>{errors.mainProblem}</Text>}
            </>
          )}

        {formData.knowsProblem && hasMainProblem && (
          <>
            <Text style={styles.sectionTitle}>Problem Sub-category</Text>
            <TouchableOpacity 
              style={[styles.input, errors.subProblem && styles.inputError]} 
                  onPress={() =>{
                      setSheetTitle("Select Problem Sub-category")
                      setSelectedValue(formData.subProblem.title)
                      setIsSelectingSubProblem(true)
                      setIsSelectingMainProblem(false)
                      setIsSelectingRelationalBehavior(false)
                     problemSheetRef.current?.present()
                  }}
                >
                  <Text style={{ color: formData.subProblem?.title ? colors.foreground : colors.mutedForeground }}>
                    {selectedSubLabel}
                  </Text>
            </TouchableOpacity>
            {errors.subProblem && <Text style={styles.errorText}>{errors.subProblem}</Text>}

            <Text style={styles.sectionTitle}>Select the specific issue</Text>
            <TouchableOpacity 
                  style={[styles.input, errors.relationalBehaviors && styles.inputError]} 
                  onPress={() =>{
                      setSheetTitle("Select the specific issue")
                      setSelectedValue(formData.relationalBehaviors[0]?.title)
                      setIsSelectingRelationalBehavior(true)
                      setIsSelectingSubProblem(false)
                      setIsSelectingMainProblem(false)
                     problemSheetRef.current?.present()
                  }}
                >
                  <Text style={{ color: formData.relationalBehaviors[0]?.title ? colors.foreground : colors.mutedForeground }}>
                    {selectedRelationalBehaviorLabel}
                  </Text>
            </TouchableOpacity>
            {errors.relationalBehaviors && <Text style={styles.errorText}>{errors.relationalBehaviors}</Text>}
          </>
        )}


        { !formData.knowsProblem && (
          <>
            <Text style={styles.sectionTitle}>
                Describe the Problem
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.problemDescription && styles.inputError]}
                value={formData.problemDescription}
                onChangeText={(value) => updateFormData('problemDescription', value)}
                placeholder="Please describe what's happening with your device..."
                multiline
                textAlignVertical="top"
              />
              {errors.problemDescription && (
                <Text style={styles.errorText}>{errors.problemDescription}</Text>
              )}
          </>
        )}
      </View>
      <ProblemPickerSheet
          title={sheetTitle}
          options={problems}
          selectedValue={selectedValue}
          onSelect={(val: any) => {

            if (isSelectingRelationalBehavior) {
              val = [val];
            }

            updateFormData(formField as keyof FormData, val);
            
            if (formField === "mainProblem") {
              setIsMainProblemSelected(true);
            } else if (formField === "subProblem") {
              setIsSubProblemSelected(true);
            }
            
          }}
          sheetRef={problemSheetRef as any}
        />

    </ScrollView>
    </BottomSheetModalProvider>
  );
}
