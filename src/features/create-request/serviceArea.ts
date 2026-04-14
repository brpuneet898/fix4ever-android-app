export interface ServiceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}


// In production this should come from backend or config, but for now we hardcode it here for simplicity
// We can add more locations here in the future as needed
export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    radiusKm: 35,
  },
];

export const DEFAULT_SERVICE_LOCATION = SERVICE_LOCATIONS[0];

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const getDistanceInKm = (
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number
): number => {
  const dLat = toRadians(toLatitude - fromLatitude);
  const dLon = toRadians(toLongitude - fromLongitude);

  const fromLatRad = toRadians(fromLatitude);
  const toLatRad = toRadians(toLatitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromLatRad) * Math.cos(toLatRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export const getMatchingServiceLocation = (
  latitude: number,
  longitude: number
): ServiceLocation | null => {
  for (const location of SERVICE_LOCATIONS) {
    const distance = getDistanceInKm(
      location.latitude,
      location.longitude,
      latitude,
      longitude
    );

    if (distance <= location.radiusKm) {
      return location;
    }
  }

  return null;
};

export const isWithinServiceArea = (latitude: number, longitude: number): boolean => {
  return getMatchingServiceLocation(latitude, longitude) !== null;
};

export const getServiceAreaSummaryText = (): string => {
  if (!SERVICE_LOCATIONS.length) {
    return 'our service locations';
  }

  return SERVICE_LOCATIONS.map((location) => `${location.radiusKm} km of ${location.name}`).join(', ');
};