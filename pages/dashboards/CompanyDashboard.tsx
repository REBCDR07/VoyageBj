
import React, { useState, useEffect } from 'react';
import { User, Station, Reservation } from '../../types';
import { getStations, deleteStation, getReservations, saveUser, getUsers } from '../../services/storage';
import {
  Plus, MapPin, Trash2, Edit, Users,
  TrendingUp, FileText, X, ArrowRight, Save, Camera, FileJson,
  MessageCircle, Phone, Mail, HelpCircle, Image as ImageIcon, Bus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { jsPDF } from "jspdf";
import { NotifyFunc } from '../../App';

interface Props {
  user: User;
  notify: NotifyFunc;
  onNavigate: (view: any) => void;
  setEditStationId: (id: string | null) => void;
}

const COLORS = ['#008751', '#e9b400', '#e8112d', '#292a2c']; // Benin Green, Yellow, Red, Dark

export const CompanyDashboard: React.FC<Props> = ({ user, notify, onNavigate, setEditStationId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stations' | 'reservations' | 'profile'>('overview');
  const [stations, setStations] = useState<Station[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [viewingReservationId, setViewingReservationId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [profileForm, setProfileForm] = useState<Partial<User>>({});

  const [showAdminContact, setShowAdminContact] = useState(false);
  const [adminInfo, setAdminInfo] = useState<User | null>(null);

  useEffect(() => {
    refreshData();
    const admin = getUsers().find(u => u.role === 'ADMIN');
    setAdminInfo(admin || null);
  }, [user.id]);

  useEffect(() => {
    if (activeTab === 'profile') {
      setProfileForm(user);
    }
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, user]);

  const refreshData = () => {
    const allStations = getStations().filter(s => s.companyId === user.id);
    setStations(allStations);
    const allRes = getReservations().filter(r => r.companyId === user.id);
    setReservations(allRes);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette station ?')) {
      deleteStation(id);
      refreshData();
      notify("Station supprimée avec succès", "success");
    }
  };

  const handleEdit = (id: string) => {
    setEditStationId(id);
    onNavigate('STATION_MANAGER');
  };

  const handleCreate = (type: 'STATION' | 'ROUTE') => {
    setEditStationId(null);
    // You might want to pass the type via a separate state or just default it in the manager
    onNavigate('STATION_MANAGER');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.id) {
      try {
        saveUser(profileForm as User);
        notify("Profil mis à jour avec succès.", "success");
      } catch (err: any) {
        notify(err.message, "error");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 700) {
        notify("Fichier trop volumineux (Max 700Ko).", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileForm(prev => ({ ...prev, [field]: base64 }));
        if (user.id) {
          const updatedUser = { ...user, ...profileForm, [field]: base64 } as User;
          try {
            saveUser(updatedUser);
            notify("Image mise à jour !", "success");
          } catch (err: any) {
            notify("Impossible de sauvegarder : " + err.message, "error");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportReservationsPDF = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    const stationRes = reservations.filter(r => r.stationId === stationId);
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Liste des passagers - ${station?.name}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Trajet: ${station?.pointA} -> ${station?.pointB}`, 14, 32);
    let y = 50;
    stationRes.forEach((res, index) => {
      doc.text(`${index + 1}. ${res.clientName} - ${res.clientPhone} - ${res.departureDate}`, 14, y);
      y += 10;
    });
    doc.save(`reservations_${station?.name}.pdf`);
    notify("Export PDF téléchargé", "success");
  };

  const exportReservationsJSON = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    const stationRes = reservations.filter(r => r.stationId === stationId);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stationRes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `reservations_${station?.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    notify("Export JSON téléchargé", "success");
  };

  const renderProfile = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="relative h-48 md:h-64 bg-gray-200 group">
        {profileForm.bannerUrl ? <img src={profileForm.bannerUrl} alt="Cover" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 benin-gradient-bg">Pas de bannière</div>}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 backdrop-blur-sm cursor-pointer flex items-center gap-2">
            <ImageIcon size={20} /> Modifier la bannière
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'bannerUrl')} />
          </label>
        </div>
      </div>
      <div className="px-8 pb-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 mb-6 gap-6">
          <div className="relative group cursor-pointer">
            <img src={profileForm.avatarUrl} alt="Profile" className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
            <label className="absolute bottom-2 right-2 bg-[#008751] p-2 rounded-full text-white shadow-md cursor-pointer hover:bg-[#006b40]">
              <Edit size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatarUrl')} />
            </label>
          </div>
          <div className="flex-1 pt-2 md:pt-0">
            <h2 className="text-3xl font-bold text-gray-800">{profileForm.companyName}</h2>
            <p className="text-gray-500">{profileForm.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="md:col-span-2"><h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 border-green-100">Informations de l'Entreprise</h3></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'Agence</label><input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-[#008751]" value={profileForm.companyName || ''} onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom du Responsable</label><input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-[#008751]" value={profileForm.name || ''} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" disabled className="w-full rounded-lg border border-gray-300 p-2.5 bg-gray-100 cursor-not-allowed" value={profileForm.email || ''} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">IFU</label><input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-[#008751]" value={profileForm.ifu || ''} onChange={e => setProfileForm({ ...profileForm, ifu: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">RCCM</label><input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-[#008751]" value={profileForm.rccm || ''} onChange={e => setProfileForm({ ...profileForm, rccm: e.target.value })} /></div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-[#008751] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#006b40] flex items-center gap-2 shadow-lg shadow-green-200">
              <Save size={20} /> Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderOverview = () => {
    const popularRoutes = stations.map(s => ({ name: s.name, reservations: reservations.filter(r => r.stationId === s.id).length }));
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Réservations</p><h3 className="text-3xl font-bold text-benin-green mt-1">{reservations.length}</h3></div>
              <div className="p-3 bg-green-100 rounded-full text-benin-green"><Users size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Sous-stations</p><h3 className="text-3xl font-bold text-benin-yellow mt-1">{stations.length}</h3></div>
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-700"><MapPin size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Remplissage</p><h3 className="text-3xl font-bold text-benin-red mt-1">-- %</h3></div>
              <div className="p-3 bg-red-100 rounded-full text-red-700"><TrendingUp size={24} /></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-bold mb-4 text-gray-800">Trafic par Station</h4>
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={popularRoutes.slice(0, 5)}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="reservations" fill="#008751" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-bold mb-4 text-gray-800">Répartition</h4>
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={popularRoutes} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="reservations">{popularRoutes.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </div>
        </div>
      </div>
    );
  };

  const renderStations = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div><h2 className="text-2xl font-bold text-gray-800">Gestion des Stations</h2><p className="text-gray-500">Gérez vos sous-stations et vos parcours directs.</p></div>
        <div className="flex gap-3">
          <button onClick={() => handleCreate('STATION')} className="bg-[#008751] text-white px-5 py-2.5 rounded-lg hover:bg-[#006b40] flex items-center gap-2 transition-colors shadow-md font-medium"><Plus size={20} /> Créer Sous-station</button>
          <button onClick={() => handleCreate('ROUTE')} className="bg-[#e9b400] text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 flex items-center gap-2 transition-colors shadow-md font-medium"><Plus size={20} /> Créer Parcours</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <div key={station.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-md transition-all group">
            <div className="h-48 overflow-hidden relative">
              <img src={station.photoUrl} alt={station.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white w-full pr-4">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                    <Bus size={18} className="text-white" />
                    {station.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm backdrop-blur-sm ${station.type === 'STATION' ? 'bg-[#008751]/80 border-green-400 text-white' : 'bg-[#e9b400]/80 border-yellow-400 text-white'}`}>
                    {station.type === 'STATION' ? 'SOUS-STATION' : 'PARCOURS'}
                  </span>
                </div>
                <p className="text-sm opacity-90">{station.location}</p>
              </div>
            </div>
            <div className="p-5">
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                <div className="flex justify-between items-center text-sm mb-2"><span className="text-gray-500 font-medium">Trajet</span><span className="font-bold text-gray-800 flex items-center gap-1">{station.pointA} <ArrowRight size={14} /> {station.pointB}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-gray-500 font-medium">Prix</span><div className="text-right"><span className="font-bold text-benin-green text-lg block">{station.price} F</span>{station.pricePremium && <span className="text-xs font-bold text-yellow-600 block">{station.pricePremium} F (Prem)</span>}</div></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(station.id)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 flex justify-center items-center gap-2 text-sm font-bold transition-colors"><Edit size={16} /> Modifier</button>
                <button onClick={() => handleDelete(station.id)} className="w-12 bg-red-50 border border-red-100 text-[#e8112d] rounded-lg hover:bg-red-100 flex justify-center items-center transition-colors" title="Supprimer"><Trash2 size={18} /></button>
              </div>
              <button onClick={() => { setViewingReservationId(station.id); setActiveTab('reservations'); }} className="w-full mt-3 bg-green-50 text-[#008751] py-2.5 rounded-lg hover:bg-green-100 text-sm font-bold transition-colors flex items-center justify-center gap-2"><Users size={16} /> Voir les Réservations</button>
            </div>
          </div>
        ))}
        {stations.length === 0 && (
          <div className="col-span-1 md:col-span-3 py-10 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <MapPin size={40} className="mb-2 opacity-50" />
            <p className="font-medium">Aucune station ou parcours créé.</p>
            <button onClick={() => handleCreate('STATION')} className="mt-2 text-[#008751] font-bold hover:underline">Créer maintenant</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderReservations = () => {
    let filteredRes = viewingReservationId ? reservations.filter(r => r.stationId === viewingReservationId) : reservations;

    // Apply Date Filter
    if (filterDate) {
      filteredRes = filteredRes.filter(r => r.departureDate === filterDate);
    }

    const currentStation = viewingReservationId ? stations.find(s => s.id === viewingReservationId) : null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h2 className="text-xl font-bold text-gray-800">{currentStation ? `Liste des passagers : ${currentStation.name}` : 'Toutes les Réservations'}</h2></div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#008751] outline-none bg-gray-50"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {viewingReservationId && (
              <>
                <button onClick={() => exportReservationsPDF(viewingReservationId)} className="flex items-center gap-2 px-4 py-2 bg-[#e8112d] text-white rounded-lg hover:bg-red-700 text-sm font-medium shadow-sm"><FileText size={16} /> PDF</button>
                <button onClick={() => exportReservationsJSON(viewingReservationId)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium shadow-sm"><FileJson size={16} /> JSON</button>
              </>
            )}
            <button onClick={() => { setViewingReservationId(null); setFilterDate(''); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"><X size={16} /> {viewingReservationId ? 'Voir tout' : 'Reset'}</button>
          </div>
        </div>
        <div className="p-6">
          {filteredRes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRes.map(res => {
                const station = stations.find(s => s.id === res.stationId);
                return (
                  <div key={res.id} className="relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    {/* Benin colors stripe */}
                    <div className="absolute top-0 left-0 right-0 h-2 benin-gradient-bg"></div>
                    
                    <div className="p-5 pt-6">
                      {/* Route info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#008751] text-white flex items-center justify-center font-bold text-sm">
                            {res.clientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{res.clientName}</p>
                            <p className="text-xs text-gray-500">{res.clientPhone}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-[#008751] border border-green-200">
                          {res.ticketClass || 'STANDARD'}
                        </span>
                      </div>

                      {/* Trip details */}
                      <div className="bg-gray-100 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-500 font-medium">Trajet</span>
                          <span className="font-bold text-gray-700">{station?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <span>{station?.pointA || 'N/A'}</span>
                          <ArrowRight size={14} className="text-[#FCD116]" />
                          <span>{station?.pointB || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Date</p>
                          <p className="text-xs font-bold text-gray-900">{res.departureDate}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Heure</p>
                          <p className="text-xs font-bold text-[#008751]">{res.departureTime}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500 font-medium">Montant payé</span>
                        <span className="text-lg font-bold text-[#008751]">{res.pricePaid} F</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium">Aucune réservation trouvée{filterDate ? " pour cette date" : ""}.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-[70px] z-30 transition-all">
          <div className="flex overflow-x-auto space-x-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
            {[
              { id: 'overview', label: 'Tableau de bord', icon: <TrendingUp size={18} /> },
              { id: 'profile', label: 'Mon Profil', icon: <Users size={18} /> },
              { id: 'stations', label: 'Stations & Parcours', icon: <MapPin size={18} /> },
              { id: 'reservations', label: 'Réservations', icon: <FileText size={18} /> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>{tab.icon} {tab.label}</button>
            ))}
          </div>
          <button onClick={() => setShowAdminContact(true)} className="flex items-center gap-2 px-5 py-3 bg-white text-[#e8112d] rounded-xl shadow-sm hover:shadow-md font-bold border border-red-100 hover:bg-red-50 transition-colors whitespace-nowrap">
            <HelpCircle size={18} /> Contacter Admin
          </button>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'stations' && renderStations()}
        {activeTab === 'reservations' && renderReservations()}
      </div>

      {showAdminContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowAdminContact(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#e8112d]"><HelpCircle size={32} /></div>
              <h3 className="text-2xl font-bold text-gray-900">Support Administrateur</h3>
              <p className="text-gray-500 mt-1">Besoin d'aide ou d'assistance ? Contactez l'administration directement.</p>
            </div>
            {adminInfo ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Administrateur</p>
                  <p className="font-bold text-gray-800 text-lg">{adminInfo.name}</p>
                  <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm"><MapPin size={14} /> {adminInfo.address || 'Adresse non renseignée'}</div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {adminInfo.whatsapp && (<a href={`https://wa.me/${adminInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-3 bg-[#008751] text-white rounded-xl font-bold hover:bg-[#006b40] transition-colors shadow-lg shadow-green-200"><MessageCircle size={20} /> WhatsApp</a>)}
                  <a href={`mailto:${adminInfo.email}`} className="flex items-center justify-center gap-3 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-gray-300"><Mail size={20} /> Email</a>
                  {adminInfo.phone && (<a href={`tel:${adminInfo.phone}`} className="flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"><Phone size={20} /> Appeler</a>)}
                </div>
              </div>
            ) : <div className="text-center p-4 bg-red-50 text-red-700 rounded-xl">Impossible de trouver les informations de l'administrateur.</div>}
          </div>
        </div>
      )}
    </div>
  );
};