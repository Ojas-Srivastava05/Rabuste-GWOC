// Utility functions for location-based features

// Cafe location - Rabuste Coffee Shop actual coordinates
export const CAFE_LOCATION = {
  lat: 21.161408,
  lng: 72.771177,
  name: "Rabuste Coffee Shop"
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate estimated time to reach cafe based on distance
 * Assumes average speed of 30 km/h for city traffic
 * Returns time in minutes (just travel time, no preparation)
 */
export function calculateTimeToCafe(distanceKm: number): number {
  if (!distanceKm || distanceKm <= 0) return 0;
  const averageSpeedKmh = 30; // Average speed in city traffic
  const travelTimeMinutes = (distanceKm / averageSpeedKmh) * 60;
  return Math.ceil(travelTimeMinutes); // Round up to nearest minute
}

/**
 * Calculate estimated delivery time based on distance
 * Assumes average speed of 30 km/h for delivery
 * Returns time in minutes
 */
export function calculateDeliveryTime(distanceKm: number): number {
  const averageSpeedKmh = 30; // Average delivery speed
  const preparationTime = 10; // Base preparation time in minutes
  const travelTimeMinutes = (distanceKm / averageSpeedKmh) * 60;
  
  return Math.ceil(preparationTime + travelTimeMinutes);
}

/**
 * Get user's current location
 */
export interface LocationError {
  code: number;
  message: string;
  type: 'permission_denied' | 'position_unavailable' | 'timeout' | 'unsupported';
}

export function getCurrentLocation(): Promise<{
  lat: number;
  lng: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const error: LocationError = {
        code: 0,
        message: "Geolocation is not supported by your browser",
        type: 'unsupported'
      };
      reject(error);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Map GeolocationPositionError to our custom error format
        let errorType: LocationError['type'];
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = 'permission_denied';
            errorMessage = "Location access was denied. Please enable location permissions in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorType = 'position_unavailable';
            errorMessage = "Location services are unavailable. Please ensure location services are enabled on your device and try again.";
            break;
          case error.TIMEOUT:
            errorType = 'timeout';
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorType = 'position_unavailable';
            errorMessage = error.message || "Unable to retrieve location. Please ensure location services are enabled.";
        }

        const locationError: LocationError = {
          code: error.code,
          message: errorMessage,
          type: errorType
        };
        
        reject(locationError);
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 300000, // Allow cached position up to 5 minutes old
      }
    );
  });
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}