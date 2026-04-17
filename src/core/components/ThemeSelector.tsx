import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme';
import type { ThemeMode } from '../theme/ThemeContext';

import Sun from "../../assets/icons/sun.svg";
import Moon from "../../assets/icons/moon.svg";

type ThemeSelectorProps = {
  currentMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  isCompact?: boolean;
};

export function ThemeSelector({
  currentMode,
  onModeChange,
  isCompact = false,
}: ThemeSelectorProps) {
  const { themeMode, setThemeMode } = useTheme();
  const resolvedMode = currentMode ?? themeMode;
  const resolvedModeChange = onModeChange ?? setThemeMode;

  const handleToggle = () => {
    const newMode: ThemeMode = resolvedMode === 'light' ? 'dark' : 'light';
    resolvedModeChange(newMode);
  };

  // if (isCompact) {
  //   return (
  //     <TouchableOpacity
  //       style={[styles.compactButton]}
  //       onPress={handleToggle}
  //     >
  //       {currentMode === 'dark' ? <Sun width={16} height={16} fill={"rgb(255, 179, 0)"} stroke={"white"} /> : <Moon width={16} height={16} />}
  //     </TouchableOpacity>
  //   );
  // }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={handleToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {resolvedMode === 'dark' ? <Sun width={20} height={20} stroke={'#ffffff'} /> : <Moon width={20} height={20} stroke={"#444444"}/>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});
