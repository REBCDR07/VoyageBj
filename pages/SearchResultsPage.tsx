import React, { useState, useEffect } from 'react';
import { Station, User } from '../types';
import { getStations, getUsers } from '../services/storage';
import { MapPin, Calendar, Clock, ArrowRight, Bus, AlertCircle, ChevronLeft, Search } from 'lucide-react';
import { Footer } from '../components/Footer';

interface Props {
    onNavigate: (page: string) => void;
    searchParams: { departure: string; arrival: string; date: string } | null;
}

export const SearchResultsPage: React.FC<Props> = ({ onNavigate, searchParams }) => {
    const [results, setResults] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for better UX
        setLoading(true);
        setTimeout(() => {
            const allStations = getStations();
            const filtered = allStations.filter(s => {
                if (!searchParams) return true;
                const matchDep = !searchParams.departure || s.pointA.toLowerCase().includes(searchParams.departure.toLowerCase());
                const matchArr = !searchParams.arrival || s.pointB.toLowerCase().includes(searchParams.arrival.toLowerCase());
                // Date filtering would go here if stations had specific dates, but they are recurring schedules.
                // We show all schedules that match the route.
                return matchDep && matchArr;
            });
            setResults(filtered);
            setLoading(false);
        }, 800);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col pt-[70px] selection:bg-green-100 selection:text-green-900">
            {/* Header Improved */}
            <div className="bg-[#008751] relative overflow-hidden text-white py-10 md:py-16 shadow-lg">
                 {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <button onClick={() => onNavigate('LANDING')} className="mb-6 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 w-fit px-4 py-2 rounded-full transition-all text-sm font-bold backdrop-blur-sm border border-white/20">
                        <ChevronLeft size={18} /> Retour
                    </button>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Résultats de recherche</h1>
                    <div className="flex flex-wrap items-center gap-3 md:gap-6 text-green-50 text-sm md:text-base font-medium bg-white/10 w-fit p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-sm">
                        <div className="flex items-center gap-2">
                            <MapPin size={20} className="text-yellow-400" />
                            <span className="font-bold">{searchParams?.departure || 'Toutes villes'}</span>
                        </div>
                        <ArrowRight size={20} className="text-white/50" />
                        <div className="flex items-center gap-2">
                            <MapPin size={20} className="text-yellow-400" />
                            <span className="font-bold">{searchParams?.arrival || 'Toutes villes'}</span>
                        </div>
                        {searchParams?.date && (
                            <>
                                <div className="w-px h-6 bg-white/20 hidden md:block"></div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={20} className="text-yellow-400" />
                                    <span className="font-bold">{new Date(searchParams.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                </div>
                            </>
                        )}
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
                ) : results.length > 0 ? (
                    <div className="grid gap-6">
                        <div className="flex items-center justify-between mb-2 px-1">
                             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Bus className="text-[#008751]" /> {results.length} Trajets trouvés
                            </h2>
                        </div>

                        {results.map(station => (
                            <div key={station.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row gap-6 lg:items-center group">
                                <div className="w-full lg:w-64 h-48 lg:h-48 rounded-2xl overflow-hidden relative shrink-0 shadow-inner bg-gray-100">
                                    <img src={station.photoUrl} alt={station.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-black text-[#008751] uppercase tracking-wider shadow-sm">
                                        {station.companyName}
                                    </div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                         <p className="text-xs font-medium opacity-90 flex items-center gap-1"><Clock size={12}/> {station.departureHours[0] || '--:--'}</p>
                                    </div>
                                </div>

                                <div className="flex-1 w-full flex flex-col justify-between h-full">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-[#008751] transition-colors">{station.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                                                <MapPin size={16} className="text-gray-400" /> {station.location}
                                            </div>
                                        </div>
                                        <div className="text-right mt-4 md:mt-0 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                            <div className="text-2xl font-black text-[#008751]">{station.price.toLocaleString()} F</div>
                                            <div className="text-[10px] font-bold text-green-700 uppercase tracking-wide">par personne</div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 relative">
                                        {/* Connecting Line */}
                                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 hidden md:block"></div>
                                        
                                        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                            <div className="bg-gray-50 md:pr-4">
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Départ</div>
                                                <div className="font-black text-gray-900 text-lg flex items-center gap-2">
                                                     <div className="w-3 h-3 rounded-full bg-[#008751]"></div> {station.pointA}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-center text-gray-300">
                                                <ArrowRight size={24} className="hidden md:block" />
                                                <div className="md:hidden h-8 w-0.5 bg-gray-200 my-2 ml-1.5"></div>
                                            </div>

                                            <div className="bg-gray-50 md:pl-4 text-left md:text-right">
                                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Arrivée</div>
                                                <div className="font-black text-gray-900 text-lg flex items-center gap-2 md:justify-end">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400 md:order-last"></div> {station.pointB}
                                                </div>
                                            </div>
                                        </div>
                                        
                                         <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 items-center">
                                            <Clock size={16} className="text-gray-400 mr-2" />
                                            {station.departureHours?.slice(0, 4).map((h, i) => (
                                                <span key={i} className="bg-white px-3 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 shadow-sm">{h}</span>
                                            ))}
                                            {(station.departureHours?.length || 0) > 4 && <span className="text-xs font-bold text-gray-400 ml-1">+{station.departureHours!.length - 4} horaires</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                        <button onClick={() => onNavigate('LOGIN_VOYAGEUR')} className="flex-1 bg-[#008751] text-white py-4 rounded-xl font-bold hover:bg-[#006b40] transition-all shadow-lg shadow-green-200 active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-green-300">
                                            Réserver ce trajet <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">Aucun trajet trouvé</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                            Désolé, nous n'avons trouvé aucun trajet correspondant à votre recherche pour le moment.
                        </p>
                        <button onClick={() => onNavigate('LANDING')} className="px-8 py-4 bg-[#008751] text-white rounded-2xl font-bold hover:bg-[#006b40] transition-all shadow-lg shadow-green-200">
                            Modifier ma recherche
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
            `}</style>

            <Footer onNavigate={onNavigate} />
        </div>
    );
};
