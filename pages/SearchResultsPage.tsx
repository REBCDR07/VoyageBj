import React, { useState, useEffect } from 'react';
import { Station, User } from '../types';
import { getStations, getUsers } from '../services/storage';
import { MapPin, Calendar, Clock, ArrowRight, Bus, AlertCircle } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col pt-[70px]">
            <div className="bg-[#008751] text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Résultats de recherche</h1>
                    <div className="flex items-center gap-2 text-green-100">
                        <MapPin size={18} />
                        <span>{searchParams?.departure || 'Toutes villes'}</span>
                        <ArrowRight size={18} />
                        <span>{searchParams?.arrival || 'Toutes villes'}</span>
                        {searchParams?.date && (
                            <>
                                <span className="mx-2">•</span>
                                <Calendar size={18} />
                                <span>{searchParams.date}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#008751] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500">Recherche des meilleurs trajets...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid gap-6">
                        {results.map(station => (
                            <div key={station.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative shrink-0">
                                    <img src={station.photoUrl} alt={station.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#008751] uppercase">
                                        {station.companyName}
                                    </div>
                                </div>

                                <div className="flex-1 w-full">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{station.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <MapPin size={14} /> {station.location}
                                            </div>
                                        </div>
                                        <div className="text-right mt-2 md:mt-0">
                                            <div className="text-2xl font-bold text-[#008751]">{station.price} FCFA</div>
                                            <div className="text-xs text-gray-400">par personne</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl mb-4">
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Départ</div>
                                            <div className="font-bold text-gray-800">{station.pointA}</div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <ArrowRight className="text-gray-300" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Arrivée</div>
                                            <div className="font-bold text-gray-800">{station.pointB}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase font-bold mb-1">Horaires</div>
                                            <div className="flex flex-wrap gap-1">
                                                {station.departureHours?.slice(0, 3).map((h, i) => (
                                                    <span key={i} className="bg-white px-2 py-1 rounded border border-gray-200 text-xs font-medium">{h}</span>
                                                ))}
                                                {(station.departureHours?.length || 0) > 3 && <span className="text-xs text-gray-400 self-center">+{station.departureHours!.length - 3}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => onNavigate('LOGIN_VOYAGEUR')} className="flex-1 bg-[#008751] text-white py-3 rounded-xl font-bold hover:bg-[#006b40] transition-colors shadow-lg shadow-green-100">
                                            Réserver ce trajet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Bus size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun trajet trouvé</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Désolé, nous n'avons trouvé aucun trajet correspondant à votre recherche pour le moment. Essayez d'autres villes ou dates.
                        </p>
                        <button onClick={() => onNavigate('LANDING')} className="text-[#008751] font-bold hover:underline">
                            Retour à l'accueil
                        </button>
                    </div>
                )}
            </div>

            <Footer onNavigate={onNavigate} />
        </div>
    );
};
