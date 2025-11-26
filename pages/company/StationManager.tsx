
import React, { useState, useEffect } from 'react';
import { Station, MOCK_DAYS } from '../../types';
import { saveStation, getStations } from '../../services/storage';
import { generateLocalDescription } from '../../services/description';
import { Save, ImageIcon, Camera, Sparkles } from 'lucide-react';

interface Props {
    user: any;
    notify: (msg: string, type: 'success' | 'error' | 'info') => void;
    onClose: () => void;
    editId?: string | null;
}

export const StationManager: React.FC<Props> = ({ user, notify, onClose, editId }) => {
    const [station, setStation] = useState<Partial<Station>>({ type: 'STATION' });
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    useEffect(() => {
        if (editId) {
            const all = getStations();
            const found = all.find(s => s.id === editId);
            if (found) setStation(found);
        }
    }, [editId]);

    const handleSaveStation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!station.name || !station.pointA || !station.pointB) {
            notify("Veuillez remplir les champs obligatoires", "error");
            return;
        }

        const newStation: Station = {
            id: station.id || crypto.randomUUID(),
            companyId: user.id,
            companyName: user.companyName || 'Agence',
            type: station.type || 'STATION',
            name: station.name,
            photoUrl: station.photoUrl || `https://picsum.photos/seed/${Math.random()}/400/300`,
            location: station.location || '',
            description: station.description || '',
            pointA: station.pointA,
            pointB: station.pointB,
            departurePoint: station.departurePoint || '',
            workDays: station.workDays || [],
            departureHours: station.departureHours || [],
            arrivalHours: station.arrivalHours || [],
            price: Number(station.price) || 0,
            pricePremium: Number(station.pricePremium) || 0
        };

        try {
            saveStation(newStation);
            notify(station.id ? "Modification enregistrée" : "Station créée avec succès", "success");
            onClose();
        } catch (err: any) {
            notify("Erreur sauvegarde: " + err.message, "error");
        }
    };

    const handleGenerateDescription = () => {
        setIsGeneratingDesc(true);
        setTimeout(() => {
            const desc = generateLocalDescription({ ...station, companyName: user.companyName });
            setStation(prev => ({ ...prev, description: desc }));
            setIsGeneratingDesc(false);
            notify("Description générée avec succès !", "success");
        }, 600);
    };

    const handleStationImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 700) {
                notify("Fichier trop volumineux (Max 700Ko).", "error");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setStation(prev => ({ ...prev, photoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Input style class for clearer inputs: White background, visible border
    const inputClass = "w-full rounded-lg border border-gray-300 bg-white p-3 focus:ring-2 focus:ring-[#008751] focus:border-transparent outline-none transition-shadow shadow-sm text-gray-800 placeholder-gray-400";

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">{station.id ? 'Modifier Station / Trajet' : 'Créer Station / Trajet'}</h2>
                <p className="text-gray-500">Configurez les détails de votre point de départ et les horaires.</p>
            </div>

            <form onSubmit={handleSaveStation} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Type de service</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                            <button type="button" onClick={() => setStation({ ...station, type: 'STATION' })} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${station.type === 'STATION' ? 'bg-white shadow text-[#008751]' : 'text-gray-500'}`}>Sous-Station</button>
                            <button type="button" onClick={() => setStation({ ...station, type: 'ROUTE' })} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${station.type === 'ROUTE' ? 'bg-white shadow text-[#e9b400]' : 'text-gray-500'}`}>Parcours Direct</button>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Photo de la Station</label>
                        <div className="flex items-center gap-4 p-3 border border-gray-300 rounded-lg bg-gray-50">
                            {station.photoUrl ? <img src={station.photoUrl} className="w-16 h-16 object-cover rounded-md shadow-sm border border-gray-200" /> : <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center text-gray-400 border border-gray-200"><ImageIcon size={24} /></div>}
                            <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2">
                                <Camera size={18} /> Choisir une photo
                                <input type="file" accept="image/*" className="hidden" onChange={handleStationImageUpload} />
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1">Nom (ex: Gare de Cotonou)</label><input type="text" required className={inputClass} value={station.name || ''} onChange={e => setStation({ ...station, name: e.target.value })} /></div>

                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Ville / Localisation</label><input type="text" required className={inputClass} value={station.location || ''} onChange={e => setStation({ ...station, location: e.target.value })} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Prix Standard (FCFA)</label><input type="number" required className={inputClass} value={station.price || ''} onChange={e => setStation({ ...station, price: Number(e.target.value) })} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Prix Premium (FCFA)</label><input type="number" className={inputClass} value={station.pricePremium || ''} onChange={e => setStation({ ...station, pricePremium: Number(e.target.value) })} placeholder="Optionnel" /></div>

                    <div className="p-4 bg-yellow-50 rounded-xl md:col-span-2 border border-yellow-100">
                        <h4 className="font-bold text-yellow-800 mb-3 text-sm uppercase">Détails du Trajet</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-yellow-700 mb-1">Point de Départ (A)</label>
                                <input type="text" required className="w-full rounded-lg border-yellow-200 bg-white border p-2.5 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-800" value={station.pointA || ''} onChange={e => setStation({ ...station, pointA: e.target.value })} list="cities_list" placeholder="Ex: Cotonou" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-yellow-700 mb-1">Point d'Arrivée (B)</label>
                                <input type="text" required className="w-full rounded-lg border-yellow-200 bg-white border p-2.5 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-800" value={station.pointB || ''} onChange={e => setStation({ ...station, pointB: e.target.value })} list="cities_list" placeholder="Ex: Parakou" />
                            </div>
                        </div>
                        <datalist id="cities_list">
                            <option value="Cotonou" />
                            <option value="Porto-Novo" />
                            <option value="Parakou" />
                            <option value="Abomey-Calavi" />
                            <option value="Bohicon" />
                            <option value="Natitingou" />
                            <option value="Djougou" />
                            <option value="Kandi" />
                            <option value="Malanville" />
                            <option value="Ouidah" />
                            <option value="Abomey" />
                            <option value="Lokossa" />
                            <option value="Dassa-Zoumè" />
                            <option value="Savalou" />
                        </datalist>
                    </div>

                    <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">Jours de Disponibilité</label><div className="flex flex-wrap gap-2">{MOCK_DAYS.map(day => (<button key={day} type="button" onClick={() => { const days = station.workDays || []; const newDays = days.includes(day) ? days.filter(d => d !== day) : [...days, day]; setStation({ ...station, workDays: newDays }); }} className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border ${station.workDays?.includes(day) ? 'bg-[#008751] text-white border-[#008751] shadow-md scale-105' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>{day.substring(0, 3)}</button>))}</div></div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Heures de Départ</label>
                        <input type="text" placeholder="Ex: 07:00, 14:00" className={inputClass} value={station.departureHours?.join(', ') || ''} onChange={e => setStation({ ...station, departureHours: e.target.value.split(',').map(s => s.trim()) })} />
                        <p className="text-xs text-gray-400 mt-1">Format 24h, séparées par des virgules.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Heures d'Arrivée (Estimées)</label>
                        <input type="text" placeholder="Ex: 12:00, 19:00" className={inputClass} value={station.arrivalHours?.join(', ') || ''} onChange={e => setStation({ ...station, arrivalHours: e.target.value.split(',').map(s => s.trim()) })} />
                        <p className="text-xs text-gray-400 mt-1">Correspondant à l'ordre des départs.</p>
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-sm font-bold text-gray-700">Description Marketing</label>
                            <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc || !station.pointA || !station.pointB} className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100 disabled:opacity-50 flex items-center gap-1.5 font-bold transition-colors border border-purple-100">
                                <Sparkles size={14} /> {isGeneratingDesc ? 'Génération...' : 'Générer Description IA'}
                            </button>
                        </div>
                        <textarea className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none h-24 resize-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-gray-800" value={station.description || ''} onChange={e => setStation({ ...station, description: e.target.value })} placeholder="Description du trajet, niveau de confort, services à bord..." />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                    <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors border border-gray-200 bg-white">Annuler</button>
                    <button type="submit" className="px-8 py-3 rounded-lg bg-[#008751] text-white hover:bg-[#006b40] font-bold flex items-center gap-2 shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1"><Save size={20} /> Enregistrer</button>
                </div>
            </form>
        </div>
    );
};
