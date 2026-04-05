import React, { useEffect, useState, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { Phone, Navigation, Clock, Info, Search, Loader, Shield, AlertTriangle, MapPin, ChevronDown, Menu, List, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom police station icon
const policeIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'police-marker'
});

// Custom user location icon
const userIcon = new L.DivIcon({
  className: 'bg-blue-500 border-2 border-white shadow-md rounded-full w-6 h-6 flex items-center justify-center',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  html: '<div class="animate-pulse bg-blue-400 rounded-full w-4 h-4"></div>'
});

const NearbyPoliceStations = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000); // Default 5km
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStationList, setShowStationList] = useState(true);
  const [travelTimes, setTravelTimes] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const API_KEY = "41b0d2b21c3a4695a8df499107c34d5f"; // Geoapify key

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Automatically close sidebar on mobile
      if (window.innerWidth < 768) {
        setShowStationList(false);
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchPoliceStations = useCallback(async (lat, lng, radius) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.geoapify.com/v2/places?categories=service.police&filter=circle:${lng},${lat},${radius}&limit=20&apiKey=${API_KEY}`);
      const data = await res.json();
      
      if (data.features) {
        setPoliceStations(data.features);
        
        // Calculate estimated travel times for each station (simplified)
        const times = {};
        data.features.forEach(station => {
          const stationLat = station.geometry.coordinates[1];
          const stationLng = station.geometry.coordinates[0];
          // Simple calculation - in reality you'd use a routing API
          const distance = calculateDistance(lat, lng, stationLat, stationLng);
          // Assume average speed of 40 km/h in urban areas
          const timeInMinutes = Math.round((distance / 40) * 60);
          times[station.properties.place_id] = timeInMinutes;
        });
        setTravelTimes(times);
      }
    } catch (err) {
      setError("Failed to fetch police stations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  // Calculate distance between two coordinates in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchPoliceStations(latitude, longitude, searchRadius);
      },
      (err) => {
        setError("Location access denied. Please enable location services to find nearby police stations.");
        setLoading(false);
      }
    );
  }, [fetchPoliceStations, searchRadius]);

  const handleRadiusChange = (newRadius) => {
    setSearchRadius(newRadius);
    if (userLocation) {
      fetchPoliceStations(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  // Calculate distance between user and station
  const getDistance = (station) => {
    if (!userLocation) return "Unknown";
    
    const stationLat = station.geometry.coordinates[1];
    const stationLng = station.geometry.coordinates[0];
    const distance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      stationLat, 
      stationLng
    );
    
    return distance < 1 
      ? `${Math.round(distance * 1000)} m` 
      : `${distance.toFixed(1)} km`;
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle station list sidebar
  const toggleStationList = () => {
    setShowStationList(!showStationList);
    // On mobile, we use a full screen overlay so we also need to toggle the mobile menu
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  // Map auto-centering component
  const MapCenter = () => {
    const map = useMap();
    
    useEffect(() => {
      if (userLocation) {
        // Set view with smooth animation
        map.flyTo([userLocation.lat, userLocation.lng], 13, {
          animate: true,
          duration: 1.5
        });
      }
    }, [userLocation]);
    
    // Fly to selected station
    useEffect(() => {
      if (selectedStation && map) {
        const coords = [
          selectedStation.geometry.coordinates[1],
          selectedStation.geometry.coordinates[0]
        ];
        map.flyTo(coords, 15, {
          animate: true,
          duration: 1
        });
      }
    }, [selectedStation, map]);
    
    return null;
  };

  const closeInfoPanel = () => {
    setSelectedStation(null);
  };

  return (
    <div className="flex mt-18 flex-col h-screen max-h-screen bg-gray-50">
      {/* Header bar - responsive */}
      <header className="bg-blue-600 text-white p-2 md:p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield size={24} />
            <h1 className="text-lg md:text-xl font-bold">Police Station Finder</h1>
          </div>
          
          {/* Desktop controls */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Search radius:</span>
              <select 
                className="bg-blue-700 text-white rounded px-2 py-1"
                value={searchRadius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
              >
                <option value={1000}>1 km</option>
                <option value={3000}>3 km</option>
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
              </select>
            </div>
            <button 
              className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 rounded px-3 py-1"
              onClick={toggleStationList}
            >
              <span>{showStationList ? "Hide" : "Show"} List</span>
              <ChevronDown size={16} className={`transform ${showStationList ? 'rotate-180' : ''} transition-transform`} />
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="p-1 rounded-full hover:bg-blue-700"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-95 z-40 flex flex-col text-white">
          <div className="flex justify-between items-center p-4 border-b border-blue-800">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={toggleMobileMenu} className="p-1 rounded-full hover:bg-blue-800">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm uppercase text-blue-300 mb-2">Search Options</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col">
                  <label className="mb-1">Search radius:</label>
                  <select 
                    className="bg-blue-800 text-white rounded px-3 py-2 border border-blue-700"
                    value={searchRadius}
                    onChange={(e) => {
                      handleRadiusChange(Number(e.target.value));
                      setMobileMenuOpen(false); // Close menu after selection
                    }}
                  >
                    <option value={1000}>1 km</option>
                    <option value={3000}>3 km</option>
                    <option value={5000}>5 km</option>
                    <option value={10000}>10 km</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                className="w-full bg-blue-700 hover:bg-blue-800 py-3 px-4 rounded-lg flex items-center justify-center"
                onClick={toggleStationList}
              >
                <List size={20} className="mr-2" />
                View Police Stations List
              </button>
            </div>
            
            {userLocation && (
              <div className="pt-2">
                <button 
                  className="w-full bg-blue-700 hover:bg-blue-800 py-3 px-4 rounded-lg flex items-center justify-center"
                  onClick={() => {
                    setSelectedStation(null);
                    setMobileMenuOpen(false);
                  }}
                >
                  <MapPin size={20} className="mr-2" />
                  Return to My Location
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar for police station list */}
        {showStationList && !isMobile && (
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-lg overflow-y-auto z-10">
            <div className="p-4 bg-gray-100 border-b">
              <h2 className="font-bold text-lg">Nearby Police Stations</h2>
              <p className="text-sm text-gray-600">
                {loading ? 'Searching...' : `${policeStations.length} stations found`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader size={24} className="animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Locating stations...</span>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {policeStations.map((station, index) => (
                  <li 
                    key={index} 
                    className={`hover:bg-blue-50 transition-colors cursor-pointer p-4
                      ${selectedStation && selectedStation.properties.place_id === station.properties.place_id ? 'bg-blue-100' : ''}`}
                    onClick={() => setSelectedStation(station)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-md">
                          {station.properties.name || "Police Station"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {station.properties.address_line1}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          {getDistance(station)}
                        </span>
                        {travelTimes[station.properties.place_id] && (
                          <span className="text-xs text-gray-500 mt-1">
                            ~{travelTimes[station.properties.place_id]} min drive
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex mt-3 text-sm text-gray-600">
                      <button className="mr-3 flex items-center text-blue-600 hover:text-blue-800">
                        <Navigation size={14} className="mr-1" />
                        Directions
                      </button>
                      {station.properties.phone && (
                        <button className="flex items-center text-blue-600 hover:text-blue-800">
                          <Phone size={14} className="mr-1" />
                          Call
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Mobile full-screen station list */}
        {showStationList && isMobile && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col">
            <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
              <h2 className="font-bold text-lg">Nearby Police Stations</h2>
              <button onClick={toggleStationList} className="p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {loading ? 'Searching...' : `${policeStations.length} stations found`}
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <span>Radius:</span>
                <select 
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                  value={searchRadius}
                  onChange={(e) => handleRadiusChange(Number(e.target.value))}
                >
                  <option value={1000}>1 km</option>
                  <option value={3000}>3 km</option>
                  <option value={5000}>5 km</option>
                  <option value={10000}>10 km</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32 flex-1">
                <Loader size={24} className="animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Locating stations...</span>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                <ul className="divide-y divide-gray-200">
                  {policeStations.map((station, index) => (
                    <li 
                      key={index} 
                      className="hover:bg-blue-50 active:bg-blue-100 transition-colors p-4"
                      onClick={() => {
                        setSelectedStation(station);
                        toggleStationList(); // Close the list on mobile after selection
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {station.properties.name || "Police Station"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {station.properties.address_line1}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                            {getDistance(station)}
                          </span>
                          {travelTimes[station.properties.place_id] && (
                            <span className="text-xs text-gray-500 mt-1">
                              ~{travelTimes[station.properties.place_id]} min drive
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex mt-3 text-sm text-gray-600">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${station.geometry.coordinates[1]},${station.geometry.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mr-3 flex items-center text-blue-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation size={14} className="mr-1" />
                          Directions
                        </a>
                        {station.properties.phone && (
                          <a 
                            href={`tel:${station.properties.phone}`}
                            className="flex items-center text-blue-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={14} className="mr-1" />
                            Call
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Map container */}
        <div className="flex-1 relative">
          {userLocation ? (
            <MapContainer 
              center={[userLocation.lat, userLocation.lng]} 
              zoom={13} 
              className="h-full w-full"
              zoomControl={false}
            >
              <MapCenter />
              <TileLayer
                attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors'
                url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${API_KEY}`}
              />
              
              {/* User location marker with pulse effect */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup className="custom-popup">
                  <div className="text-center">
                    <div className="font-semibold">Your Location</div>
                    <div className="text-xs text-gray-600">
                      {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* Search radius circle */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={searchRadius}
                pathOptions={{ 
                  fillColor: 'blue', 
                  fillOpacity: 0.05,
                  color: 'blue',
                  weight: 1,
                  opacity: 0.3
                }}
              />

              {/* Police station markers */}
              {policeStations.map((station, index) => (
                <Marker
                  key={index}
                  position={[
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0],
                  ]}
                  icon={policeIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedStation(station);
                      // On mobile, close any open menu
                      if (isMobile && mobileMenuOpen) {
                        setMobileMenuOpen(false);
                      }
                    }
                  }}
                >
                  <Popup className="station-popup">
                    <div className="w-64">
                      <h3 className="font-bold text-lg text-blue-800">
                        {station.properties.name || "Police Station"}
                      </h3>
                      
                      <div className="mt-2 text-sm">
                        <div className="flex items-start my-1">
                          <MapPin size={16} className="mr-2 mt-0.5 text-gray-600 flex-shrink-0" />
                          <div>
                            {station.properties.address_line1}
                            {station.properties.address_line2 && (
                              <><br />{station.properties.address_line2}</>
                            )}
                          </div>
                        </div>
                        
                        {station.properties.phone && (
                          <div className="flex items-center my-1">
                            <Phone size={16} className="mr-2 text-gray-600" />
                            <a href={`tel:${station.properties.phone}`} className="text-blue-600 hover:underline">
                              {station.properties.phone}
                            </a>
                          </div>
                        )}
                        
                        <div className="flex items-center my-1">
                          <Navigation size={16} className="mr-2 text-gray-600" />
                          <span>Distance: <strong>{getDistance(station)}</strong></span>
                        </div>
                        
                        {travelTimes[station.properties.place_id] && (
                          <div className="flex items-center my-1">
                            <Clock size={16} className="mr-2 text-gray-600" />
                            <span>Est. drive time: <strong>{travelTimes[station.properties.place_id]} min</strong></span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${station.geometry.coordinates[1]},${station.geometry.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center justify-center"
                        >
                          <Navigation size={14} className="mr-1" />
                          Get Directions
                        </a>
                        
                        {station.properties.phone && (
                          <a 
                            href={`tel:${station.properties.phone}`}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded flex items-center justify-center"
                          >
                            <Phone size={14} className="mr-1" />
                            Call
                          </a>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100">
              <Loader size={32} className="animate-spin text-blue-600 mb-4" />
              <p className="text-center px-4">Locating you and finding nearby police stations...</p>
              <p className="text-sm text-gray-500 mt-2 text-center px-4">Please allow location access when prompted</p>
            </div>
          )}
          
          {/* Map controls - adapted for mobile */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            {/* Toggle list button for mobile */}
            {isMobile && (
              <button 
                className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
                onClick={toggleStationList}
                title="Show station list"
              >
                <List size={20} />
              </button>
            )}
            
            {/* Return to location button */}
            <button 
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
              onClick={() => {
                if (userLocation) {
                  setSelectedStation(null);
                }
              }}
              title="Return to your location"
            >
              <MapPin size={20} />
            </button>
          </div>
          
          {/* Station info panel when selected - responsive */}
          {selectedStation && (
            <div className={`absolute bg-white rounded-lg shadow-lg p-4 overflow-y-auto z-20
              ${isMobile 
                ? 'bottom-0 left-0 right-0 max-h-48' // Mobile: bottom panel
                : 'bottom-4 left-4 w-1/3 max-h-48'   // Desktop: floating panel
              }`}
            >
              <button 
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                onClick={closeInfoPanel}
              >
                ×
              </button>
              
              <h3 className="font-bold text-blue-800 pr-6">
                {selectedStation.properties.name || "Police Station"}
              </h3>
              
              <div className="mt-2 text-sm">
                <div className="flex items-start mb-1">
                  <MapPin size={14} className="mr-1 mt-0.5 text-gray-600 flex-shrink-0" />
                  <div className="text-gray-700">
                    {selectedStation.properties.address_line1}
                  </div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <span className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                    {getDistance(selectedStation)} away
                  </span>
                  
                  {travelTimes[selectedStation.properties.place_id] && (
                    <span className="text-xs bg-green-50 text-green-800 px-2 py-1 rounded">
                      ~{travelTimes[selectedStation.properties.place_id]} min drive
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex space-x-2">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.geometry.coordinates[1]},${selectedStation.geometry.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 text-center text-sm rounded flex items-center justify-center"
                >
                  <Navigation size={14} className="mr-1" />
                  Directions
                </a>
                
                {selectedStation.properties.phone && (
                  <a 
                    href={`tel:${selectedStation.properties.phone}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 text-center text-sm rounded flex items-center justify-center"
                  >
                    <Phone size={14} className="mr-1" />
                    Call
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer with attribution - responsive */}
      <footer className="bg-gray-800 text-white text-xs py-2 px-4 text-center">
        <p>© {new Date().getFullYear()} Police Station Finder | Map data © Geoapify</p>
      </footer>
    </div>
  );
};

export default NearbyPoliceStations;