import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_ID_KEY = '@fix4ever/session_id';

function buildSessionId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `sess_${Date.now()}_${random}`;
}

export async function getStoredSessionId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SESSION_ID_KEY);
  } catch {
    return null;
  }
}

export async function getOrCreateSessionId(): Promise<string> {
  const existing = await getStoredSessionId();
  if (existing) {
    return existing;
  }

  const generated = buildSessionId();
  try {
    await AsyncStorage.setItem(SESSION_ID_KEY, generated);
  } catch {
    // Continue with generated id even if persistence fails.
  }
  return generated;
}