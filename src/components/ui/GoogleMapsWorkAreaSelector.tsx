import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface Coordinates {
  lat: number;
  lng: number;
}

interface WorkArea {
  id: string;
  name: string;
  coordinates: Coordinates;
  radius: number; // km
  active: boolean;
}

interface GoogleMapsWorkAreaSelectorProps {
  workAreas: WorkArea[];
  onWorkAreasUpdate: (areas: WorkArea[]) => void;
  googleMapsApiKey?: string;
}

export const GoogleMapsWorkAreaSelector: React.FC<GoogleMapsWorkAreaSelectorProps> = ({
  workAreas,
  onWorkAreasUpdate,
  googleMapsApiKey
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedArea, setSelectedArea] = useState<WorkArea | null>(null);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaRadius, setNewAreaRadius] = useState(5);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  // Load Google Maps script
  useEffect(() => {
    if (!googleMapsApiKey) {
      console.warn('Google Maps API key not provided. Using placeholder map.');
      return;
    }

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsMapLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps');
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [googleMapsApiKey]);

  // Initialize map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Default to Milan, Italy
    const defaultCenter = { lat: 45.4642, lng: 9.1900 };
    
    const map = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 11,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add click listener for adding new areas
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (isAddingArea && event.latLng) {
        const coordinates = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        
        if (newAreaName.trim()) {
          addWorkArea(coordinates);
        }
      }
    });

    // Render existing work areas
    renderWorkAreas();
  }, [isMapLoaded, workAreas]);

  const renderWorkAreas = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and circles
    markersRef.current.forEach(marker => marker.setMap(null));
    circlesRef.current.forEach(circle => circle.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];

    // Add markers and circles for each work area
    workAreas.forEach(area => {
      const marker = new google.maps.Marker({
        position: area.coordinates,
        map: mapInstanceRef.current,
        title: area.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: area.active ? '#10B981' : '#6B7280',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2
        }
      });

      const circle = new google.maps.Circle({
        strokeColor: area.active ? '#10B981' : '#6B7280',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: area.active ? '#10B981' : '#6B7280',
        fillOpacity: 0.15,
        map: mapInstanceRef.current,
        center: area.coordinates,
        radius: area.radius * 1000 // Convert km to meters
      });

      marker.addListener('click', () => {
        setSelectedArea(area);
      });

      markersRef.current.push(marker);
      circlesRef.current.push(circle);
    });
  };

  const addWorkArea = (coordinates: Coordinates) => {
    const newArea: WorkArea = {
      id: `area_${Date.now()}`,
      name: newAreaName.trim(),
      coordinates,
      radius: newAreaRadius,
      active: true
    };

    onWorkAreasUpdate([...workAreas, newArea]);
    setNewAreaName('');
    setIsAddingArea(false);
  };

  const updateWorkArea = (updatedArea: WorkArea) => {
    const updatedAreas = workAreas.map(area => 
      area.id === updatedArea.id ? updatedArea : area
    );
    onWorkAreasUpdate(updatedAreas);
    setSelectedArea(null);
  };

  const deleteWorkArea = (areaId: string) => {
    const updatedAreas = workAreas.filter(area => area.id !== areaId);
    onWorkAreasUpdate(updatedAreas);
    setSelectedArea(null);
  };

  // Re-render when work areas change
  useEffect(() => {
    renderWorkAreas();
  }, [workAreas]);

  if (!googleMapsApiKey) {
    // Fallback UI when Google Maps is not available
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 text-center">
          <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Google Maps Integration Available
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Add your Google Maps API key to enable interactive work area selection.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            With Google Maps, you can visually select your service areas on an interactive map.
          </p>
        </div>
        
        {/* Manual Work Area Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Manage Work Areas</h4>
          <div className="space-y-3">
            {workAreas.map(area => (
              <div key={area.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${area.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{area.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {area.radius} km radius
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateWorkArea({...area, active: !area.active})}
                  >
                    {area.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteWorkArea(area.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ minHeight: '400px' }}
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 space-y-2">
          {!isAddingArea ? (
            <Button 
              size="sm" 
              onClick={() => setIsAddingArea(true)}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Add Work Area
            </Button>
          ) : (
            <div className="space-y-2 min-w-[200px]">
              <input
                type="text"
                placeholder="Area name (e.g., Milan Center)"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
              />
              <input
                type="number"
                placeholder="Radius (km)"
                value={newAreaRadius}
                onChange={(e) => setNewAreaRadius(Number(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                min="1"
                max="50"
              />
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  onClick={() => setIsAddingArea(false)}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  disabled={!newAreaName.trim()}
                  className="flex-1"
                >
                  Click Map
                </Button>
              </div>
              <p className="text-xs text-gray-500">Click on the map to add this area</p>
            </div>
          )}
        </div>

        {/* Area Details Modal */}
        {selectedArea && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[250px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">{selectedArea.name}</h4>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedArea(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Radius (km)</label>
                <input
                  type="number"
                  value={selectedArea.radius}
                  onChange={(e) => setSelectedArea({
                    ...selectedArea,
                    radius: Number(e.target.value)
                  })}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm mt-1"
                  min="1"
                  max="50"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedArea.active}
                  onChange={(e) => setSelectedArea({
                    ...selectedArea,
                    active: e.target.checked
                  })}
                  className="rounded"
                />
                <label className="text-sm text-gray-600 dark:text-gray-300">Active</label>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => updateWorkArea(selectedArea)}
                  className="flex-1"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => deleteWorkArea(selectedArea.id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <p><strong>How to use:</strong></p>
        <ul className="mt-1 space-y-1 ml-4 list-disc">
          <li>Click "Add Work Area" to start adding a new service area</li>
          <li>Enter the area name and radius, then click on the map</li>
          <li>Click on existing markers to edit or delete areas</li>
          <li>Green areas are active, gray areas are inactive</li>
        </ul>
      </div>
    </div>
  );
};

// Type declarations for Google Maps (if not using @types/googlemaps)
declare global {
  interface Window {
    google: typeof google;
  }
}