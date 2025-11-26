
import React, { useState } from 'react';
import { UserRole, User } from '../../types';
import { saveUser, setCurrentUser } from '../../services/storage';
import { Eye, EyeOff, ArrowLeft, ChevronRight, Upload, FileText, Check } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';

interface Props {
    onNavigate: (view: string) => void;
    notify: (msg: string, type: 'success' | 'error' | 'info') => void;
    setUser: (user: any) => void;
}

export const SignupCompany: React.FC<Props> = ({ onNavigate, notify, setUser }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '', phone: '', npi: '', email: '', password: '', confirmPassword: '',
        companyName: '', ifu: '', rccm: '', avatarUrl: '', bannerUrl: '',
        anattUrl: '', otherDocsUrl: ''
    });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return notify('Mots de passe différents.', 'error');

        // Validation basique
        if (!form.companyName || !form.name || !form.phone || !form.npi || !form.ifu || !form.rccm || !form.email || !form.password) {
            return notify("Tous les champs sont obligatoires.", "error");
        }
        if (!form.anattUrl) return notify("L'attestation ANaTT est obligatoire.", "error");

        // Images are already compressed on upload, so we just check if they exist if we want them mandatory
        // But the user said "allow at least 5mo", implying size check.
        // We already checked size at upload.
        // Let's ensure avatar/banner are present if desired, or keep them optional with defaults.
        // User said "Tous les champs doivent être obligatoire", so let's make them mandatory?
        // Usually avatar/banner are optional but let's check if the user meant ALL fields.
        // "Tous les champs doivent être obligatoire lors des inscriptions" -> implies inputs.
        // I will make avatar/banner optional but defaults are provided.
        // I will stick to the form inputs being mandatory.

        const newUser: User = {
            id: crypto.randomUUID(), name: form.name, companyName: form.companyName, email: form.email, phone: form.phone, npi: form.npi, role: UserRole.COMPANY,
            avatarUrl: form.avatarUrl || `https://ui-avatars.com/api/?name=${form.companyName}&background=random`,
            bannerUrl: form.bannerUrl || `https://picsum.photos/seed/${form.companyName}/800/300`,
            ifu: form.ifu, rccm: form.rccm,
            anattUrl: form.anattUrl,
            otherDocsUrl: form.otherDocsUrl,
            status: 'PENDING'
        };
        try {
            saveUser(newUser);
            notify("Demande envoyée ! En attente de validation par l'admin.", 'success');
            setCurrentUser(null);
            setUser(null);
            onNavigate('LANDING');
        }
        catch (err: any) { notify("Erreur inscription.", "error"); }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'bannerUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024 * 5) { // 5MB limit
                notify('Fichier trop volumineux (Max 5Mo).', 'error');
                return;
            }
            try {
                const compressedBase64 = await compressImage(file);
                setForm(prev => ({ ...prev, [field]: compressedBase64 }));
            } catch (error) {
                console.error("Compression error", error);
                notify("Erreur lors du traitement de l'image.", "error");
            }
        }
    };

    // Upload de document - conversion en base64 pour stockage local
    const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'anattUrl' | 'otherDocsUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024 * 2) { // 2MB limit
                notify('Fichier trop volumineux (Max 2MB).', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, [field]: reader.result as string }));
                notify(`Document "${file.name}" ajouté.`, 'info');
            };
            reader.onerror = () => {
                notify('Erreur lors du chargement du fichier.', 'error');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="neu-wrapper benin-gradient-bg">
            <div className="neu-main animate-fade-in flex items-center justify-center">
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 w-full max-w-lg shadow-[10px_10px_20px_rgba(0,0,0,0.2),-10px_-10px_20px_rgba(255,255,255,0.2)] border border-white/40">
                    <form className="w-full flex flex-col items-center text-center" onSubmit={handleRegister}>
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-2 font-heading">Nouveau Partenaire</h2>
                        <div className="flex gap-1 mb-6">
                            {[1, 2, 3, 4].map(n => (<div key={n} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${n <= step ? 'bg-[#e9b400]' : 'bg-gray-300'}`}></div>))}
                        </div>

                        {step === 1 && (
                            <div className="animate-slide-right w-full flex flex-col items-center">
                                <h3 className="text-lg font-bold text-gray-600 mb-4">Identité Visuelle</h3>
                                <div className="flex gap-4 mb-4">
                                    <label className="cursor-pointer w-20 h-20 rounded-xl shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] flex items-center justify-center overflow-hidden bg-[#f0f4f8] hover:bg-gray-200 transition-colors">
                                        {form.avatarUrl ? <img src={form.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400 font-bold">Logo</span>}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatarUrl')} />
                                    </label>
                                    <label className="cursor-pointer w-40 h-20 rounded-xl shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] flex items-center justify-center overflow-hidden bg-[#f0f4f8] hover:bg-gray-200 transition-colors">
                                        {form.bannerUrl ? <img src={form.bannerUrl} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400 font-bold">Bannière</span>}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'bannerUrl')} />
                                    </label>
                                </div>
                                <input className="neu-input" type="text" placeholder="Nom de la Compagnie" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
                                <input className="neu-input" type="text" placeholder="Nom du Gérant" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-slide-right w-full flex flex-col items-center">
                                <h3 className="text-lg font-bold text-gray-600 mb-4">Légal & Contact</h3>
                                <input className="neu-input" type="tel" placeholder="Téléphone Pro" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                                <input className="neu-input" type="text" placeholder="NPI Gérant" value={form.npi} onChange={(e) => setForm({ ...form, npi: e.target.value })} required />
                                <input className="neu-input" type="text" placeholder="Numéro IFU" value={form.ifu} onChange={(e) => setForm({ ...form, ifu: e.target.value })} required />
                                <input className="neu-input" type="text" placeholder="Numéro RCCM" value={form.rccm} onChange={(e) => setForm({ ...form, rccm: e.target.value })} required />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-slide-right w-full flex flex-col items-center">
                                <h3 className="text-lg font-bold text-gray-600 mb-4">Accès & Sécurité</h3>
                                <input className="neu-input" type="email" placeholder="Email Professionnel" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
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

                        {step === 4 && (
                            <div className="animate-slide-right w-full flex flex-col items-center">
                                <h3 className="text-lg font-bold text-gray-600 mb-2">Documents Requis</h3>
                                <p className="text-xs text-gray-500 mb-6 max-w-xs">Veuillez télécharger les versions PDF ou Image de vos documents officiels.</p>

                                <div className="w-full max-w-sm space-y-4">
                                    {/* ANaTT Upload */}
                                    <div className="relative">
                                        <label className={`block w-full p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center gap-3 ${form.anattUrl ? 'border-[#008751] bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}>
                                            <div className={`p-2 rounded-full ${form.anattUrl ? 'bg-[#008751] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                {form.anattUrl ? <Check size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div className="text-left flex-1 overflow-hidden">
                                                <p className="font-bold text-sm text-gray-800">Attestation ANaTT *</p>
                                                <p className="text-xs text-gray-500 truncate">{form.anattUrl || "Cliquer pour télécharger"}</p>
                                            </div>
                                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocUpload(e, 'anattUrl')} />
                                        </label>
                                    </div>

                                    {/* Other Docs Upload */}
                                    <div className="relative">
                                        <label className={`block w-full p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center gap-3 ${form.otherDocsUrl ? 'border-[#e9b400] bg-yellow-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}>
                                            <div className={`p-2 rounded-full ${form.otherDocsUrl ? 'bg-[#e9b400] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                {form.otherDocsUrl ? <Check size={20} /> : <Upload size={20} />}
                                            </div>
                                            <div className="text-left flex-1 overflow-hidden">
                                                <p className="font-bold text-sm text-gray-800">Autres Pièces (Optionnel)</p>
                                                <p className="text-xs text-gray-500 truncate">{form.otherDocsUrl || "Statuts, Registre..."}</p>
                                            </div>
                                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocUpload(e, 'otherDocsUrl')} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-8 w-full justify-center">
                            {step > 1 && (<button type="button" onClick={() => setStep(step - 1)} className="neu-button secondary w-auto px-6"><ArrowLeft size={16} /> Retour</button>)}
                            {step < 4 ? (
                                <button type="button" onClick={() => setStep(step + 1)} className="neu-button bg-yellow w-auto px-8">Suivant <ChevronRight size={16} /></button>
                            ) : (
                                <button type="submit" className="neu-button bg-lime w-auto px-8 shadow-lg shadow-green-200/50">SOUMETTRE</button>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col gap-2">
                            <button type="button" onClick={() => onNavigate('LOGIN_COMPANY')} className="text-sm font-bold text-[#e9b400] hover:underline">Déjà partenaire ? Connexion</button>
                            <button type="button" onClick={() => onNavigate('LANDING')} className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"><ArrowLeft size={12} /> Retour à l'accueil</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};