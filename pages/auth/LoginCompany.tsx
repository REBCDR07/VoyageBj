
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { getUsers, setCurrentUser } from '../../services/storage';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  notify: (msg: string, type: 'success'|'error'|'info') => void;
  setUser: (user: any) => void;
}

export const LoginCompany: React.FC<Props> = ({ onNavigate, notify, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const users = getUsers();
        const found = users.find(u => u.email === email && u.role === UserRole.COMPANY);
        if (found) {
             if (found.status !== 'APPROVED') return notify(`Compte ${found.status === 'PENDING' ? 'en attente' : 'refusé'}.`, 'error');
            setCurrentUser(found); 
            setUser(found); 
            onNavigate('DASHBOARD_COMPANY'); 
            notify(`Bienvenue ${found.companyName} !`, 'success');
        } else notify("Identifiants incorrects.", 'error');
    };

    return (
        <div className="neu-wrapper benin-gradient-bg">
            <div className="neu-main animate-fade-in flex items-center justify-center">
                 <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-10 w-full max-w-md shadow-[10px_10px_20px_rgba(0,0,0,0.2),-10px_-10px_20px_rgba(255,255,255,0.2)] border border-white/40">
                    <form className="w-full flex flex-col items-center text-center" onSubmit={handleLogin}>
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-2 font-heading">Espace Pro</h2>
                        <p className="text-gray-600 mb-8 text-sm font-medium">Gérez votre flotte et vos trajets</p>
                        
                        <input className="neu-input" type="email" placeholder="Email Professionnel" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        
                        <div className="pwd-wrapper">
                            <input className="neu-input w-full" type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="button" onClick={() => setShowPwd(!showPwd)} className="pwd-eye">{showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                        </div>
                        
                        <button type="submit" className="neu-button bg-yellow mt-8">SE CONNECTER</button>
                        
                        <div className="mt-6 flex flex-col gap-2">
                             <button type="button" onClick={() => onNavigate('SIGNUP_COMPANY')} className="text-sm font-bold text-[#e9b400] hover:underline">Devenir Partenaire</button>
                             <button type="button" onClick={() => onNavigate('LANDING')} className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"><ArrowLeft size={12} /> Retour à l'accueil</button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
};