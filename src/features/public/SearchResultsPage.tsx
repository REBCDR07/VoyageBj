import React, { useState, useEffect } from 'react';
import { Station, User, ViewState } from '../../shared/types';
import { getStations, getUsers } from '../../shared/services/storage';
import { MapPin, Calendar, Clock, ArrowRight, Bus, AlertCircle, ChevronLeft, Search, Building2, ChevronRight } from 'lucide-react';
import { Footer } from '../../shared/components/Footer';

interface Props {
    onNavigate: (page: ViewState, params?: any) => void;
    searchParams: { departure: string; arrival: string; date: string } | null;
    user: User | null;
}

export const SearchResultsPage: React.FC<Props> = ({ onNavigate, searchParams, user }) => {
    const [stations, setStations] = useState<Station[]>([]);
    const [routes, setRoutes] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingStationId, setViewingStationId] = useState<string | null>(null);

    // Search state
    const [departure, setDeparture] = useState(searchParams?.departure || '');
    const [arrival, setArrival] = useState(searchParams?.arrival || '');
    const [date, setDate] = useState(searchParams?.date || '');

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const allStations = getStations();
            const approvedCompanies = getUsers().filter(u => u.role === 'COMPANY' && u.status === 'APPROVED');
            const approvedCompanyIds = approvedCompanies.map(c => c.id);

            // Filter only approved company stations
            const approvedStations = allStations.filter(s => approvedCompanyIds.includes(s.companyId));

            // Separate stations and routes
            const parentStations = approvedStations.filter(s => s.type === 'STATION');
            const allRoutes = approvedStations.filter(s => s.type === 'ROUTE');

            // Filter stations logic
            let filteredStations = parentStations;

            if (departure || arrival) {
                filteredStations = parentStations.filter(station => {
                    // 1. Check if station matches departure location
                    const matchStationLoc = !departure || station.location.toLowerCase().includes(departure.toLowerCase());

                    if (!arrival) {
                        // If only departure is specified, show stations matching location
                        return matchStationLoc;
                    } else {
                        // If arrival is specified, we must check if this station has any route matching the criteria
                        // Find routes for this station
                        const stationRoutes = allRoutes.filter(r => r.parentId === station.id);

                        // Check if any route matches both departure (optional check on route point A) and arrival
                        const hasMatchingRoute = stationRoutes.some(route => {
                            const matchRouteDep = !departure || route.pointA?.toLowerCase().includes(departure.toLowerCase());
                            const matchRouteArr = route.pointB?.toLowerCase().includes(arrival.toLowerCase());
                            return matchRouteDep && matchRouteArr;
                        });

                        // If we are searching for a specific trip (Dep -> Arr), we only care about routes.
                        // However, the user might want to see the station if it's in the departure city AND has routes to arrival.
                        return matchStationLoc && hasMatchingRoute;
                    }
                });
            }

            setStations(filteredStations);
            setRoutes(allRoutes);
            setLoading(false);
        }, 800);
    }, [departure, arrival, date]); // Re-run when search state changes

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // The effect will trigger automatically
    };

    const handleBooking = (routeId: string) => {
        if (user) {
            // User is logged in, proceed to booking (mock)
            onNavigate('DASHBOARD_CLIENT', { bookingRouteId: routeId });
        } else {
            // User not logged in, redirect to login
            onNavigate('LOGIN_VOYAGEUR');
        }
    };

    const getRoutesForStation = (stationId: string) => {
        return routes.filter(r => r.parentId === stationId);
    };

    const renderStationsList = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#008751] rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                        {stations.length} Sous-stations disponibles
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {stations.map(station => {
                    const stationRoutes = getRoutesForStation(station.id);
                    return (
                        <div
                            key={station.id}
                            onClick={() => setViewingStationId(station.id)}
                            className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
                        >
                            <div className="h-52 relative overflow-hidden">
                                <img
                                    src={station.photoUrl || `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                                    {station.companyName}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white text-xl font-black leading-tight group-hover:text-green-300 transition-colors mb-2">{station.name}</h3>
                                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                                        <MapPin size={14} className="text-green-400" /> {station.location}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 bg-gray-50/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#008751]/10 flex items-center justify-center text-[#008751]">
                                            <Bus size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{stationRoutes.length} Trajets</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#008751] group-hover:bg-[#008751] group-hover:text-white transition-all shadow-sm">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Horaires :</p>
                                    <div className="flex items-center gap-2 text-gray-700 font-bold text-sm">
                                        <Clock size={14} className="text-[#008751]" />
                                        {station.openingTime || '--:--'} - {station.closingTime || '--:--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderRoutesList = () => {
        const station = stations.find(s => s.id === viewingStationId);
        if (!station) return null;

        const stationRoutes = getRoutesForStation(station.id);
        let filteredRoutes = stationRoutes;
        if (departure || arrival) {
            filteredRoutes = stationRoutes.filter(r => {
                const matchDep = !departure || r.pointA?.toLowerCase().includes(departure.toLowerCase());
                const matchArr = !arrival || r.pointB?.toLowerCase().includes(arrival.toLowerCase());
                return matchDep && matchArr;
            });
        }

        return (
            <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setViewingStationId(null)} className="flex items-center gap-2 text-gray-600 hover:text-[#008751] font-bold transition-all bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md">
                        <ChevronLeft size={20} /> Retour aux stations
                    </button>
                    <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-sm">
                        <Building2 size={16} className="text-[#008751]" />
                        {station.name}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredRoutes.length > 0 ? (
                        filteredRoutes.map(route => (
                            <div key={route.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 group">
                                <div className="w-full md:w-56 h-40 rounded-3xl overflow-hidden shrink-0 relative">
                                    <img src={route.photoUrl} alt={route.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black text-orange-500 uppercase tracking-widest border border-orange-100 shadow-sm">
                                        Direct
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#008751] transition-colors mb-2">{route.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                                <MapPin size={16} className="text-[#008751]" /> {route.location}
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 text-right">
                                            <span className="block font-black text-3xl text-[#008751]">{route.price?.toLocaleString()} F</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">par voyageur</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 text-center md:text-left">Trajet & Horaires</p>
                                            <div className="flex items-center justify-between gap-4 font-bold text-gray-800 mb-3">
                                                <span>{route.pointA}</span>
                                                <ArrowRight size={16} className="text-gray-300" />
                                                <span>{route.pointB}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                                                {route.departureHours?.slice(0, 3).map(h => (
                                                    <span key={h} className="bg-white border border-gray-100 px-2 py-1 rounded text-[10px] font-black text-[#008751] shadow-sm">{h}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleBooking(route.id)}
                                            className="h-full bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            Réserver <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">Aucun départ trouvé</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8 text-lg">
                                Réessayez avec d'autres critères de recherche.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col selection:bg-green-100 selection:text-green-900">
            <div className="bg-[#008751] relative overflow-hidden text-white py-10 md:py-16 shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <button onClick={() => onNavigate('LANDING')} className="mb-6 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 w-fit px-4 py-2 rounded-full transition-all text-sm font-bold backdrop-blur-sm border border-white/20">
                        <ChevronLeft size={18} /> Retour
                    </button>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                        {viewingStationId ? 'Trajets disponibles' : 'Résultats de recherche'}
                    </h1>

                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl p-4 shadow-xl max-w-4xl">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Départ"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#008751] outline-none text-gray-800 font-bold placeholder-gray-400"
                                    value={departure}
                                    onChange={(e) => setDeparture(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 relative">
                                <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Arrivée"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#008751] outline-none text-gray-800 font-bold placeholder-gray-400"
                                    value={arrival}
                                    onChange={(e) => setArrival(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 relative">
                                <Calendar className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="date"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#008751] outline-none text-gray-800 font-bold"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="bg-[#008751] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#006b40] transition-all shadow-lg shadow-green-200">
                                Rechercher
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-12 w-full animate-fade-in">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#008751] rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-bold text-gray-800 animate-pulse">Recherche des meilleurs trajets...</h3>
                        <p className="text-gray-500 mt-2">Nous parcourons les offres de nos compagnies partenaires.</p>
                    </div>
                ) : viewingStationId ? (
                    renderRoutesList()
                ) : stations.length > 0 ? (
                    renderStationsList()
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">Aucune station trouvée</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                            Désolé, nous n'avons trouvé aucune station correspondant à votre recherche pour le moment.
                        </p>
                        <button onClick={() => { setDeparture(''); setArrival(''); setDate(''); }} className="px-8 py-4 bg-[#008751] text-white rounded-2xl font-bold hover:bg-[#006b40] transition-all shadow-lg shadow-green-200">
                            Voir toutes les stations
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
            `}</style>


        </div>
    );
};
