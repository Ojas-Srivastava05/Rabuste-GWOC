export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // distance in km
  };

// Calculate estimated time to reach cafe based on distance
// Assumes average speed of 30 km/h in city traffic
export const calculateTimeToCafe = (distanceKm) => {
  if (!distanceKm || distanceKm <= 0) return null;
  const averageSpeedKmh = 30; // km/h
  const timeHours = distanceKm / averageSpeedKmh;
  const timeMinutes = Math.ceil(timeHours * 60); // Round up to nearest minute
  return timeMinutes;
};
  