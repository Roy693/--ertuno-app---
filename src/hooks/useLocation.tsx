import { useState, useEffect } from 'react';

interface LocationData {
  city: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const useLocation = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('ertuno_user_location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed.city);
        setLocationData(parsed);
      } catch (err) {
        console.error('Error parsing saved location:', err);
      }
    }
  }, []);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding using a free service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=it`
      );

      if (!response.ok) {
        throw new Error('Failed to get location data');
      }

      const data = await response.json();

      const locationData: LocationData = {
        city: data.locality || data.city || 'Comiso',
        region: data.principalSubdivision || 'Sicilia',
        country: data.countryName || 'Italia',
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      };

      // Save to localStorage
      localStorage.setItem('ertuno_user_location', JSON.stringify(locationData));

      setLocation(locationData.city);
      setLocationData(locationData);
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Unable to get your location. Please try again.');
      
      // Fallback to Comiso, Sicily
      const fallbackData: LocationData = {
        city: 'Comiso',
        region: 'Sicilia',
        country: 'Italia',
        coordinates: { lat: 36.9469, lng: 14.6078 }
      };
      
      setLocation(fallbackData.city);
      setLocationData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => {
    localStorage.removeItem('ertuno_user_location');
    setLocation(null);
    setLocationData(null);
    setError(null);
  };

  // Get nearby cities based on current location
  const getNearbyLocations = (): string[] => {
    if (!locationData) {
      return ['Comiso', 'Ragusa', 'Vittoria', 'Modica', 'Scicli'];
    }

    // Sicily major cities
    const sicilianCities = [
      'Palermo', 'Catania', 'Messina', 'Siracusa', 'Marsala',
      'Ragusa', 'Trapani', 'Vittoria', 'Modica', 'Comiso',
      'Scicli', 'Caltagirone', 'Agrigento', 'Caltanissetta', 'Enna'
    ];

    return sicilianCities.filter(city => city !== locationData.city).slice(0, 6);
  };

  return {
    location,
    locationData,
    loading,
    error,
    requestLocation,
    clearLocation,
    getNearbyLocations
  };
};