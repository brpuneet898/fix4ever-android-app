import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, Alert,
  PermissionsAndroid,
  Platform,

 } from 'react-native';
//import { createStackNavigator } from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { request, requestWithAuth } from '../../core/api';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Config from 'react-native-config';

import { config } from '../../core/config';
const base = config.API_BASE_URL;

import { getStoredToken } from '../../core/storage';

// Response interface for service request creation
interface ServiceRequestResponse {
  success: boolean;
  message?: string;
  data?: any;
}

import {
  ContactStepScreen,
  BrandStepScreen,
  ModelStepScreen,
  ProblemStepScreen,
  DateTimeStepScreen,
  ImagesStepScreen,
  ReviewStepScreen,
} from './steps';
import { Button } from '../../core/components';
import { useTheme } from '../../core/theme';
import { useAuth } from '../../lib/contexts/auth-context';

export interface FormData {
  requestType: "self" | 'other';
  serviceType: "pickup-drop" | 'visit-shop' | 'onsite';
  userName: string;
  userPhone: string;
  beneficiaryName: string;
  beneficiaryPhone: string;
  knowsProblem: boolean;
  problemType: string;
  issueLevel: any;
  problemDescription: string;
  warrantyOption: 'none' | '30days' | '3months';
  urgencyLevel: 'normal' | 'express' | 'urgent';
  dataSafety: boolean;
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  brand: string;
  model: string;
  issueImages: File[];
  selectedBrand: string;
  deviceType: string;
  customBrandName: string;
  selectedModel: string;
  mainProblem: Record<string, string>;
  subProblem: Record<string, string>;
  relationalBehaviors: Record<string, string>[];
}

const DEVICE_TYPES = ['Laptop'];
// Issue level interface
interface IssueLevel {
  id: string;
  name: string;
  description: string;
  price: number;
}


interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface ServiceRequestStackProps {
  // updateFormData: (field: keyof FormData, value: any) => void;
  // addressQuery: string;
  // setAddressQuery: (value: string) => void;
  // addressPredictions: any[];
  // fetchAutocomplete: (value: string) => void;
  // loadingAddress: boolean;
  // calculatedPricing: any;
  navigation: any;
}

const Stack = createNativeStackNavigator();

// TIME_SLOTS constant for time slot selection
const TIME_SLOTS = [
  { id: '09:00-12:00', label: '9:00 AM - 12:00 PM' },
  { id: '12:00-15:00', label: '12:00 PM - 3:00 PM' },
  { id: '15:00-18:00', label: '3:00 PM - 6:00 PM' },
];

// Helper function to get step index from route name
const getStepIndex = (routeName: string): number => {
  const steps = ['Contact', 'Brand', 'Model', 'Problem', 'DateTime', 'Images', 'Review'];
  return steps.indexOf(routeName);
};

// STEPS constant for header titles
const STEPS = [
  { id: 'contact', title: 'Contact & Request' },
  { id: 'brand', title: 'Brand' },
  { id: 'model', title: 'Model' },
  { id: 'problem', title: 'Problem' },
  { id: 'datetime', title: 'Date & Time' },
  { id: 'images', title: 'Images' },
  { id: 'review', title: 'Review' },
];

// Custom Header Component
const StepHeader = ({ navigation, routeName }: { navigation: any; routeName: string }) => {
  const { colors, spacing } = useTheme();
  const stepIndex = getStepIndex(routeName);
  const title = `${stepIndex + 1}/7 ${STEPS[stepIndex]?.title || 'Service Request'}`;
  
  return (
    <View style={{
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.card,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginRight: spacing.md }}
      >
        <Text style={{ color: colors.foreground, fontSize: 24 }}>←</Text>
      </TouchableOpacity>
      <Text style={{
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.foreground,
        flex: 1,
      }}>
        {title}
      </Text>
      <View style={{ width: 32 }} />
    </View>
  );
};

export function ServiceRequestStack({
  // addressQuery,
  // setAddressQuery,
  // addressPredictions,
  // fetchAutocomplete,
  // loadingAddress,
  // calculatedPricing,
  navigation,
}: ServiceRequestStackProps) {
  const { colors, spacing } = useTheme();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // search query state
  const [searchQuery, setSearchQuery] = useState('');
  const [customBrand, setCustomBrand] = useState('');


  // Location states
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);


  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState('');
  const [addressPredictions, setAddressPredictions] = useState<any[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
      // Enhanced user contact and request details
      requestType: 'self' as "self" | 'other',
      serviceType: 'pickup-drop' as "pickup-drop" | 'visit-shop' | 'onsite',
      userName: user?.username || '',
      userPhone: user?.phone || '',
      beneficiaryName: '',
      beneficiaryPhone: '',
      // Problem knowledge fields
      knowsProblem: true as boolean,
      problemType: '',
      issueLevel: { id: 'moderate', name: 'Moderate', description: '', price: 500 } as IssueLevel,
      problemDescription: '',
      // Warranty and urgency
      warrantyOption: 'none' as 'none' | '30days' | '3months',
      urgencyLevel: 'normal' as 'normal' | 'express' | 'urgent',
      dataSafety: true as boolean,
      // Date and time
      selectedDate: "" as string | null,
      selectedTimeSlot: "" as string | null,
      preferredDate: "" as string | null,
      preferredTime: "" as string | null,
      // Location
      address: '',
      latitude: 1,
      longitude: 1,
      city: '',
      // Device details
      brand: '',
      model: '',
      issueImages: [] as File[],
      selectedBrand: '',
      deviceType: 'Laptop',
      customBrandName: '',
      selectedModel: '',
      mainProblem: {},
      subProblem: {},
      relationalBehaviors: []
    });



    
      // Debounce utility
      const debounce = (func: Function, wait: number) => {
        let timeout: ReturnType<typeof setTimeout>;
        return function executedFunction(...args: any[]) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };
    
      // Address autocomplete
      const fetchAutocomplete = useCallback(
        debounce(async (query: string) => {
          if (!query.trim()) {
            setAddressPredictions([]);
            return;
          }

          const placesKey = Config.GOOGLE_MAPS_API_KEY;
          if (!placesKey) {
            setAddressPredictions([]);
            return;
          }
    
          setLoadingAddress(true);
          try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
              query
            )}&key=${placesKey}&language=en&components=country:in`;

            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Autocomplete request failed with status ${response.status}`);
            }

            const data = await response.json();
            if (data?.status === 'OK' && Array.isArray(data?.predictions)) {
              const predictions = data.predictions.map((item: any) => ({
                place_id: item.place_id,
                description: item.description,
              }));
              setAddressPredictions(predictions);
            } else {
              setAddressPredictions([]);
            }
          } catch (error) {
            setAddressPredictions([]);
          } finally {
            setLoadingAddress(false);
          }
        }, 300),
        []
      );
    
    
    
       
    
      // Pricing calculation (mock)
      const calculatePricing = () => {
        return {
          finalChargeRange: { min: 500, max: 1500 }
        };
      };
    
      const calculatedPricing = calculatePricing();

    // Helper functions
      const updateFormData = useCallback((field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
      }, []);

    const getAllBrands = async () => {
      try {
        setLoading(true);
        const response = await request<ApiResponse<any>>(
          `/brands`,
          {
            method: 'POST',
            body: {device: 'laptop'},
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.data?.success) {
          const brands = response.data.data.map((brand: any, index: number) => {
            brand.key = brand.key;
            brand.name = brand.key.split("/").at(-1).split("-").at(0);
            brand.img_url = brand.url;
            brand.id = brand.key || index.toString();
            return brand;
          })
          setBrands(brands);
        }
      } catch (error) {
        setError('Failed to fetch brands request');
      } finally {
        setLoading(false);
      }
    };

    const getBrandModels = async () => {
      try {
        setLoading(true);
        const response = await request<ApiResponse<any>>(
          `/models`,
          {
            method: 'POST',
            body: {device: 'laptop', brand: formData.brand},
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.data?.success) {
          
          const models = response.data.data.map((model: any, index: number) => {
            model.key = model.key;
            model.name = model.key.split("/").at(-1).split(".").at(0);
            model.id = index.toString();
            return model;
          })
          setModels(models);
        }

      } catch (error) {
        setError('Failed to fetch models request');
      } finally {
        setLoading(false);
      }
    }


  // Location permission and geolocation
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        Geolocation.requestAuthorization(
          () => resolve(true),
          () => resolve(false)
        );
      });
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location to provide better service.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
  };

  const resolveLocationDetails = async (latitude: number, longitude: number) => {
    let resolvedAddress = `Location detected at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    let resolvedCity = '';

    try {
      const geocodingKey = Config.GOOGLE_MAPS_API_KEY;

      if (!geocodingKey) {
        return;
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${geocodingKey}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed with status ${response.status}`);
      }

      const geocode = await response.json();
      if (geocode.status === 'OK' && Array.isArray(geocode.results) && geocode.results.length > 0) {
        const addressResults = geocode.results.filter((result: any) => {
          const types = result?.types || [];
          return (
            types.includes('street_address') ||
            types.includes('premise') ||
            types.includes('establishment') ||
            types.includes('route') ||
            types.includes('subpremise')
          );
        });

        const addressResult = addressResults[0] || geocode.results[0];
        const cityResult = geocode.results.find((result: any) =>
          (result?.address_components || []).some((component: any) =>
            component?.types?.includes('locality') ||
            component?.types?.includes('administrative_area_level_3') ||
            component?.types?.includes('administrative_area_level_2') ||
            component?.types?.includes('sublocality') ||
            component?.types?.includes('postal_town')
          )
        ) || geocode.results[0];

        const cityComponent = (cityResult?.address_components || []).find((component: any) =>
          component?.types?.includes('locality') ||
          component?.types?.includes('administrative_area_level_3') ||
          component?.types?.includes('administrative_area_level_2') ||
          component?.types?.includes('sublocality') ||
          component?.types?.includes('postal_town')
        );

        resolvedAddress = addressResult?.formatted_address || resolvedAddress;
        resolvedCity = cityComponent?.long_name || '';
      }
    } catch (geocodeError) {
    }

    updateFormData('address', resolvedAddress);
    updateFormData('city', resolvedCity || 'Detected City');
  };

  // Get current location
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLocationError('Location permission denied');
        setIsGettingLocation(false);
        return;
      }

      // Configure geolocation settings for better reliability
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });

      // Try a fast cached position first, then fall back to a live fix.
      const tryGetLocation = (highAccuracy: boolean) => {
        return new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            {
              enableHighAccuracy: highAccuracy,
              timeout: highAccuracy ? 7000 : 2500,
              maximumAge: highAccuracy ? 5000 : 60000,
            }
          );
        });
      };

      let position;
      try {
        position = await tryGetLocation(false);
      } catch (highAccuracyError) {
        try {
          position = await tryGetLocation(true);
        } catch (lowAccuracyError) {
          throw lowAccuracyError;
        }
      }

      // Successfully got position
      const { latitude, longitude } = (position as any).coords;
      updateFormData('latitude', latitude);
      updateFormData('longitude', longitude);

      // Update the map immediately, then resolve the human-readable address in the background.
      Promise.resolve().then(() => {
        void resolveLocationDetails(latitude, longitude);
      });

      setIsGettingLocation(false);
      setLocationError(null);
      
      Alert.alert(
        'Location Detected',
        `Your location has been detected successfully.\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setLocationError('Failed to get location');
      setIsGettingLocation(false);
    }
  };

  // Validation
  const validateCurrentStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      // Basic validation for Contact step (step 0)
      if (!formData.requestType) {
        newErrors.requestType = 'Please select request type';
      }
      if (!formData.serviceType) {
        newErrors.serviceType = 'Please select service type';
      }
      
      if (formData.requestType === 'self') {
        if (!formData.userName.trim()) {
          newErrors.userName = 'Name is required';
        }
        if (!formData.userPhone.trim()) {
          newErrors.userPhone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.userPhone)) {
          newErrors.userPhone = 'Phone number must be exactly 10 digits';
        }
      }
      
      if (formData.requestType === 'other') {
        if (!formData.beneficiaryName.trim()) {
          newErrors.beneficiaryName = 'Beneficiary name is required';
        }
        if (!formData.beneficiaryPhone.trim()) {
          newErrors.beneficiaryPhone = 'Beneficiary phone is required';
        } else if (!/^\d{10}$/.test(formData.beneficiaryPhone)) {
          newErrors.beneficiaryPhone = 'Phone number must be exactly 10 digits';
        }
      }
      
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (formData.latitude === 0 || formData.longitude === 0) {
        newErrors.location = 'Please enable location services';
      }
    }
    else if(stepIndex === 1) {
      if (formData.brand === "") {
        newErrors.brand = 'Brand is required';
      }
    }
    else if (stepIndex === 2) {
      if (formData.model === "") {
        newErrors.model = 'Model is required';
      }
    }
    else if (stepIndex === 3) {
      if (formData.knowsProblem) {
        if (!formData.mainProblem?.title) {
          newErrors.mainProblem = 'Main problem is required';
        }
        if (!formData.subProblem?.title) {
          newErrors.subProblem = 'Sub problem is required';
        }
        if (!formData.relationalBehaviors[0]) {
          newErrors.relationalBehaviors = 'Relational behavior is required';
        }
      }
      else if (!formData.knowsProblem) {
        if (formData.problemDescription === "") {
          newErrors.problemDescription = 'Problem description is required';
        }
      }
    }
    else if (stepIndex === 4) {
      if (!formData.preferredDate) {
        newErrors.preferredDate = 'Preferred date is required';
      }
      if (!formData.preferredTime) {
        newErrors.preferredTime = 'Preferred time is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const nextStep = (currentNavigation: any) => {
    const currentRoute = currentNavigation.getState();
    const stepIndex = getStepIndex(currentRoute.routes[currentRoute.index].name);
    if (validateCurrentStep(stepIndex)) {
        if (stepIndex === 0) {
          getAllBrands();
        }
        if (stepIndex === 1) {
          getBrandModels();
        }
        
        const nextStepName = getNextStepName(stepIndex);
        if (nextStepName) {
          currentNavigation.navigate(nextStepName);
        }

        setSearchQuery("");
    } else {
        Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const prevStep = (currentNavigation: any) => {
    setSearchQuery("");
    if (currentNavigation.canGoBack()) {
      currentNavigation.goBack();
    }
  };

  const getNextStepName = (currentIndex: number): string => {
    const steps = ['Contact', 'Brand', 'Model', 'Problem', 'DateTime', 'Images', 'Review'];
    return steps[currentIndex + 1] || 'Review';
  };

  const getStepTitle = (route: any): string => {
    const stepIndex = route.state?.index || 0;
    const titles = [
      '1/7 Contact & Request',
      '2/7 Brand',
      '3/7 Model', 
      '4/7 Problem',
      '5/7 Date & Time',
      '6/7 Images',
      '7/7 Review'
    ];
    return titles[stepIndex] || 'Service Request';
  };

  const canGoBack = (route: any): boolean => {
    const stepIndex = route.state?.index || 0;
    return stepIndex > 0;
  };

  const canGoForward = (route: any): boolean => {
    const stepIndex = route.state?.index || 0;
    return stepIndex < 6;
  };

    // Form submission
    const handleSubmit = async (currentNavigation: any) => {
      const currentRoute = currentNavigation.getState();
      const stepIndex = getStepIndex(currentRoute.routes[currentRoute.index].name);
      if (!validateCurrentStep(stepIndex)) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
  
      setIsSubmitting(true);
      setError(null);
  
      try {
            const token = await getStoredToken();
            const formDataObj = new FormData();
            // Create FormData object
            Object.entries(formData).forEach(([key, value]) => {
                // Append all form fields except images
          if (key !== 'issueImages' && value !== undefined && value !== null) {
            // These specific fields need to be JSON strings
            if (key === 'mainProblem' || key === 'subProblem' || key === 'relationalBehaviors') {
              formDataObj.append(key, JSON.stringify(value));
            } else if (typeof value === 'object') {
              formDataObj.append(key, JSON.stringify(value));
            } else {
              formDataObj.append(key, value.toString());
            }
          }
        });

            // Append image files to FormData
            // Format: { uri: local path, type: mime type, name: filename }
        if (formData.issueImages.length > 0) {
          formData.issueImages.forEach((file: any, index: number) => {
            formDataObj.append('issueImages', {
              uri: file.uri,
              type: file.type || 'image/jpeg', // Fallback to jpeg if type unknown
              name: file.name || `upload-${Date.now()}.jpg`, // Unique filename
            });
          });
        }

        const resp = await axios.post(`${base}/service-requests/create`, formDataObj, {  
          headers: {  
            'Content-Type': 'multipart/form-data', // Critical for file uploads 
            Authorization: `Bearer ${token}` 
          },
        });  
        if (resp?.data?.success) {
          Alert.alert('Success', 'Service request submitted successfully!');
          navigation.goBack();
        } else {
          Alert.alert('Error', resp?.data?.message || 'Failed to submit request');
        }
      } catch (error) {
        setError('Failed to submit request');
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Contact">
        {(props) => (
          <View style={{ flex: 1 }}>
            <StepHeader navigation={props.navigation} routeName="Contact" />
            <ContactStepScreen
              {...props}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={() => nextStep(props.navigation)}
              onBack={() => prevStep(props.navigation)}
              addressQuery={addressQuery}
              setAddressQuery={setAddressQuery}
              addressPredictions={addressPredictions}
              fetchAutocomplete={fetchAutocomplete}
              
              loadingAddress={loadingAddress}
              getCurrentLocation={getCurrentLocation}
              isGettingLocation={isGettingLocation}
              locationError={locationError}
            />
            <NavigationFooter
              canGoBack={false}
              canGoForward={true}
              onBack={() => prevStep(props.navigation)}
              onNext={() => nextStep(props.navigation)}
              isSubmitting={false}
              isLastStep={false}
            />
          </View>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Brand">
        {(props) => (
          <View style={{ flex: 1 }}>
            <StepHeader navigation={props.navigation} routeName="Brand" />
            <BrandStepScreen
              {...props}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={() => nextStep(props.navigation)}
              onBack={() => prevStep(props.navigation)}
              brands={brands}
              brandSearchQuery={searchQuery}
              setBrandSearchQuery={setSearchQuery}
              customBrand={customBrand}
              setCustomBrand={setCustomBrand}
            />
            <NavigationFooter
              canGoBack={true}
              canGoForward={true}
              onBack={() => prevStep(props.navigation)}
              onNext={() => nextStep(props.navigation)}
              isSubmitting={false}
              isLastStep={false}
            />
          </View>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Model">
        {(props) => (
          <View style={{ flex: 1 }}>
            <StepHeader navigation={props.navigation} routeName="Model" />
            <ModelStepScreen
              {...props}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={() => nextStep(props.navigation)}
              onBack={() => prevStep(props.navigation)}
              models={models}
              modelSearchQuery={searchQuery}
              setModelSearchQuery={setSearchQuery}
            />
            <NavigationFooter
              canGoBack={true}
              canGoForward={true}
              onBack={() => prevStep(props.navigation)}
              onNext={() => nextStep(props.navigation)}
              isSubmitting={false}
              isLastStep={false}
            />
          </View>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Problem">
        {(props) => (
          <View style={{ flex: 1 }}>
            <StepHeader navigation={props.navigation} routeName="Problem" />
            <ProblemStepScreen
              {...props}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={() => nextStep(props.navigation)}
              onBack={() => prevStep(props.navigation)}
            />
            <NavigationFooter
              canGoBack={true}
              canGoForward={true}
              onBack={() => prevStep(props.navigation)}
              onNext={() => nextStep(props.navigation)}
              isSubmitting={false}
              isLastStep={false}
            />
          </View>
        )}
      </Stack.Screen>

      <Stack.Screen name="DateTime">
        {(props) => (
          <View style={{ flex: 1 }}>
            <StepHeader navigation={props.navigation} routeName="DateTime" />
            <DateTimeStepScreen
              {...props}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={() => nextStep(props.navigation)}
              onBack={() => prevStep(props.navigation)}
            />
            <NavigationFooter
              canGoBack={true}
              canGoForward={true}
              onBack={() => prevStep(props.navigation)}
              onNext={() => nextStep(props.navigation)}
              isSubmitting={false}
              isLastStep={false}
            />
          </View>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Images">
        {(props) => (
          <View style={{ flex: 1 }}>
            <StepHeader navigation={props.navigation} routeName="Images" />
            <ImagesStepScreen
              {...props}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={() => nextStep(props.navigation)}
              onBack={() => prevStep(props.navigation)}
            />
            <NavigationFooter
              canGoBack={true}
              canGoForward={true}
              onBack={() => prevStep(props.navigation)}
              onNext={() => nextStep(props.navigation)}
              isSubmitting={false}
              isLastStep={false}
            />
          </View>
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Review">
        {(props) => (
          <View style={{ flex: 1 }}>
            <StepHeader navigation={props.navigation} routeName="Review" />
            <ReviewStepScreen
              {...props}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={() => handleSubmit(props.navigation)}
              onBack={() => prevStep(props.navigation)}
              calculatedPricing={calculatedPricing}
              problemCategories={[]}
              TIME_SLOTS={TIME_SLOTS}
            />
            <NavigationFooter
              canGoBack={true}
              canGoForward={true}
              onBack={() => prevStep(props.navigation)}
              onNext={() => handleSubmit(props.navigation)}
              isSubmitting={isSubmitting}
              isLastStep={true}
            />
          </View>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function NavigationFooter({
  canGoBack,
  canGoForward,
  onBack,
  onNext,
  isSubmitting,
  isLastStep,
}: {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
}) {
  const { colors, spacing } = useTheme();

  return (
    <View style={{
      flexDirection: 'row' as const,
      padding: spacing.md,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: spacing.md,
    }}>
      {canGoBack ? (
        <Button
          title="Back"
          onPress={onBack}
          variant="outline"
          style={{ flex: 1 }}
        />
      ) : (
        <View style={{ flex: 1 }} />
      )}
      
      {canGoForward ? (
        <Button
          title="Continue"
          onPress={onNext}
          style={{ flex: 1 }}
        />
      ) : (
        <Button
          title={isSubmitting ? 'Submitting...' : 'Submit Request'}
          onPress={onNext}
          disabled={isSubmitting}
          loading={isSubmitting}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}
