import React, { useState, useEffect } from 'react';
import { User, Station, ViewState } from '../../shared/types';
import { getUsers, getStations } from '../../shared/services/storage';
import { MapPin, Phone, Mail, MessageCircle, X, ChevronLeft, Building2, ArrowRight, Clock, Bus } from 'lucide-react';
import { Footer } from '../../shared/components/Footer';

interface Props {
    onNavigate: (page: ViewState, params?: any) => void;
    companyId: string;
    user: User | null;
}

export const CompanyDetailsPage: React.FC<Props> = ({ onNavigate, companyId, user }) => {
    const [company, setCompany] = useState<User | null>(null);
    const [stations, setStations] = useState<Station[]>([]);
    const [routes, setRoutes] = useState<Station[]>([]);
    const [showContactModal, setShowContactModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'stations' | 'routes'>('stations');
    const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

    useEffect(() => {
        const allUsers = getUsers();
        const foundCompany = allUsers.find(u => u.id === companyId && u.role === 'COMPANY');
        setCompany(foundCompany || null);

        if (foundCompany) {
            const allStations = getStations();
            const companyStations = allStations.filter(s => s.companyId === companyId);
            setStations(companyStations.filter(s => s.type === 'STATION'));
            setRoutes(companyStations.filter(s => s.type === 'ROUTE'));
        }
    }, [companyId]);

    if (!company) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Compagnie introuvable</h2>
                    <button onClick={() => onNavigate('COMPANIES_LIST')} className="text-[#008751] font-bold hover:underline">
                        Retour à la liste
                    </button>
                </div>
            </div>
        );
    }

    const getRoutesForStation = (stationId: string) => {
        return routes.filter(r => r.parentId === stationId);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col pt-[70px]">
            {/* Header with Banner */}
            <div className="relative h-64 bg-gradient-to-br from-[#008751] to-[#e9b400] overflow-hidden">
                {company.bannerUrl && (
                    <img src={company.bannerUrl} className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8 w-full">
                        <button
                            onClick={() => onNavigate('COMPANIES_LIST')}
                            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full transition-all text-sm font-bold border border-white/20"
                        >
                            <ChevronLeft size={18} /> Retour
                        </button>

                        <div className="flex items-end gap-6">
                            {/* Company Logo */}
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                                <img
                                    src={company.avatarUrl || `https://ui-avatars.com/api/?name=${company.companyName}&background=random`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Company Info */}
                            <div className="flex-1 text-white pb-2">
                                <h1 className="text-3xl md:text-4xl font-black mb-2">{company.companyName}</h1>
                                {company.address && (
                                    <div className="flex items-center gap-2 text-green-50 mb-3">
                                        <MapPin size={16} />
                                        <span>{company.address}</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowContactModal(true)}
                                    className="bg-white text-[#008751] px-6 py-2 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Phone size={18} /> Contact
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Content Area */}
            <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-[#008751] rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                            {selectedStationId ? (stations.find(s => s.id === selectedStationId)?.name) : "Nos Stations & Trajets"}
                        </h2>
                    </div>
                    {selectedStationId && (
                        <button
                            onClick={() => setSelectedStationId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 text-sm"
                        >
                            <ChevronLeft size={18} /> Retour
                        </button>
                    )}
                </div>

                {!selectedStationId ? (
                    <div className="space-y-12">
                        {/* Grille des Stations */}
                        {stations.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {stations.map(station => {
                                    const stationRoutes = getRoutesForStation(station.id);
                                    return (
                                        <div
                                            key={station.id}
                                            onClick={() => setSelectedStationId(station.id)}
                                            className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                                        >
                                            <div className="h-56 relative overflow-hidden">
                                                <img
                                                    src={station.photoUrl || `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg border border-white/30 uppercase tracking-widest">Gare</span>
                                                        <span className="bg-[#008751] text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">{stationRoutes.length} Départs</span>
                                                    </div>
                                                    <h3 className="text-white text-2xl font-black leading-tight group-hover:text-green-300 transition-colors">{station.name}</h3>
                                                </div>
                                            </div>
                                            <div className="p-6 flex items-center justify-between bg-gray-50/50">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                                                    <MapPin size={16} className="text-[#008751]" />
                                                    {station.location}
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#008751] group-hover:bg-[#008751] group-hover:text-white transition-all shadow-sm">
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Trajets Directs / Standalone */}
                        {routes.filter(r => !r.parentId).length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Bus size={24} className="text-orange-500" /> Trajets Directs
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {routes.filter(r => !r.parentId).map(route => (
                                        <div key={route.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                <div className="w-full sm:w-40 h-32 rounded-3xl overflow-hidden shrink-0">
                                                    <img src={route.photoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Direct</span>
                                                        <span className="font-black text-xl text-[#008751]">{route.price?.toLocaleString()} F</span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-4">{route.name}</h4>
                                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-center gap-4">
                                                        <span className="font-bold text-gray-800">{route.pointA}</span>
                                                        <ArrowRight size={18} className="text-gray-400" />
                                                        <span className="font-bold text-gray-800">{route.pointB}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => user ? onNavigate('DASHBOARD_CLIENT', { bookingRouteId: route.id }) : onNavigate('LOGIN_VOYAGEUR')}
                                                className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                                            >
                                                Réserver ce trajet
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {stations.length === 0 && routes.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                                <Building2 size={64} className="mx-auto mb-6 text-gray-200" />
                                <p className="text-gray-400 text-lg font-medium">Aucun service disponible pour le moment</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Trajets de la station sélectionnée */}
                        {getRoutesForStation(selectedStationId).length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {getRoutesForStation(selectedStationId).map(route => (
                                    <div key={route.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6">
                                        <div className="w-full sm:w-56 h-40 rounded-3xl overflow-hidden shrink-0">
                                            <img src={route.photoUrl} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-xl font-bold text-gray-900">{route.name}</h3>
                                                    <span className="font-black text-2xl text-[#008751]">{route.price?.toLocaleString()} F</span>
                                                </div>
                                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 mb-4">
                                                    <span className="font-bold text-[#008751]">{route.pointA}</span>
                                                    <ArrowRight size={16} className="text-gray-400" />
                                                    <span className="font-bold text-[#008751]">{route.pointB}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-6">
                                                    <Clock size={16} className="text-[#008751]" />
                                                    Départs : {route.departureHours?.slice(0, 3).join(' • ')}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => user ? onNavigate('DASHBOARD_CLIENT', { bookingRouteId: route.id }) : onNavigate('LOGIN_VOYAGEUR')}
                                                className="w-full bg-[#008751] text-white py-4 rounded-2xl font-bold hover:bg-[#006b40] shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                Réserver mon billet <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
                                <Bus size={64} className="mx-auto mb-6 text-gray-200" />
                                <p className="text-gray-400 text-lg font-medium">Aucun trajet au départ de cette gare</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Contact Modal */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-xl text-gray-800">Contacter {company.companyName}</h3>
                            <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Email */}
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Email</p>
                                    <a href={`mailto:${company.email}`} className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors truncate block">
                                        {company.email}
                                    </a>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            {company.whatsapp && (
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">WhatsApp</p>
                                        <a
                                            href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base font-bold text-gray-900 hover:text-green-600 transition-colors truncate block"
                                        >
                                            {company.whatsapp}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Phone */}
                            {company.phone && (
                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Téléphone</p>
                                        <a href={`tel:${company.phone}`} className="text-base font-bold text-gray-900 hover:text-purple-600 transition-colors truncate block">
                                            {company.phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {company.address && (
                                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Localisation</p>
                                        <p className="text-base font-bold text-gray-900">
                                            {company.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">Compagnie vérifiée et approuvée par VoyageBJ</p>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};
