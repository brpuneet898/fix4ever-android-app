/**
 * App config – API base URL aligned with backend.
 *
 * Development:
 * - iOS Simulator / Web: localhost:8080
 * - Android Emulator: 10.0.2.2:8080 (emulator's alias for host machine)
 * - Physical device: set DEV_API_HOST to your machine's IP (e.g. 192.168.1.10)
 *
 * Production: set API_BASE_URL or use the default below.
 */
import { Platform } from 'react-native';

const DEFAULT_DEV_PORT = '8080';
const DEFAULT_PROD_BASE = 'https://api.fix4ever.com';

/** Override for physical device testing: set to your machine IP, e.g. "192.168.1.10" */
const DEV_API_HOST_OVERRIDE: string | null = null;

function getDevHost(): string {
  if (DEV_API_HOST_OVERRIDE) return DEV_API_HOST_OVERRIDE;
  return Platform.OS === 'android' ? '10.44.48.60' : 'localhost';
}

function getAPIBaseURL(): string {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const host = getDevHost();
    const port = DEFAULT_DEV_PORT;
    if (host.match("https")) {
      return `${host}/api`;
    }
    return `http://${host}:${port}/api`;
  }
  return `${DEFAULT_PROD_BASE}/api`;
}

export const config = {
  get API_BASE_URL(): string {
    console.log(getAPIBaseURL())
    return getAPIBaseURL();
  },
} as const;


