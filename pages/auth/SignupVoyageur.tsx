
import React, { useState } from 'react';
import { UserRole, User } from '../../types';
import { saveUser, setCurrentUser } from '../../services/storage';
import { Eye, EyeOff, ArrowLeft, Camera, ChevronRight } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';

interface Props {
    onNavigate: (view: string) => void;
    notify: (msg: string, type: 'success' | 'error' | 'info') => void;
    setUser: (user: any) => void;
}

export const SignupVoyageur: React.FC<Props> = ({ onNavigate, notify, setUser }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ name: '', phone: '', npi: '', email: '', password: '', confirmPassword: '', avatarUrl: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return notify('Mots de passe différents.', 'error');
        if (!form.name || !form.phone || !form.npi || !form.email || !form.password) {
            return notify("Tous les champs sont obligatoires.", "error");
        }

        const newUser: User = {
            id: crypto.randomUUID(), name: form.name, email: form.email, phone: form.phone, npi: form.npi, role: UserRole.CLIENT,
            avatarUrl: form.avatarUrl || `https://ui-avatars.com/api/?name=${form.name}&background=random`,
        };
        try {
            saveUser(newUser);
            setCurrentUser(newUser);
            setUser(newUser);
            onNavigate('DASHBOARD_CLIENT');
            notify('Compte créé !', 'success');
        }
        catch (err: any) { notify("Erreur création compte.", "error"); }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024 * 5) { // 5MB limit
                notify('Fichier trop volumineux (Max 5Mo).', 'error');
                return;
            }
            try {
                const compressedBase64 = await compressImage(file);
                setForm(prev => ({ ...prev, avatarUrl: compressedBase64 }));
            } catch (error) {
                console.error("Compression error", error);
                notify("Erreur lors du traitement de l'image.", "error");
            }
        }
    };

    return (
        <div className="neu-wrapper benin-gradient-bg">
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069')] bg-cover bg-center flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 w-full max-w-lg shadow-[10px_10px_20px_rgba(0,0,0,0.2),-10px_-10px_20px_rgba(255,255,255,0.2)] border border-white/40">
                    <form className="w-full flex flex-col items-center text-center" onSubmit={handleRegister}>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Créer un Compte</h2>
                        <p className="text-gray-700 font-medium">Commencez votre voyage avec VoyageBj</p>
                        <div className="flex gap-1 mb-6">
                            {[1, 2].map(n => (<div key={n} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${n <= step ? 'bg-[#008751]' : 'bg-gray-300'}`}></div>))}
                        </div>

                        {step === 1 && (
                            <div className="animate-slide-right w-full flex flex-col items-center">
                                <label className="cursor-pointer block mb-4 w-24 h-24 rounded-full shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center overflow-hidden group bg-[#f0f4f8]">
                                    {form.avatarUrl ? <img src={form.avatarUrl} className="w-full h-full object-cover" /> : <Camera className="text-gray-400" />}
                                    <input type="file" className="hidden" onChange={handleImageUpload} />
                                </label>
                                <input className="neu-input" type="text" placeholder="Nom & Prénom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                <input className="neu-input" type="tel" placeholder="Numéro de Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                                <input className="neu-input" type="text" placeholder="NPI (Carte d'identité)" value={form.npi} onChange={(e) => setForm({ ...form, npi: e.target.value })} required />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-slide-right w-full flex flex-col items-center">
                                <input className="neu-input" type="email" placeholder="Adresse Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                                <div className="pwd-wrapper">
                                    <input className="neu-input w-full" type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="pwd-eye">{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                </div>
                                <div className="pwd-wrapper">
                                    <input className="neu-input w-full" type={showConfirmPwd ? "text" : "password"} placeholder="Confirmer mot de passe" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                                    <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="pwd-eye">{showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-6">
                            {step > 1 && (<button type="button" onClick={() => setStep(step - 1)} className="neu-button secondary"><ArrowLeft size={16} /> Retour</button>)}
                            {step < 2 ? (
                                <button type="button" onClick={() => setStep(step + 1)} className="neu-button bg-lime">Suivant <ChevronRight size={16} /></button>
                            ) : (
                                <button type="submit" className="neu-button bg-lime">S'INSCRIRE</button>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col gap-2">
                            <button type="button" onClick={() => onNavigate('LOGIN_VOYAGEUR')} className="text-sm font-bold text-[#008751] hover:underline">Déjà un compte ? Se connecter</button>
                            <button type="button" onClick={() => onNavigate('LANDING')} className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"><ArrowLeft size={12} /> Retour à l'accueil</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};