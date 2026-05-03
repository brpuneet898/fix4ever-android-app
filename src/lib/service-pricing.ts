// Service Pricing Configuration
// This file contains the pricing structure for different laptop problems and service types
// Update the prices here to modify service charges across the application

export interface ProblemCategory {
  id: string;
  name: string;
  description: string;
  basePrice: PriceRange;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  commonIssues: string[];
}

export interface ServiceTypePricing {
  pickupDrop: number;
  visitShop: number;
  onsite: number;
}

export interface PricingTier {
  name: string;
  multiplier: number;
  description: string;
}

// New pricing model (Base price + service type fee + addons)
export type IssueLevel = 'software' | 'hardware' | 'board';

export interface PriceRange {
  min: number;
  max: number;
}

export interface B2BPriceRange {
  software?: PriceRange;
  hardware?: PriceRange;
  board?: PriceRange;
}

// Simplified pricing constants
export const PICKUP_DROP_FEE = 249; // ₹249 for pickup-drop service
export const ONSITE_FEE = 149; // ₹149 for onsite service
export const VISIT_SHOP_FEE = 0; // ₹0 for visit-shop service

// Optional per-city alpha overrides. Keep empty by default; add entries as needed.
export const PRICING_CITY_ALPHA: Record<string, number> = {
  mumbai: 1.15,
  'delhi ncr': 1.12,
  bengaluru: 1.05,
  bangalore: 1.05,
  chennai: 1.0,
  hyderabad: 1.0,
  pune: 1.0,
  kolkata: 0.95,
  jaipur: 0.95,
  indore: 0.93,
  bhopal: 0.9,
  patna: 0.9,
  varanasi: 0.88,
  guwahati: 0.9,
};

// Beta components
export type UrgencyLevel = 'standard' | 'express' | 'urgent';
export interface BetaParams {
  brand?: string; // normalized to lowercase
  serviceType?: 'pickup-drop' | 'visit-shop' | 'onsite';
  urgency?: UrgencyLevel;
  warranty?: boolean;
  dataSafety?: boolean;
}

// Brand/category multipliers (fallback 1)
export const BRAND_MULTIPLIERS: Record<string, number> = {
  apple: 1.1,
  dell: 1.0,
  hp: 1.0,
  lenovo: 1.0,
  asus: 1.0,
  acer: 0.98,
};

export const SERVICE_MODE_MULTIPLIERS: Record<'pickup-drop' | 'visit-shop' | 'onsite', number> = {
  'pickup-drop': 1.0,
  'visit-shop': 1.0,
  onsite: 1.0,
};

export const URGENCY_MULTIPLIERS: Record<UrgencyLevel, number> = {
  standard: 1.0,
  express: 1.1,
  urgent: 1.2,
};

export const WARRANTY_MULTIPLIER = 1.05; // adds small margin for warranty handling
export const DATA_SAFETY_MULTIPLIER = 1.05; // adds small margin for secure handling

// Model multipliers (beta factor)
export const MODEL_MULTIPLIERS: Record<string, number> = {
  'macbook air': 1.15,
  'macbook pro': 1.2,
  macbook: 1.1,
  inspiron: 1.0,
  xps: 1.1,
  latitude: 1.05,
  pavilion: 1.0,
  envy: 1.05,
  spectre: 1.1,
  thinkpad: 1.05,
  ideapad: 1.0,
  yoga: 1.1,
  zenbook: 1.05,
  vivobook: 1.0,
  aspire: 1.0,
  swift: 1.0,
  predator: 1.1,
  other: 1.0,
};

// Issue level multipliers
export const ISSUE_LEVEL_MULTIPLIERS: Record<IssueLevel, number> = {
  software: 1.0,
  hardware: 1.2,
  board: 1.5,
};

export const PROBLEM_B2B_PRICING: Record<string, B2BPriceRange> = {
  'slow-performance-hanging': {
    software: { min: 350, max: 950 },
    hardware: { min: 350, max: 950 },
    board: { min: 750, max: 1350 },
  },
  overheating: {
    software: { min: 350, max: 950 },
    hardware: { min: 450, max: 1050 },
    board: { min: 750, max: 1350 },
  },
  'battery-issue': {
    software: { min: 250, max: 250 },
    hardware: { min: 250, max: 250 },
    board: { min: 350, max: 350 },
  },
  'laptop-not-powering-on': {
    software: { min: 750, max: 3500 },
    hardware: { min: 750, max: 3500 },
    board: { min: 750, max: 3500 },
  },
  'blue-screen-os-errors': {
    software: { min: 350, max: 550 },
    hardware: { min: 750, max: 1150 },
    board: { min: 750, max: 1350 },
  },
  'auto-shutdown-restart': {
    software: { min: 350, max: 950 },
    hardware: { min: 450, max: 1050 },
    board: { min: 750, max: 1350 },
  },
  'keyboard-issue-replacement': {
    software: { min: 450, max: 750 },
    hardware: { min: 450, max: 750 },
    board: { min: 650, max: 950 },
  },
  'screen-display-problems': {
    software: { min: 450, max: 750 },
    hardware: { min: 450, max: 750 },
    board: { min: 650, max: 950 },
  },
  'hinges-broken': {
    software: { min: 1450, max: 1750 },
    hardware: { min: 1450, max: 1750 },
    board: { min: 1750, max: 2050 },
  },
  'touchpad-issue': {
    software: { min: 350, max: 550 },
    hardware: { min: 350, max: 550 },
    board: { min: 550, max: 750 },
  },
  'wifi-bluetooth-not-connecting': {
    software: { min: 350, max: 350 },
    hardware: { min: 450, max: 450 },
    board: { min: 650, max: 650 },
  },
  'hard-disk-ssd-failure': {
    software: { min: 350, max: 550 },
    hardware: { min: 450, max: 650 },
    board: { min: 650, max: 850 },
  },
  'ssd-upgrade': {
    software: { min: 350, max: 550 },
    hardware: { min: 350, max: 550 },
    board: { min: 550, max: 750 },
  },
  'noise-from-fan': {
    software: { min: 150, max: 150 },
    hardware: { min: 250, max: 250 },
    board: { min: 450, max: 450 },
  },
  'usb-charging-port-fault': {
    software: { min: 2500, max: 2500 },
    hardware: { min: 2500, max: 2500 },
    board: { min: 2500, max: 2500 },
  },
  'power-socket-dc-jack': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'lan-port-issue': {
    software: { min: 350, max: 350 },
    hardware: { min: 450, max: 450 },
    board: { min: 650, max: 650 },
  },
  'water-liquid-damage': {
    software: { min: 750, max: 2500 },
    hardware: { min: 750, max: 2500 },
    board: { min: 750, max: 2500 },
  },
  'body-panel-damage': {
    software: { min: 350, max: 750 },
    hardware: { min: 350, max: 750 },
    board: { min: 550, max: 950 },
  },
  'bios-issue': {
    software: { min: 450, max: 750 },
    hardware: { min: 650, max: 950 },
    board: { min: 850, max: 1150 },
  },
  'charger-adapter-faulty': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'speaker-audio-not-working': {
    software: { min: 150, max: 450 },
    hardware: { min: 150, max: 450 },
    board: { min: 350, max: 650 },
  },
  'microphone-not-working': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'camera-not-working': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'backlight-brightness-issue': {
    software: { min: 450, max: 750 },
    hardware: { min: 450, max: 750 },
    board: { min: 650, max: 950 },
  },
  'graphics-card-issue-gpu': {
    software: { min: 1500, max: 2500 },
    hardware: { min: 1500, max: 2500 },
    board: { min: 1500, max: 2500 },
  },
  'overheating-fan-replacement': {
    software: { min: 450, max: 750 },
    hardware: { min: 450, max: 750 },
    board: { min: 650, max: 950 },
  },
  'hdd-ssd-connector-issue': {
    software: { min: 450, max: 950 },
    hardware: { min: 450, max: 950 },
    board: { min: 650, max: 1150 },
  },
  'ram-slot-fault': {
    software: { min: 250, max: 250 },
    hardware: { min: 250, max: 250 },
    board: { min: 450, max: 450 },
  },
  'cmos-battery-issue': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'bios-password-locked': {
    software: { min: 450, max: 750 },
    hardware: { min: 650, max: 950 },
    board: { min: 850, max: 1150 },
  },
  'trackpoint-joystick-not-working': {
    software: { min: 350, max: 350 },
    hardware: { min: 450, max: 450 },
    board: { min: 650, max: 650 },
  },
  'fingerprint-sensor-not-working': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'tpm-security-chip-issue': {
    software: { min: 750, max: 2500 },
    hardware: { min: 750, max: 2500 },
    board: { min: 750, max: 2500 },
  },
  'system-auto-beeping': {
    software: { min: 750, max: 1500 },
    hardware: { min: 750, max: 1500 },
    board: { min: 950, max: 1700 },
  },
  'liquid-damage-sticky-keyboard': {
    software: { min: 750, max: 2500 },
    hardware: { min: 750, max: 2500 },
    board: { min: 750, max: 2500 },
  },
  'broken-loose-usb-port': {
    software: { min: 350, max: 350 },
    hardware: { min: 450, max: 450 },
    board: { min: 650, max: 650 },
  },
  'charging-fluctuation-overheating-adapter': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'motherboard-ic-mosfet-short': {
    software: { min: 450, max: 950 },
    hardware: { min: 450, max: 950 },
    board: { min: 650, max: 1150 },
  },
  'fan-always-running-high-speed': {
    software: { min: 250, max: 250 },
    hardware: { min: 250, max: 250 },
    board: { min: 450, max: 450 },
  },
  'dust-inside-speakers-mic-distortion': {
    software: { min: 150, max: 450 },
    hardware: { min: 150, max: 450 },
    board: { min: 350, max: 650 },
  },
  'display-connector-cable-fault': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'touchscreen-not-working': {
    software: { min: 450, max: 750 },
    hardware: { min: 450, max: 750 },
    board: { min: 650, max: 950 },
  },
  'fingerprint-ir-camera-windows-hello': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'keyboard-backlight-not-working': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'broken-missing-keys-only': {
    software: { min: 350, max: 350 },
    hardware: { min: 450, max: 450 },
    board: { min: 650, max: 650 },
  },
  'system-firmware-driver-corruption': {
    software: { min: 450, max: 450 },
    hardware: { min: 650, max: 650 },
    board: { min: 850, max: 850 },
  },
  'dual-boot-os-configuration': {
    software: { min: 500, max: 500 },
    hardware: { min: 700, max: 700 },
    board: { min: 900, max: 900 },
  },
  'bitlocker-encryption-issue': {
    software: { min: 750, max: 950 },
    hardware: { min: 950, max: 1150 },
    board: { min: 1150, max: 1350 },
  },
  'laptop-body-replacement': {
    software: { min: 1750, max: 2750 },
    hardware: { min: 1750, max: 2750 },
    board: { min: 1950, max: 2950 },
  },
};

export function getCityAlpha(city?: string, alphaOverride?: number): number {
  if (typeof alphaOverride === 'number' && !Number.isNaN(alphaOverride)) return alphaOverride;
  if (!city) return 1;
  const key = city.trim().toLowerCase();
  return PRICING_CITY_ALPHA[key] ?? 1;
}

export function getB2BPriceRange(
  problemType: string,
  issueLevel: IssueLevel
): PriceRange | undefined {
  const row = PROBLEM_B2B_PRICING[problemType];
  if (!row) return undefined;
  return row[issueLevel];
}

export function calculateServiceChargeV2(params: {
  knowsProblem: boolean;
  problemType: string;
  issueLevel: IssueLevel;
  serviceType?: 'pickup-drop' | 'visit-shop' | 'onsite';
  warrantyOption?: 'none' | '30days' | '3months';
  urgencyLevel?: 'normal' | 'express' | 'urgent';
  dataSafety?: boolean;
}): {
  serviceChargeRange: PriceRange;
  netChargeRange: PriceRange;
  fixedFee: number;
  serviceTypeFee: number;
  warrantyFee: number;
  urgencyFee: number;
  dataSafetyFee: number;
  finalChargeRange: PriceRange;
  breakdown: string[];
} {
  const {
    problemType,
    issueLevel,
    serviceType = 'pickup-drop',
    warrantyOption = 'none',
    urgencyLevel = 'normal',
    dataSafety = false,
    knowsProblem = false,
  } = params;

  // ✅ CASE: User does NOT know the problem
  if (!knowsProblem) {
    // Only pickup-drop shows captain charges
    if (serviceType === 'pickup-drop') {
      return {
        serviceChargeRange: { min: 0, max: 0 },
        netChargeRange: { min: 0, max: 0 },
        fixedFee: 0,
        serviceTypeFee: 250,
        warrantyFee: 0,
        urgencyFee: 0,
        dataSafetyFee: 0,
        finalChargeRange: { min: 250, max: 250 },
        breakdown: [`Captain Charges (Pickup & Drop): ₹250`, `Total Amount: ₹250`],
      };
    }

    // ❌ Other service types → UI should show existing text
    throw new Error('Pricing pending verification');
  }

  // Get base service charge range (B2B price)
  const serviceChargeRange = getB2BPriceRange(problemType, issueLevel);
  if (!serviceChargeRange) {
    throw new Error(`Service charge not configured for ${problemType} (${issueLevel})`);
  }

  // SIMPLIFIED PRICING MODEL:
  // Net Charge = Base Price Range (no fixed fee, no commission)
  const netChargeRange = {
    min: serviceChargeRange.min,
    max: serviceChargeRange.max,
  };

  // No fixed fee
  const fixedFee = 0;

  // Get service type fee based on service type
  let serviceTypeFee = 0;
  if (serviceType === 'pickup-drop') {
    serviceTypeFee = 249; // ₹249 for pickup-drop
  } else if (serviceType === 'visit-shop') {
    serviceTypeFee = 0; // ₹0 for visit-shop (customer goes to vendor)
  } else if (serviceType === 'onsite') {
    serviceTypeFee = 149; // ₹149 for onsite
  }

  // Calculate addon fees
  const warrantyFee =
    warrantyOption === 'none'
      ? 0
      : warrantyOption === '30days'
        ? 149
        : warrantyOption === '3months'
          ? 299
          : 0;

  const urgencyFee =
    urgencyLevel === 'normal'
      ? 0
      : urgencyLevel === 'express'
        ? 250
        : urgencyLevel === 'urgent'
          ? 500
          : 0;

  const dataSafetyFee = dataSafety ? 499 : 0;

  // Calculate final charge range: Net Charge + Service Type Fee + Addon Fees
  const finalChargeRange = {
    min: netChargeRange.min + serviceTypeFee + warrantyFee + urgencyFee + dataSafetyFee,
    max: netChargeRange.max + serviceTypeFee + warrantyFee + urgencyFee + dataSafetyFee,
  };

  const pricingData = {
    serviceChargeRange,
    netChargeRange,
    fixedFee,
    serviceTypeFee,
    warrantyFee,
    urgencyFee,
    dataSafetyFee,
    finalChargeRange,
    breakdown: [
      `Net Charge: ₹${netChargeRange.min}-${netChargeRange.max}`,
      `Service Mode Fee (${serviceType}): ₹${serviceTypeFee}`,
      ...(warrantyFee > 0 || urgencyFee > 0 || dataSafetyFee > 0
        ? [
            `Addons Charge: ₹${warrantyFee + urgencyFee + dataSafetyFee}`,
            ...(warrantyFee > 0
              ? [
                  `  - Warranty (${warrantyOption === 'none' ? '7 Days' : warrantyOption}): ₹${warrantyFee}`,
                ]
              : []),
            ...(urgencyFee > 0 ? [`  - Urgency (${urgencyLevel}): ₹${urgencyFee}`] : []),
            ...(dataSafetyFee > 0 ? [`  - Data Safety: ₹${dataSafetyFee}`] : []),
          ]
        : []),
      `Total Amount: ₹${finalChargeRange.min}-${finalChargeRange.max}`,
    ],
  };

  return pricingData;
}

// Utility function to get user-safe pricing data
export function getUserSafePricing(pricingData: ReturnType<typeof calculateServiceChargeV2>): {
  serviceChargeRange: PriceRange;
  netChargeRange: PriceRange;
  fixedFee: number;
  serviceTypeFee: number;
  warrantyFee: number;
  urgencyFee: number;
  dataSafetyFee: number;
  finalChargeRange: PriceRange;
  breakdown: string[];
} {
  return {
    serviceChargeRange: pricingData.serviceChargeRange,
    netChargeRange: pricingData.netChargeRange,
    fixedFee: pricingData.fixedFee,
    serviceTypeFee: pricingData.serviceTypeFee,
    warrantyFee: pricingData.warrantyFee,
    urgencyFee: pricingData.urgencyFee,
    dataSafetyFee: pricingData.dataSafetyFee,
    finalChargeRange: pricingData.finalChargeRange,
    breakdown: pricingData.breakdown,
  };
}

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: 'slow-performance-hanging',
    name: 'Slow Laptop',
    description: 'Device running significantly slower than expected or frequently hanging',
    basePrice: { min: 350, max: 950 },
    complexity: 'low',
    estimatedTime: '3H',
    commonIssues: [
      'Malware',
      'Too many startup programs',
      'Low disk space',
      'Outdated drivers',
      'Memory issues',
    ],
  },
  {
    id: 'overheating',
    name: 'Overheating Issue',
    description: 'Device gets excessively hot during use',
    basePrice: { min: 350, max: 950 },
    complexity: 'medium',
    estimatedTime: '6H',
    commonIssues: [
      'Dust accumulation',
      'Fan failure',
      'Thermal paste degradation',
      'Blocked vents',
    ],
  },
  {
    id: 'battery-issue',
    name: 'Battery replacement',
    description: 'Battery not charging or very short battery life',
    basePrice: { min: 250, max: 250 },
    complexity: 'low',
    estimatedTime: '30 Min',
    commonIssues: [
      'Battery replacement needed',
      'Charging port damage',
      'Power management issues',
      'Adapter problems',
    ],
  },
  {
    id: 'laptop-not-powering-on',
    name: 'No Power Case',
    description: 'Device completely unresponsive, no power indication',
    basePrice: { min: 750, max: 3500 },
    complexity: 'critical',
    estimatedTime: '3D',
    commonIssues: [
      'Power adapter failure',
      'Battery issues',
      'Motherboard problems',
      'Power button damage',
    ],
  },
  {
    id: 'blue-screen-os-errors',
    name: 'OS Installation',
    description: 'Frequent system crashes, blue screen errors',
    basePrice: { min: 350, max: 550 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: [
      'Driver conflicts',
      'Hardware incompatibility',
      'Memory issues',
      'System corruption',
    ],
  },
  {
    id: 'auto-shutdown-restart',
    name: 'Auto Shutdown / Restart',
    description: 'Device automatically shuts down or restarts unexpectedly',
    basePrice: { min: 350, max: 950 },
    complexity: 'high',
    estimatedTime: '2-4 hours',
    commonIssues: ['Overheating', 'Power supply issues', 'Hardware failure', 'Software conflicts'],
  },
  {
    id: 'keyboard-issue-replacement',
    name: 'Keyboard Replacement',
    description: 'Keys not working, keyboard replacement needed',
    basePrice: { min: 450, max: 750 },
    complexity: 'medium',
    estimatedTime: '6H',
    commonIssues: ['Stuck keys', 'Non-responsive keys', 'Keyboard replacement', 'Liquid damage'],
  },
  {
    id: 'screen-display-problems',
    name: 'Display Replacement',
    description: 'Display issues, cracked screen, or display not working',
    basePrice: { min: 450, max: 750 },
    complexity: 'high',
    estimatedTime: '3H',
    commonIssues: ['Cracked screen', 'Dead pixels', 'Backlight failure', 'Display cable issues'],
  },
  {
    id: 'hinges-broken',
    name: 'Hinges Rework',
    description: 'Laptop hinges damaged or broken',
    basePrice: { min: 1450, max: 1750 },
    complexity: 'high',
    estimatedTime: '1D',
    commonIssues: [
      'Hinge replacement',
      'Structural damage',
      'Screen alignment issues',
      'Cable damage',
    ],
  },
  {
    id: 'touchpad-issue',
    name: 'Touchpad Issue',
    description: 'Touchpad not working or unresponsive',
    basePrice: { min: 350, max: 550 },
    complexity: 'medium',
    estimatedTime: '1D',
    commonIssues: [
      'Touchpad not responding',
      'Erratic cursor movement',
      'Click issues',
      'Driver problems',
    ],
  },
  {
    id: 'wifi-bluetooth-not-connecting',
    name: 'WiFi / Bluetooth Not Connecting',
    description: 'Wireless connectivity problems',
    basePrice: { min: 350, max: 350 },
    complexity: 'low',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'WiFi not connecting',
      'Bluetooth not working',
      'Driver issues',
      'Hardware failure',
    ],
  },
  {
    id: 'hard-disk-ssd-failure',
    name: 'Hard Disk / SSD Failure',
    description: 'Storage device failure or data recovery',
    basePrice: { min: 350, max: 550 },
    complexity: 'high',
    estimatedTime: '2-6 hours',
    commonIssues: ['Hard drive failure', 'Data recovery', 'SSD replacement', 'Partition issues'],
  },
  {
    id: 'ssd-upgrade',
    name: 'SSD Upgradation',
    description: 'Solid state drive upgrade service',
    basePrice: { min: 350, max: 550 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: [
      'SSD installation',
      'Data migration',
      'OS installation',
      'Performance optimization',
    ],
  },
  {
    id: 'noise-from-fan',
    name: 'Fan Noise',
    description: 'Excessive fan noise or fan not working properly',
    basePrice: { min: 150, max: 150 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: ['Fan replacement', 'Fan cleaning', 'Excessive noise', 'Thermal issues'],
  },
  {
    id: 'usb-charging-port-fault',
    name: 'Type C charging Port Replacement',
    description: 'USB ports or charging port not working',
    basePrice: { min: 2500, max: 2500 },
    complexity: 'high',
    estimatedTime: '1D',
    commonIssues: [
      'USB port failure',
      'Charging port issues',
      'Port replacement',
      'Connection problems',
    ],
  },
  {
    id: 'power-socket-dc-jack',
    name: 'Power Socket (DC Jack / Capacitor)',
    description: 'Power socket or DC jack issues',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '1-3 hours',
    commonIssues: [
      'DC jack replacement',
      'Power socket repair',
      'Capacitor issues',
      'Soldering work',
    ],
  },
  {
    id: 'lan-port-issue',
    name: 'LAN Network Issue',
    description: 'Ethernet port not working',
    basePrice: { min: 350, max: 350 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: [
      'LAN port replacement',
      'Network card issues',
      'Driver problems',
      'Physical damage',
    ],
  },
  {
    id: 'water-liquid-damage',
    name: 'Water / Liquid Damage',
    description: 'Liquid damage repair and restoration',
    basePrice: { min: 750, max: 2500 },
    complexity: 'critical',
    estimatedTime: '1-3 days',
    commonIssues: [
      'Liquid spill damage',
      'Corrosion cleaning',
      'Component replacement',
      'Data recovery',
    ],
  },
  {
    id: 'body-panel-damage',
    name: 'Back Panel Cabinet +Blocks Damages',
    description: 'Housing, panels, or physical damage repair',
    basePrice: { min: 350, max: 750 },
    complexity: 'high',
    estimatedTime: '1D',
    commonIssues: ['Housing replacement', 'Panel repair', 'Dent repair', 'Structural damage'],
  },
  {
    id: 'bios-issue',
    name: 'BIOS Issue',
    description: 'BIOS problems or system configuration issues',
    basePrice: { min: 450, max: 750 },
    complexity: 'high',
    estimatedTime: '2-4 hours',
    commonIssues: ['BIOS corruption', 'Boot issues', 'System configuration', 'Firmware problems'],
  },
  {
    id: 'charger-adapter-faulty',
    name: 'Charger / Adapter Faulty',
    description: 'Charging problems or adapter replacement',
    basePrice: { min: 450, max: 450 },
    complexity: 'low',
    estimatedTime: '30 minutes - 1 hour',
    commonIssues: [
      'Charger replacement',
      'Charging port repair',
      'Power adapter issues',
      'Cable problems',
    ],
  },
  {
    id: 'speaker-audio-not-working',
    name: 'Speaker Repalcement',
    description: 'Speaker or audio output issues',
    basePrice: { min: 150, max: 450 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: [
      'Speaker replacement',
      'Audio driver problems',
      'Sound card issues',
      'Connection problems',
    ],
  },
  {
    id: 'microphone-not-working',
    name: 'Microphone Not Working',
    description: 'Microphone not functioning properly',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'Microphone replacement',
      'Driver issues',
      'Privacy settings',
      'Hardware failure',
    ],
  },
  {
    id: 'camera-not-working',
    name: 'Camera Not Working',
    description: 'Webcam or camera not functioning',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: [
      'Camera replacement',
      'Driver issues',
      'Privacy shutter problems',
      'Connection issues',
    ],
  },
  {
    id: 'backlight-brightness-issue',
    name: 'Backlight / Brightness Issue',
    description: 'Screen backlight not working or brightness problems',
    basePrice: { min: 450, max: 750 },
    complexity: 'high',
    estimatedTime: '2-3 hours',
    commonIssues: ['Backlight replacement', 'Inverter issues', 'Dim display', 'Flickering screen'],
  },
  {
    id: 'graphics-card-issue-gpu',
    name: 'Gamming Board Chip Service',
    description: 'GPU problems or graphics performance issues',
    basePrice: { min: 1500, max: 2500 },
    complexity: 'high',
    estimatedTime: '3D',
    commonIssues: [
      'GPU failure',
      'Graphics driver issues',
      'Performance problems',
      'Artifacts on screen',
    ],
  },
  {
    id: 'overheating-fan-replacement',
    name: 'Thermal Paste',
    description: 'Overheating issues requiring fan replacement',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '2H',
    commonIssues: [
      'Fan replacement',
      'Thermal paste application',
      'Dust cleaning',
      'Temperature monitoring',
    ],
  },
  {
    id: 'hdd-ssd-connector-issue',
    name: 'Deep Board Cleaning Service',
    description: 'Storage device connector problems',
    basePrice: { min: 450, max: 950 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: ['Connector replacement', 'Cable issues', 'SATA port problems', 'Data recovery'],
  },
  {
    id: 'ram-slot-fault',
    name: 'RAM Upgrade Service',
    description: 'Memory slot issues or RAM problems',
    basePrice: { min: 250, max: 250 },
    complexity: 'low',
    estimatedTime: '1H',
    commonIssues: ['RAM slot replacement', 'Memory upgrade', 'RAM slot issues', 'Memory errors'],
  },
  {
    id: 'cmos-battery-issue',
    name: 'CMOS Battery Issue',
    description: 'CMOS battery problems affecting system settings',
    basePrice: { min: 450, max: 450 },
    complexity: 'low',
    estimatedTime: '30 minutes - 1 hour',
    commonIssues: [
      'CMOS battery replacement',
      'BIOS settings reset',
      'Time/date issues',
      'Boot problems',
    ],
  },
  {
    id: 'bios-password-locked',
    name: 'Password remove',
    description: 'BIOS password reset or unlock service',
    basePrice: { min: 450, max: 750 },
    complexity: 'medium',
    estimatedTime: '3H',
    commonIssues: ['Password reset', 'BIOS unlock', 'Security chip issues', 'System access'],
  },
  {
    id: 'trackpoint-joystick-not-working',
    name: 'Trackpoint / Joystick not working',
    description: 'Trackpoint or pointing stick not functioning',
    basePrice: { min: 350, max: 350 },
    complexity: 'medium',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'Trackpoint replacement',
      'Driver issues',
      'Hardware failure',
      'Calibration problems',
    ],
  },
  {
    id: 'fingerprint-sensor-not-working',
    name: 'Fingerprint Sensor Not Working',
    description: 'Fingerprint reader not functioning properly',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'Sensor replacement',
      'Driver issues',
      'Calibration problems',
      'Hardware failure',
    ],
  },
  {
    id: 'tpm-security-chip-issue',
    name: 'Non-Gamming Board issue',
    description: 'Trusted Platform Module or security chip problems',
    basePrice: { min: 750, max: 2500 },
    complexity: 'high',
    estimatedTime: '2D',
    commonIssues: [
      'TPM replacement',
      'Security chip issues',
      'Encryption problems',
      'System security',
    ],
  },
  {
    id: 'system-auto-beeping',
    name: 'System Auto Beeping (Beep Codes)',
    description: 'System producing beep codes or continuous beeping',
    basePrice: { min: 750, max: 1500 },
    complexity: 'medium',
    estimatedTime: '1D',
    commonIssues: [
      'Hardware failure diagnosis',
      'Memory issues',
      'Power problems',
      'Component failure',
    ],
  },
  {
    id: 'liquid-damage-sticky-keyboard',
    name: 'Liquid Damage Sticky Keyboard / Trackpad',
    description: 'Liquid damage causing sticky keys or trackpad',
    basePrice: { min: 750, max: 2500 },
    complexity: 'high',
    estimatedTime: '2-4 hours',
    commonIssues: [
      'Liquid cleaning',
      'Component replacement',
      'Sticky residue removal',
      'Prevention measures',
    ],
  },
  {
    id: 'broken-loose-usb-port',
    name: 'Broken / Loose USB Port',
    description: 'USB port physically damaged or loose',
    basePrice: { min: 350, max: 350 },
    complexity: 'medium',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'USB port replacement',
      'Soldering work',
      'Physical damage repair',
      'Connection issues',
    ],
  },
  {
    id: 'charging-fluctuation-overheating-adapter',
    name: 'Charging Fluctuation / Overheating Adapter Port',
    description: 'Inconsistent charging or overheating adapter port',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '1-3 hours',
    commonIssues: ['Port replacement', 'Adapter issues', 'Power management', 'Thermal problems'],
  },
  {
    id: 'motherboard-ic-mosfet-short',
    name: 'Motherboard IC / MOSFET short',
    description: 'Motherboard component failure or short circuit',
    basePrice: { min: 450, max: 950 },
    complexity: 'critical',
    estimatedTime: '1-2 days',
    commonIssues: ['Component replacement', 'Circuit repair', 'Power issues', 'System instability'],
  },
  {
    id: 'fan-always-running-high-speed',
    name: 'Fan Always Running at High Speed',
    description: 'Fan constantly running at maximum speed',
    basePrice: { min: 250, max: 250 },
    complexity: 'medium',
    estimatedTime: '1-3 hours',
    commonIssues: [
      'Thermal management',
      'Fan replacement',
      'Temperature sensor issues',
      'System optimization',
    ],
  },
  {
    id: 'dust-inside-speakers-mic-distortion',
    name: 'Dust Inside Speakers / Mic Distortion',
    description: 'Audio quality issues due to dust or distortion',
    basePrice: { min: 150, max: 450 },
    complexity: 'low',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'Dust cleaning',
      'Speaker replacement',
      'Microphone cleaning',
      'Audio optimization',
    ],
  },
  {
    id: 'display-connector-cable-fault',
    name: 'Display Connector Cable Fault',
    description: 'Display cable or connector issues',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '1-3 hours',
    commonIssues: ['Cable replacement', 'Connector repair', 'Display issues', 'Signal problems'],
  },
  {
    id: 'touchscreen-not-working',
    name: 'Touchscreen Not Working',
    description: 'Touchscreen functionality not working',
    basePrice: { min: 450, max: 750 },
    complexity: 'high',
    estimatedTime: '2-4 hours',
    commonIssues: [
      'Touchscreen replacement',
      'Driver issues',
      'Calibration problems',
      'Hardware failure',
    ],
  },
  {
    id: 'fingerprint-ir-camera-windows-hello',
    name: 'Fingerprint / IR Camera (Windows Hello) not working',
    description: 'Windows Hello authentication not working',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'IR camera replacement',
      'Driver issues',
      'Windows Hello setup',
      'Hardware failure',
    ],
  },
  {
    id: 'keyboard-backlight-not-working',
    name: 'Keyboard Backlight Not Working',
    description: 'Keyboard backlight not functioning',
    basePrice: { min: 450, max: 450 },
    complexity: 'medium',
    estimatedTime: '1-2 hours',
    commonIssues: [
      'Backlight replacement',
      'Driver issues',
      'Power management',
      'Hardware failure',
    ],
  },
  {
    id: 'broken-missing-keys-only',
    name: 'Broken / Missing Keys Only',
    description: 'Individual keys broken or missing',
    basePrice: { min: 350, max: 350 },
    complexity: 'low',
    estimatedTime: '30 minutes - 1 hour',
    commonIssues: ['Key replacement', 'Keycap repair', 'Mechanical issues', 'Cleaning'],
  },
  {
    id: 'system-firmware-driver-corruption',
    name: 'driver issue',
    description: 'System firmware or driver corruption issues',
    basePrice: { min: 350, max: 350 },
    complexity: 'high',
    estimatedTime: '3H',
    commonIssues: ['Firmware update', 'Driver reinstallation', 'System recovery', 'Boot repair'],
  },
  {
    id: 'dual-boot-os-configuration',
    name: 'Dual Boot / OS Configuration Issue',
    description: 'Dual boot setup or operating system configuration problems',
    basePrice: { min: 500, max: 500 },
    complexity: 'medium',
    estimatedTime: '4H',
    commonIssues: [
      'Boot loader repair',
      'OS installation',
      'Partition management',
      'System configuration',
    ],
  },
  {
    id: 'bitlocker-encryption-issue',
    name: 'OS Upgrade + without data loss',
    description: 'BitLocker or encryption problems',
    basePrice: { min: 750, max: 950 },
    complexity: 'high',
    estimatedTime: '1D',
    commonIssues: ['Encryption recovery', 'Key recovery', 'Data access', 'System repair'],
  },
  {
    id: 'laptop-body-replacement',
    name: 'Laptop Body Replacement (Full Chassis / Palmrest)',
    description: 'Complete laptop body or chassis replacement',
    basePrice: { min: 1750, max: 2750 },
    complexity: 'critical',
    estimatedTime: '1-2 days',
    commonIssues: [
      'Chassis replacement',
      'Component transfer',
      'Structural repair',
      'Full disassembly',
    ],
  },
];

export const SERVICE_TYPE_PRICING: ServiceTypePricing = {
  pickupDrop: PICKUP_DROP_FEE, // ₹249 for pickup and drop service
  visitShop: 0, // No additional charge for shop visits (customer goes to vendor)
  onsite: 500, // Additional charge for on-site service
};

export const URGENCY_PRICING: PricingTier[] = [
  {
    name: 'Standard',
    multiplier: 1.0,
    description: 'Normal service timeline (2-3 business days)',
  },
  {
    name: 'Express',
    multiplier: 1.5,
    description: 'Faster service (1-2 business days)',
  },
  {
    name: 'Urgent',
    multiplier: 2.0,
    description: 'Same day or next day service',
  },
];

export const COMPLEXITY_MULTIPLIERS = {
  low: 1.0,
  medium: 1.2,
  high: 1.5,
  critical: 2.0,
};

export const TRAVEL_COST_PER_KM = 10; // ₹10 per kilometer
export const MAX_TRAVEL_DISTANCE = 50; // Maximum 50km for service
export const EMERGENCY_FEE = 300; // ₹300 for urgent requests

// Calculate service charge based on problem type and service options
export function calculateServiceCharge(
  problemType: string,
  serviceType: 'pickup-drop' | 'visit-shop' | 'onsite',
  isUrgent: boolean = false,
  distance: number = 0
): {
  baseCharge: number;
  serviceTypeCharge: number;
  urgencyCharge: number;
  travelCharge: number;
  totalCharge: number;
  breakdown: string[];
} {
  const problem = PROBLEM_CATEGORIES.find(p => p.id === problemType);
  if (!problem) {
    throw new Error(`Unknown problem type: ${problemType}`);
  }

  let baseCharge = problem.basePrice.min; // Use minimum price for calculation
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[problem.complexity];
  baseCharge *= complexityMultiplier;

  // Service type additional charge
  const serviceTypeCharge =
    SERVICE_TYPE_PRICING[
      serviceType === 'pickup-drop'
        ? 'pickupDrop'
        : serviceType === 'visit-shop'
          ? 'visitShop'
          : 'onsite'
    ];

  // Urgency charge
  const urgencyMultiplier = isUrgent ? 1.5 : 1.0;
  const urgencyCharge = baseCharge * (urgencyMultiplier - 1);

  // Travel charge (only for pickup-drop and onsite)
  let travelCharge = 0;
  if (serviceType !== 'visit-shop') {
    const cappedDistance = Math.min(distance, MAX_TRAVEL_DISTANCE);
    travelCharge = cappedDistance * TRAVEL_COST_PER_KM;
  }

  const totalCharge = baseCharge + serviceTypeCharge + urgencyCharge + travelCharge;

  const breakdown = [
    `Base charge (${problem.name}): ₹${Math.round(baseCharge)}`,
    `Service type (${serviceType}): ₹${serviceTypeCharge}`,
    `Urgency fee: ₹${Math.round(urgencyCharge)}`,
    `Travel cost: ₹${travelCharge}`,
    `Total: ₹${Math.round(totalCharge)}`,
  ];

  return {
    baseCharge: Math.round(baseCharge),
    serviceTypeCharge,
    urgencyCharge: Math.round(urgencyCharge),
    travelCharge,
    totalCharge: Math.round(totalCharge),
    breakdown,
  };
}

// Get problem category by ID
export function getProblemCategory(problemId: string): ProblemCategory | undefined {
  return PROBLEM_CATEGORIES.find(p => p.id === problemId);
}

// Get all problem categories for display
export function getAllProblemCategories(): ProblemCategory[] {
  return PROBLEM_CATEGORIES;
}

// Get pricing tiers for urgency selection
export function getPricingTiers(): PricingTier[] {
  return URGENCY_PRICING;
}

export interface ProblemPricingCatalogEntry {
  mainProblemCategory: string;
  subProblem: string;
  relatedBehavior: string;
  defaultLevel?: 'L1' | 'L2' | 'L3' | 'L4';
  priceLabel: string;
  priceRange?: PriceRange;
  requiresManualQuote?: boolean;
}

export interface ProblemPricingLookupResult {
  matched: boolean;
  displayLabel: string;
  finalChargeRange: PriceRange;
  breakdown: string[];
  defaultLevel?: 'L1' | 'L2' | 'L3' | 'L4';
  requiresManualQuote: boolean;
  matchedEntry?: ProblemPricingCatalogEntry;
}

const normalizePricingText = (value?: string) =>
  (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const formatPriceLabel = (min: number, max: number) =>
  `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;

const createCatalogEntry = (
  mainProblemCategory: string,
  subProblem: string,
  relatedBehavior: string,
  defaultLevel: 'L1' | 'L2' | 'L3' | 'L4',
  min: number,
  max: number
): ProblemPricingCatalogEntry => ({
  mainProblemCategory,
  subProblem,
  relatedBehavior,
  defaultLevel,
  priceLabel: formatPriceLabel(min, max),
  priceRange: { min, max },
});

const createManualQuoteEntry = (
  mainProblemCategory: string,
  subProblem: string,
  relatedBehavior: string,
  defaultLevel?: 'L1' | 'L2' | 'L3' | 'L4'
): ProblemPricingCatalogEntry => ({
  mainProblemCategory,
  subProblem,
  relatedBehavior,
  defaultLevel,
  priceLabel: 'After Checking',
  requiresManualQuote: true,
});

export const LAPTOP_PROBLEM_PRICE_CATALOG: ProblemPricingCatalogEntry[] = [
  createCatalogEntry('Not Turning On', 'Laptop not turning on', 'No power light, no fan', 'L3', 1500, 3500),
  createCatalogEntry('Not Turning On', 'Laptop turns on then off', 'Shuts down in 5–10 sec', 'L2', 900, 1999),
  createCatalogEntry('Not Turning On', 'Stuck on logo', 'Logo repeats again and again', 'L1', 499, 999),
  createCatalogEntry('Not Turning On', 'Restart loop', 'Keeps restarting', 'L1', 499, 999),
  createCatalogEntry('Not Turning On', 'Works only on charger', 'Battery removed / dead', 'L1', 499, 999),
  createCatalogEntry('Not Turning On', 'No display but power on', 'Fan running, black screen', 'L2', 900, 1999),
  createCatalogEntry('Not Turning On', 'Dead after repair', 'Earlier technician repaired', 'L4', 2500, 7000),

  createCatalogEntry('Screen Problem', 'Screen broken', 'Physical crack visible', 'L1', 499, 999),
  createCatalogEntry('Screen Problem', 'Screen flickering', 'Flickers when lid moves', 'L2', 900, 1999),
  createCatalogEntry('Screen Problem', 'Black screen', 'External display works', 'L2', 900, 1999),
  createCatalogEntry('Screen Problem', 'Lines on screen', 'Vertical/horizontal lines', 'L1', 499, 999),
  createCatalogEntry('Screen Problem', 'Dim display', 'Brightness very low', 'L3', 1500, 3500),
  createCatalogEntry('Screen Problem', 'Touch not working', 'Touch stops responding', 'L2', 900, 1999),
  createCatalogEntry('Screen Problem', 'Half display visible', 'One side black', 'L2', 900, 1999),

  createCatalogEntry('Battery Problem', 'Battery drains fast', 'Less than 1 hour backup', 'L1', 499, 999),
  createCatalogEntry('Battery Problem', 'Battery not charging', 'Charging stuck at 0%', 'L2', 900, 1999),
  createCatalogEntry('Battery Problem', 'Battery not detected', 'Shows no battery', 'L1', 499, 999),
  createCatalogEntry('Battery Problem', 'Battery swollen', 'Bulging battery', 'L1', 499, 999),
  createCatalogEntry('Battery Problem', 'Laptop shuts at 30%', 'Sudden shutdown', 'L1', 499, 999),

  createCatalogEntry('Charging Problem', 'Laptop not charging', 'No charging light', 'L2', 900, 1999),
  createCatalogEntry('Charging Problem', 'Charging pin loose', 'Charges only at angle', 'L2', 900, 1999),
  createCatalogEntry('Charging Problem', 'Slow charging', 'Takes very long', 'L2', 900, 1999),
  createCatalogEntry('Charging Problem', 'Burn smell near port', 'Smell or heat', 'L4', 2500, 7000),

  createCatalogEntry('Heating Problem', 'Laptop overheating', 'Body very hot', 'L1', 499, 999),
  createCatalogEntry('Heating Problem', 'Auto shutdown on heat', 'Turns off on use', 'L2', 900, 1999),
  createCatalogEntry('Heating Problem', 'Heating while charging', 'Only while plugged', 'L2', 900, 1999),
  createCatalogEntry('Heating Problem', 'Burn marks inside', 'Thermal damage', 'L3', 1500, 3500),

  createCatalogEntry('Fan Problem', 'Fan noise loud', 'Jet-like sound', 'L1', 499, 999),
  createCatalogEntry('Fan Problem', 'Fan rattling', 'Vibration sound', 'L1', 499, 999),
  createCatalogEntry('Fan Problem', 'Fan not spinning', 'No air output', 'L2', 900, 1999),

  createCatalogEntry('Slow Performance', 'Laptop very slow', 'General slowness', 'L1', 499, 999),
  createCatalogEntry('Slow Performance', 'Takes long to boot', 'More than 5 minutes', 'L1', 499, 999),
  createCatalogEntry('Slow Performance', 'Hangs frequently', 'Freezes randomly', 'L1', 499, 999),
  createCatalogEntry('Slow Performance', 'Slow after update', 'Issue after update', 'L1', 499, 999),
  createCatalogEntry('Slow Performance', 'Slow + overheating', 'Gets hot when slow', 'L2', 900, 1999),

  createCatalogEntry('Software Issue', 'Windows not opening', 'Stuck on loading', 'L1', 499, 999),
  createCatalogEntry('Software Issue', 'Blue screen error', 'BSOD appears', 'L1', 499, 999),
  createCatalogEntry('Software Issue', 'Update stuck', 'Update loop', 'L1', 499, 999),
  createCatalogEntry('Software Issue', 'Windows corrupted', 'Needs reinstall', 'L1', 499, 999),

  createCatalogEntry('Virus Issue', 'Virus popup', 'Ads opening', 'L1', 499, 999),
  createCatalogEntry('Virus Issue', 'Browser redirect', 'Opens unknown sites', 'L1', 499, 999),
  createCatalogEntry('Virus Issue', 'Files missing', 'Auto delete', 'L2', 900, 1999),

  createCatalogEntry('Keyboard Problem', 'Keyboard not working', 'No typing', 'L1', 499, 999),
  createCatalogEntry('Keyboard Problem', 'Some keys not working', 'Partial keys dead', 'L1', 499, 999),
  createCatalogEntry('Keyboard Problem', 'Keyboard got wet', 'Liquid spill', 'L2', 900, 1999),

  createCatalogEntry('Touchpad Problem', 'Touchpad not working', 'Cursor not moving', 'L1', 499, 999),
  createCatalogEntry('Touchpad Problem', 'Touchpad click issue', 'Click not working', 'L1', 499, 999),
  createCatalogEntry('Touchpad Problem', 'Touchpad erratic', 'Moves automatically', 'L2', 900, 1999),

  createCatalogEntry('WiFi Issue', 'WiFi not connecting', 'Shows networks but fails', 'L1', 499, 999),
  createCatalogEntry('WiFi Issue', 'WiFi not showing', 'No WiFi option', 'L2', 900, 1999),
  createCatalogEntry('WiFi Issue', 'WiFi disconnects', 'Drops frequently', 'L1', 499, 999),

  createCatalogEntry('Bluetooth Issue', 'Bluetooth not working', 'Cannot pair devices', 'L1', 499, 999),
  createCatalogEntry('Bluetooth Issue', 'Bluetooth missing', 'Option not visible', 'L3', 1500, 3500),

  createCatalogEntry('Sound Issue', 'No sound', 'Speaker silent', 'L1', 499, 999),
  createCatalogEntry('Sound Issue', 'Low sound', 'Very low volume', 'L1', 499, 999),
  createCatalogEntry('Sound Issue', 'Headphone jack issue', 'No sound on jack', 'L2', 900, 1999),

  createCatalogEntry('Camera Issue', 'Camera not working', 'Black screen in apps', 'L1', 499, 999),
  createCatalogEntry('Camera Issue', 'Camera not detected', 'Missing device', 'L2', 900, 1999),

  createCatalogEntry('Storage Issue', 'Hard disk not detected', 'No disk in system', 'L2', 900, 1999),
  createCatalogEntry('Storage Issue', 'Laptop stuck due to disk', 'Disk error at boot', 'L2', 900, 1999),
  createCatalogEntry('Storage Issue', 'Data deleted', 'Need recovery', 'L2', 900, 1999),

  createCatalogEntry('Physical Damage', 'Laptop fell down', 'Physical impact', 'L2', 900, 1999),
  createCatalogEntry('Physical Damage', 'Hinge broken', 'Screen loose', 'L2', 900, 1999),
  createCatalogEntry('Physical Damage', 'Port broken', 'USB/HDMI damaged', 'L2', 900, 1999),

  createCatalogEntry('Liquid Damage', 'Water spill', 'Spill but works', 'L3', 1500, 3500),
  createCatalogEntry('Liquid Damage', 'Not working after spill', 'Dead after liquid', 'L4', 2500, 7000),

  createManualQuoteEntry('Password Or PIN Issue', 'Password/PIN option Not Showing', ''),
  createManualQuoteEntry('Password Or PIN Issue', 'I forget The password', ''),
  createManualQuoteEntry('Password Or PIN Issue', 'Bios Password', ''),

  createManualQuoteEntry('Other Issue', 'Software Issue', '', 'L2'),
  createManualQuoteEntry('Other Issue', 'Physical Damages', '', 'L3'),
  createManualQuoteEntry('Multiple Issue', 'Software Issue', '', 'L2'),
  createManualQuoteEntry('Multiple Issue', 'Physical Issue', '', 'L3'),
  createManualQuoteEntry('Multiple Issue', 'Software Issue + Physical issue', '', 'L3'),
];

const scorePricingEntry = (
  entry: ProblemPricingCatalogEntry,
  selection: {
    mainProblemCategory?: string;
    subProblem?: string;
    relatedBehavior?: string;
  }
) => {
  const mainSelection = normalizePricingText(selection.mainProblemCategory);
  if (!mainSelection) {
    return -1;
  }

  const subSelection = normalizePricingText(selection.subProblem);
  const behaviorSelection = normalizePricingText(selection.relatedBehavior);

  const mainEntry = normalizePricingText(entry.mainProblemCategory);
  const subEntry = normalizePricingText(entry.subProblem);
  const behaviorEntry = normalizePricingText(entry.relatedBehavior);

  if (mainEntry !== mainSelection) {
    return -1;
  }

  let score = 3;

  if (subSelection) {
    if (subEntry !== subSelection) {
      return -1;
    }
    score += 2;
  }

  if (behaviorSelection) {
    if (behaviorEntry && behaviorEntry !== behaviorSelection) {
      return -1;
    }
    if (behaviorEntry === behaviorSelection) {
      score += 1;
    }
  } else if (!behaviorEntry) {
    score += 1;
  }

  return score;
};

export function getProblemPricingFromSelection(selection: {
  mainProblemCategory?: string;
  subProblem?: string;
  relatedBehavior?: string;
}): ProblemPricingLookupResult | null {
  let bestMatch: { entry: ProblemPricingCatalogEntry; score: number } | null = null;

  for (const entry of LAPTOP_PROBLEM_PRICE_CATALOG) {
    const score = scorePricingEntry(entry, selection);
    if (score < 0) {
      continue;
    }
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { entry, score };
    }
  }

  if (!bestMatch) {
    return null;
  }

  const { entry } = bestMatch;
  const isManualQuote = Boolean(entry.requiresManualQuote || !entry.priceRange);

  return {
    matched: true,
    matchedEntry: entry,
    displayLabel: entry.priceLabel,
    finalChargeRange: entry.priceRange || { min: 0, max: 0 },
    breakdown: [
      `Main Problem Category: ${entry.mainProblemCategory}`,
      `Sub Problem: ${entry.subProblem}`,
      entry.relatedBehavior ? `Related Behavior / Condition: ${entry.relatedBehavior}` : 'Related Behavior / Condition: Not specified',
      entry.defaultLevel ? `Default Level: ${entry.defaultLevel}` : 'Default Level: Not specified',
      `Price: ${entry.priceLabel}`,
    ],
    defaultLevel: entry.defaultLevel,
    requiresManualQuote: isManualQuote,
  };
}
