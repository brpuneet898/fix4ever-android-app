import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../api';

const TOKEN_KEY = '@fix4ever/auth_token';
const USER_KEY = '@fix4ever/auth_user';
const REFRESH_TOKEN_KEY = '@fix4ever/refresh_token';

export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function getStoredUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function getStoredRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setAuth(token: string, user: User, refreshToken?: string): Promise<void> {
  try {
    const pairs: [string, string][] = [
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ];
    if (refreshToken) {
      pairs.push([REFRESH_TOKEN_KEY, refreshToken]);
    }
    await AsyncStorage.multiSet(pairs);
  } catch {
    // ignore
  }
}

export async function clearAuth(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, REFRESH_TOKEN_KEY]);
  } catch {
    // ignore
  }
}
