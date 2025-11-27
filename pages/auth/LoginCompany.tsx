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
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-emerald-50 to-red-50">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 w-full max-w-md shadow-lg">
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
    );
};