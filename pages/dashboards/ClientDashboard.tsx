
import React, { useState, useEffect } from 'react';
import { User, Station, Reservation, MOCK_DAYS } from '../../types';
import { getStations, getReservations, createReservation, getUsers, saveUser } from '../../services/storage';
import { MapPin, Calendar, Clock, Bus, CheckCircle, ArrowRight, Download, User as UserIcon, Phone, Mail, Edit, CreditCard, Camera, X, AlertCircle } from 'lucide-react';
import { NotifyFunc } from '../../App';
import { Ticket } from '../../components/Ticket';

interface Props {
    user: User;
    notify: NotifyFunc;
}

export const ClientDashboard: React.FC<Props> = ({ user, notify }) => {
    const [view, setView] = useState<'dashboard' | 'browse' | 'company_profile' | 'profile'>('dashboard');
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [allStations, setAllStations] = useState<Station[]>([]);
    const [companies, setCompanies] = useState<User[]>([]);
    const [myReservations, setMyReservations] = useState<Reservation[]>([]);

    const [bookingStation, setBookingStation] = useState<Station | null>(null);
    const [bookingForm, setBookingForm] = useState({ name: user.name, email: user.email, phone: user.phone || '', date: '', timeIndex: '', ticketClass: 'STANDARD' as 'STANDARD' | 'PREMIUM' });
    const [profileForm, setProfileForm] = useState<Partial<User>>(user);

    const [viewingTicket, setViewingTicket] = useState<Reservation | null>(null);

    useEffect(() => {
        refreshData();
    }, [user.id]);

    useEffect(() => {
        // Scroll to top when view changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [view]);

    const refreshData = () => {
        const stations = getStations();
        setAllStations(stations);
        setCompanies(getUsers().filter(u => u.role === 'COMPANY' && u.status === 'APPROVED'));
        setMyReservations(getReservations().filter(r => r.clientId === user.id));
    };

    // Validation du jour sélectionné par rapport aux jours de travail de la station
    // Validation du jour sélectionné par rapport aux jours de travail de la station
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateVal = e.target.value;
        if (!bookingStation) return;

        const dayIndex = new Date(dateVal).getDay(); // 0 = Sunday, 1 = Monday...
        const jsDayToMockDayMap: { [key: number]: string } = {
            1: "Lun", 2: "Mar", 3: "Mer", 4: "Jeu", 5: "Ven", 6: "Sam", 0: "Dim"
        };

        const selectedDayName = jsDayToMockDayMap[dayIndex];

        if (bookingStation.workDays && bookingStation.workDays.length > 0 && !bookingStation.workDays.includes(selectedDayName)) {
            notify(`Trajet indisponible le ${selectedDayName}. Jours disponibles : ${bookingStation.workDays.join(', ')}.`, "error");
            setBookingForm({ ...bookingForm, date: '' }); // Clear invalid date
            return;
        }

        setBookingForm({ ...bookingForm, date: dateVal });
    };

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingStation || !bookingForm.timeIndex) return;

        const timeIdx = parseInt(bookingForm.timeIndex);
        const depTime = bookingStation.departureHours[timeIdx];

        const price = bookingForm.ticketClass === 'PREMIUM' ? (bookingStation.pricePremium || bookingStation.price * 1.5) : bookingStation.price;

        const reservation: Reservation = {
            id: crypto.randomUUID(),
            stationId: bookingStation.id,
            companyId: bookingStation.companyId,
            clientId: user.id,
            clientName: bookingForm.name,
            clientEmail: bookingForm.email,
            clientPhone: bookingForm.phone,
            routeSummary: `${bookingStation.pointA} vers ${bookingStation.pointB}`,
            departureDate: bookingForm.date,
            departureTime: depTime,
            pricePaid: price,
            ticketClass: bookingForm.ticketClass,
            status: 'CONFIRMED',
            createdAt: new Date().toISOString()
        };

        try {
            createReservation(reservation);
            setBookingStation(null);
            notify(`Réservation confirmée avec ${bookingStation.companyName}`, "success");
            refreshData();
            setView('dashboard');
            setViewingTicket(reservation);
        } catch (err: any) {
            notify(err.message, "error");
        }
    };

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (profileForm.id) {
            try {
                saveUser(profileForm as User);
                notify("Profil mis à jour avec succès", "success");
            } catch (err: any) {
                notify(err.message || "Erreur lors de la sauvegarde", "error");
            }
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 700) {
                notify("L'image est trop lourde (Max 700Ko).", "error");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setProfileForm(prev => ({ ...prev, avatarUrl: base64 }));
                if (user.id) {
                    const updatedUser = { ...user, ...profileForm, avatarUrl: base64 } as User;
                    try {
                        saveUser(updatedUser);
                        notify("Photo de profil mise à jour !", "success");
                    } catch (err: any) {
                        notify(err.message || "Impossible de sauvegarder l'image", "error");
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const renderProfile = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><UserIcon /> Mon Profil Client</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex justify-center mb-6">
                    <div className="relative group cursor-pointer">
                        <img src={profileForm.avatarUrl} className="w-32 h-32 rounded-full border-4 border-green-100 object-cover bg-gray-100" alt="Profil" />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                        <label className="absolute bottom-0 right-0 bg-[#008751] p-2 rounded-full text-white shadow-md cursor-pointer hover:bg-[#006b40] transition-colors">
                            <Edit size={14} />
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </label>
                    </div>
                </div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Nom Complet</label><input type="text" className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-[#008751]" value={profileForm.name || ''} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Email</label><input type="email" disabled className="w-full rounded-lg border border-gray-300 p-3 bg-gray-100" value={profileForm.email || ''} /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Numéro NPI</label><div className="relative"><CreditCard className="absolute left-3 top-3 text-gray-400" size={18} /><input type="text" className="w-full rounded-lg border border-gray-300 p-3 pl-10 focus:ring-2 focus:ring-[#008751]" value={profileForm.npi || ''} onChange={e => setProfileForm({ ...profileForm, npi: e.target.value })} /></div></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Numéro de Téléphone</label><input type="tel" className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-[#008751]" value={profileForm.phone || ''} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
                <div className="pt-4"><button type="submit" className="w-full bg-[#008751] text-white py-3 rounded-lg font-bold hover:bg-[#006b40] shadow-lg shadow-green-100">Enregistrer les modifications</button></div>
            </form>
        </div>
    );

    const renderDashboard = () => (
        <div className="animate-fade-in space-y-8">
            <div className="benin-gradient-bg rounded-2xl p-8 text-white shadow-xl">
                <div className="flex justify-between items-start">
                    <div><h1 className="text-3xl font-bold mb-2">Bonjour, {user.name} 👋</h1><p className="opacity-90 mb-6">Voyagez à travers le Bénin en toute simplicité.</p></div>
                    <div className="bg-white/20 rounded-full p-2 cursor-pointer hover:bg-white/30" onClick={() => setView('profile')}>
                        {user.avatarUrl ? <img src={user.avatarUrl} className="w-8 h-8 rounded-full object-cover" /> : <UserIcon size={24} />}
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 flex-1 max-w-xs border border-white/10">
                        <p className="text-sm opacity-90 uppercase font-bold tracking-wide">Mes Réservations</p>
                        <p className="text-4xl font-bold mt-1">{myReservations.length}</p>
                    </div>
                    <div className="bg-white text-[#008751] rounded-xl p-5 flex-1 max-w-xs cursor-pointer hover:scale-105 transition-transform shadow-lg" onClick={() => setView('browse')}>
                        <p className="text-sm font-bold uppercase flex items-center gap-2 text-benin-green">Réserver maintenant <ArrowRight size={16} /></p>
                        <p className="text-2xl font-bold mt-1">Parcourir</p>
                    </div>
                    <div className="bg-white/90 text-gray-800 rounded-xl p-5 flex-1 max-w-xs cursor-pointer hover:scale-105 transition-transform shadow-lg" onClick={() => setView('browse')}>
                        <p className="text-sm font-bold uppercase flex items-center gap-2">Voir Compagnies <ArrowRight size={16} /></p>
                        <p className="text-2xl font-bold mt-1">{companies.length} Agences</p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Bus /> Mes Derniers Voyages</h2>
                <div className="grid gap-4">
                    {myReservations.map(res => (
                        <div key={res.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-5 w-full md:w-auto">
                                <div className="w-14 h-14 bg-green-50 text-[#008751] rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-green-100 transition-colors"><Bus size={28} /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{res.routeSummary}</h3>
                                    <div className="text-sm text-gray-500 flex gap-4 mt-1"><span className="flex items-center gap-1.5"><Calendar size={14} /> {res.departureDate}</span><span className="flex items-center gap-1.5"><Clock size={14} /> {res.departureTime}</span></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right mr-4 hidden md:block"><p className="text-xs text-gray-400 uppercase font-bold">Prix Payé</p><p className="font-bold text-[#008751]">{res.pricePaid} FCFA</p></div>
                                <button onClick={() => setViewingTicket(res)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black text-sm font-bold shadow-lg shadow-gray-200 transition-transform active:scale-95"><Download size={18} /> Voir Ticket</button>
                            </div>
                        </div>
                    ))}
                    {myReservations.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <Bus size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Vous n'avez encore effectué aucun voyage.</p>
                            <button onClick={() => setView('browse')} className="mt-4 text-[#008751] font-bold hover:underline">Trouver un trajet maintenant</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderBrowse = () => (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setView('dashboard')} className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50"><ArrowRight className="rotate-180" /></button>
                <div><h2 className="text-2xl font-bold text-gray-800">Compagnies Disponibles</h2><p className="text-gray-500 text-sm">Sélectionnez une compagnie certifiée pour voir les départs.</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(company => (
                    <div key={company.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:border-green-400 hover:shadow-lg transition-all cursor-pointer group" onClick={() => { setSelectedCompanyId(company.id); setView('company_profile'); }}>
                        <div className="h-32 bg-gray-200 relative">
                            {company.bannerUrl ? <img src={company.bannerUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Pas de bannière</div>}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="px-6 pb-6 relative">
                            <div className="-mt-10 mb-4 flex justify-between items-end">
                                <img src={company.avatarUrl} alt={company.companyName} className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md bg-white" />
                                <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full mb-2">CERTIFIÉ</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{company.companyName}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">Voyagez confortablement avec {company.companyName}.</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-sm font-medium text-gray-600">{allStations.filter(s => s.companyId === company.id).length} départs</span>
                                <span className="text-[#008751] font-bold text-sm flex items-center gap-1">Voir profil <ArrowRight size={14} /></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCompanyProfile = () => {
        const company = companies.find(c => c.id === selectedCompanyId);
        const companyStations = allStations.filter(s => s.companyId === selectedCompanyId);

        return (
            <div className="animate-fade-in space-y-6">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-sm">
                    {company?.bannerUrl ? <img src={company.bannerUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-800" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <button onClick={() => setView('browse')} className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30"><ArrowRight className="rotate-180" /></button>
                    <div className="absolute bottom-6 left-6 flex items-center gap-4">
                        <img src={company?.avatarUrl} className="w-16 h-16 rounded-full border-2 border-white object-cover bg-white" />
                        <div><h1 className="text-3xl font-bold text-white">{company?.companyName}</h1><p className="text-white/80 text-sm">Agence Agréée</p></div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 px-2">Trajets disponibles</h3>
                <div className="grid grid-cols-1 gap-4">
                    {companyStations.map(station => (
                        <div key={station.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col md:flex-row gap-6 hover:border-[#008751] transition-colors shadow-sm">
                            <div className="w-full md:w-56 h-40 flex-shrink-0 rounded-lg overflow-hidden relative">
                                <img src={station.photoUrl} alt={station.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">{station.type === 'STATION' ? 'SOUS-STATION' : 'DIRECT'}</div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div><h3 className="font-bold text-xl text-gray-800">{station.name}</h3><p className="text-gray-500 text-sm mt-1 flex items-center gap-1"><MapPin size={14} /> {station.location}</p></div>
                                        <div className="text-right"><span className="block font-bold text-2xl text-[#008751]">{station.price} F</span><span className="text-xs text-gray-400">par personne</span></div>
                                    </div>
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-700 font-medium mb-2"><span className="w-2 h-2 bg-[#008751] rounded-full"></span>{station.pointA} <ArrowRight size={14} className="text-gray-400" /> {station.pointB}</div>
                                        <p className="text-sm text-gray-500 italic">{station.description || "Départ confortable et sécurisé."}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex flex-wrap gap-2">{station.workDays.slice(0, 5).map(d => <span key={d} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium border border-gray-200">{d}</span>)}</div>
                                    <button onClick={() => { setBookingStation(station); setBookingForm({ ...bookingForm, date: '', timeIndex: '', ticketClass: 'STANDARD' }); }} className="px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black shadow-lg shadow-gray-300 transform hover:-translate-y-1 transition-all">Réserver</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSidebar = () => (
        <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-20 hidden md:flex">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#008751] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Bus size={20} />
                </div>
                <h1 className="font-black text-xl tracking-tight text-gray-800">VoyageBj</h1>
            </div>

            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
                <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-green-50 text-[#008751]' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Bus size={18} /> Tableau de bord
                </button>
                <button onClick={() => setView('browse')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'browse' || view === 'company_profile' ? 'bg-green-50 text-[#008751]' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <MapPin size={18} /> Réserver un trajet
                </button>
                <button onClick={() => setView('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'profile' ? 'bg-green-50 text-[#008751]' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <UserIcon size={18} /> Mon Profil
                </button>

                <div className="pt-4 mt-4 border-t border-gray-100">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase mb-2">Mes Voyages</p>
                    {myReservations.slice(0, 3).map(res => (
                        <div key={res.id} onClick={() => setViewingTicket(res)} className="px-4 py-2 hover:bg-gray-50 cursor-pointer rounded-lg mb-1 group">
                            <p className="text-xs font-bold text-gray-700 truncate group-hover:text-[#008751] transition-colors">{res.routeSummary}</p>
                            <p className="text-[10px] text-gray-400">{res.departureDate}</p>
                        </div>
                    ))}
                    {myReservations.length === 0 && <p className="px-4 text-xs text-gray-400 italic">Aucun voyage récent</p>}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    {user.avatarUrl ? <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500"><UserIcon size={20} /></div>}
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            {renderSidebar()}

            <div className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#008751] rounded-lg flex items-center justify-center text-white"><Bus size={16} /></div>
                        <h1 className="font-black text-lg text-gray-800">VoyageBj</h1>
                    </div>
                    <div className="bg-gray-200 p-2 rounded-full" onClick={() => setView('profile')}><UserIcon size={20} className="text-gray-600" /></div>
                </div>

                <div className="max-w-5xl mx-auto">
                    {view === 'dashboard' && renderDashboard()}
                    {view === 'browse' && renderBrowse()}
                    {view === 'company_profile' && renderCompanyProfile()}
                    {view === 'profile' && renderProfile()}
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around z-30 pb-safe">
                <button onClick={() => setView('dashboard')} className={`flex flex-col items-center p-2 rounded-lg ${view === 'dashboard' ? 'text-[#008751]' : 'text-gray-400'}`}><Bus size={20} /><span className="text-[10px] font-bold mt-1">Accueil</span></button>
                <button onClick={() => setView('browse')} className={`flex flex-col items-center p-2 rounded-lg ${view === 'browse' || view === 'company_profile' ? 'text-[#008751]' : 'text-gray-400'}`}><MapPin size={20} /><span className="text-[10px] font-bold mt-1">Réserver</span></button>
                <button onClick={() => setView('profile')} className={`flex flex-col items-center p-2 rounded-lg ${view === 'profile' ? 'text-[#008751]' : 'text-gray-400'}`}><UserIcon size={20} /><span className="text-[10px] font-bold mt-1">Profil</span></button>
            </div>

            {bookingStation && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-[#008751] p-6 text-white relative shrink-0">
                            <div className="relative z-10 text-center">
                                <h3 className="text-xl font-black uppercase tracking-wider">Réservation</h3>
                                <p className="text-green-100 text-xs mt-1 font-medium">Complétez vos informations</p>
                            </div>
                            <button onClick={() => setBookingStation(null)} className="absolute top-4 right-4 text-green-100 hover:text-white bg-green-800/30 p-2 rounded-full"><X size={18} /></button>
                        </div>

                        <div className="overflow-y-auto p-6 space-y-5">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-green-800 uppercase">Trajet</span>
                                    <span className="text-xs font-bold text-green-600 bg-white px-2 py-1 rounded-full shadow-sm">{bookingStation.companyName}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-800 font-bold text-lg">
                                    {bookingStation.pointA} <ArrowRight size={16} className="text-green-500" /> {bookingStation.pointB}
                                </div>
                            </div>

                            <form onSubmit={handleBook} className="space-y-5">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Passager</label><input type="text" required className="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] font-bold text-gray-800" value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })} placeholder="Nom complet" /></div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label><input type="tel" required className="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] font-medium" value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })} /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input type="email" required className="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] font-medium" value={bookingForm.email} onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })} /></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jours Disponibles</label>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {bookingStation.workDays?.map(day => (
                                                <span key={day} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100 font-bold">{day}</span>
                                            ))}
                                        </div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                        <input type="date" required min={new Date().toISOString().split('T')[0]} className="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] font-medium" value={bookingForm.date} onChange={handleDateChange} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Heure</label>
                                        <select required className="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] font-medium" value={bookingForm.timeIndex} onChange={e => setBookingForm({ ...bookingForm, timeIndex: e.target.value })} disabled={!bookingForm.date}>
                                            <option value="">--:--</option>
                                            {bookingStation.departureHours.map((h, idx) => (
                                                <option key={idx} value={idx}>{h}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Classe</label>
                                    <div className="space-y-3">
                                        <label className={`flex items-center justify-between border rounded-xl p-3 cursor-pointer transition-all ${bookingForm.ticketClass === 'STANDARD' ? 'border-[#008751] bg-green-50 ring-1 ring-[#008751]' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="class" value="STANDARD" className="w-4 h-4 text-[#008751]" checked={bookingForm.ticketClass === 'STANDARD'} onChange={() => setBookingForm({ ...bookingForm, ticketClass: 'STANDARD' })} />
                                                <div><span className="font-bold text-gray-800 block text-sm">Standard</span><span className="text-xs text-gray-500">1 bagage inclus</span></div>
                                            </div>
                                            <span className="font-bold text-gray-800">{bookingStation.price} F</span>
                                        </label>
                                        <label className={`flex items-center justify-between border rounded-xl p-3 cursor-pointer transition-all ${bookingForm.ticketClass === 'PREMIUM' ? 'border-[#FCD116] bg-yellow-50 ring-1 ring-[#FCD116]' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="class" value="PREMIUM" className="w-4 h-4 text-[#FCD116]" checked={bookingForm.ticketClass === 'PREMIUM'} onChange={() => setBookingForm({ ...bookingForm, ticketClass: 'PREMIUM' })} />
                                                <div><span className="font-bold text-gray-800 block text-sm">Premium</span><span className="text-xs text-gray-500">Confort +, Snack</span></div>
                                            </div>
                                            <span className="font-bold text-gray-800">{bookingStation.pricePremium || bookingStation.price * 1.5} F</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="w-full py-4 rounded-xl bg-[#008751] text-white font-bold hover:bg-[#006b40] shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all transform active:scale-95">
                                        <CheckCircle size={20} />
                                        Payer {bookingForm.ticketClass === 'PREMIUM' ? (bookingStation.pricePremium || bookingStation.price * 1.5) : bookingStation.price} FCFA
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {viewingTicket && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[10002] p-4 animate-fade-in">
                    <div className="relative">
                        <button onClick={() => setViewingTicket(null)} className="absolute -top-12 right-0 text-white hover:text-gray-200 flex items-center gap-2 font-bold"><X size={24} /> Fermer</button>
                        <Ticket
                            data={{
                                id: viewingTicket.id,
                                passengerName: viewingTicket.clientName,
                                contact: viewingTicket.clientPhone,
                                origin: viewingTicket.routeSummary.split(' vers ')[0],
                                destination: viewingTicket.routeSummary.split(' vers ')[1],
                                date: viewingTicket.departureDate,
                                departureTime: viewingTicket.departureTime,
                                arrivalTime: allStations.find(s => s.id === viewingTicket.stationId)?.arrivalHours?.[
                                    allStations.find(s => s.id === viewingTicket.stationId)?.departureHours.indexOf(viewingTicket.departureTime) || 0
                                ] || '--:--',
                                price: viewingTicket.pricePaid,
                                currency: 'FCFA',
                                companyName: companies.find(c => c.id === viewingTicket.companyId)?.companyName,
                                ticketClass: viewingTicket.ticketClass
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
