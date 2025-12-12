import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bus, MapPin, Navigation } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default Leaflet marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon
const createCustomIcon = (icon: React.ReactNode) => {
    const iconMarkup = renderToStaticMarkup(
        <div className="w-8 h-8 bg-[#008751] rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
            {icon}
        </div>
    );
    return L.divIcon({
        html: iconMarkup,
        className: 'custom-leaflet-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });
};

const busIcon = createCustomIcon(<Bus size={16} />);
const startIcon = createCustomIcon(<MapPin size={16} />);
const endIcon = createCustomIcon(<MapPin size={16} className="text-red-500" />);

interface Coords {
    lat: number;
    lng: number;
}

// Cotonou -> Parakou (Approximate coordinates)
const START_POS: Coords = { lat: 6.3654, lng: 2.4183 }; // Cotonou
const END_POS: Coords = { lat: 9.3371, lng: 2.6108 };   // Parakou

// Component to recenter map on bus
const RecenterMap = ({ coords }: { coords: Coords }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([coords.lat, coords.lng], map.getZoom());
    }, [coords, map]);
    return null;
};

export const LiveJourneyMap = () => {
    const [busPos, setBusPos] = useState<Coords>(START_POS);
    const [progress, setProgress] = useState(0);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 1) return 0; // Loop back for demo
                return p + 0.005; // Smooth increment
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Calculate position based on progress
    useEffect(() => {
        const lat = START_POS.lat + (END_POS.lat - START_POS.lat) * progress;
        const lng = START_POS.lng + (END_POS.lng - START_POS.lng) * progress;
        setBusPos({ lat, lng });
    }, [progress]);

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative z-0">
            <MapContainer
                center={[START_POS.lat, START_POS.lng]}
                zoom={7}
                scrollWheelZoom={false}
                className="h-full w-full"
                style={{ zIndex: 0 }} // Ensure it stays behind modals (z-index fix)
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Start Marker */}
                <Marker position={[START_POS.lat, START_POS.lng]} icon={startIcon}>
                    <Popup>Départ: Cotonou</Popup>
                </Marker>

                {/* End Marker */}
                <Marker position={[END_POS.lat, END_POS.lng]} icon={endIcon}>
                    <Popup>Arrivée: Parakou</Popup>
                </Marker>

                {/* Moving Bus Marker */}
                <Marker position={[busPos.lat, busPos.lng]} icon={busIcon}>
                    <Popup>
                        <div className="text-center">
                            <strong>Bus en route</strong><br />
                            Vitesse: 85 km/h
                        </div>
                    </Popup>
                </Marker>

                <RecenterMap coords={busPos} />
            </MapContainer>

            {/* Overlay Info */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg z-[400] text-sm"> {/* Leaflet uses z-indexes up to 1000 */}
                <div className="flex items-center gap-2 mb-1">
                    <Navigation size={16} className="text-[#008751]" />
                    <span className="font-bold text-gray-800">Trajet en cours</span>
                </div>
                <div className="text-xs text-gray-500">
                    Destination: Parakou<br />
                    Arrivée estimée: 14:30
                </div>
            </div>
        </div>
    );
};
