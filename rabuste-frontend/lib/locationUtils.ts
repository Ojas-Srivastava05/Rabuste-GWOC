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

/**
 * Get user's current location with high precision
 * Uses multiple strategies for maximum accuracy:
 * 1. High accuracy GPS with longer timeout
 * 2. Multiple attempts with averaging
 * 3. Fallback to standard accuracy if needed
 */
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

    let attempts = 0;
    const maxAttempts = 3;
    const positions: Array<{ lat: number; lng: number; accuracy: number }> = [];

    const tryGetPosition = (useHighAccuracy: boolean) => {
      attempts++;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy || 0
          };
          
          positions.push(coords);

          // If we have high accuracy (accuracy < 50m) or we've tried enough, use it
          if (coords.accuracy < 50 || attempts >= maxAttempts) {
            // Average positions if we have multiple for better accuracy
            if (positions.length > 1) {
              const avgLat = positions.reduce((sum, p) => sum + p.lat, 0) / positions.length;
              const avgLng = positions.reduce((sum, p) => sum + p.lng, 0) / positions.length;
              resolve({ lat: avgLat, lng: avgLng });
            } else {
              resolve({ lat: coords.lat, lng: coords.lng });
            }
          } else if (attempts < maxAttempts) {
            // Try again for better accuracy
            setTimeout(() => tryGetPosition(useHighAccuracy), 500);
          } else {
            // Use best position we have
            const bestPosition = positions.reduce((best, current) => 
              current.accuracy < best.accuracy ? current : best
            );
            resolve({ lat: bestPosition.lat, lng: bestPosition.lng });
          }
        },
        (error) => {
          // If high accuracy failed and we haven't tried standard, fallback
          if (useHighAccuracy && attempts === 1) {
            setTimeout(() => tryGetPosition(false), 500);
            return;
          }

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
          enableHighAccuracy: useHighAccuracy, // Use high accuracy for precision
          timeout: 20000, // 20 seconds for GPS to get accurate fix
          maximumAge: 0, // Don't use cached positions - get fresh GPS data
        }
      );
    };

    // Start with high accuracy
    tryGetPosition(true);
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