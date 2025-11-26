
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { getUsers, saveUser, setCurrentUser } from '../../services/storage';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
    onNavigate: (view: string) => void;
    notify: (msg: string, type: 'success' | 'error' | 'info') => void;
    setUser: (user: any) => void;
}

export const LoginVoyageur: React.FC<Props> = ({ onNavigate, notify, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const users = getUsers();
        const found = users.find(u => u.email === email && u.role === UserRole.CLIENT);
        if (found) {
            setCurrentUser(found);
            setUser(found);
            onNavigate('DASHBOARD_CLIENT');
            notify(`Bienvenue ${found.name} !`, 'success');
        } else notify("Identifiants incorrects.", 'error');
    };

    return (
        <div className="neu-wrapper benin-gradient-bg">
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069')] bg-cover bg-center flex items-center justify-center p-4 relative">
                <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-10 w-full max-w-md shadow-[10px_10px_20px_rgba(0,0,0,0.2),-10px_-10px_20px_rgba(255,255,255,0.2)] border border-white/40">
                    <form className="w-full flex flex-col items-center text-center" onSubmit={handleLogin}>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Connexion Voyageur</h2>
                        <p className="text-gray-700 font-medium mb-8 text-sm">Accédez à votre espace personnel</p>

                        <input className="neu-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <div className="pwd-wrapper">
                            <input className="neu-input w-full" type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="button" onClick={() => setShowPwd(!showPwd)} className="pwd-eye">{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        </div>

                        <button type="submit" className="neu-button bg-lime mt-8">SE CONNECTER</button>

                        <div className="mt-6 flex flex-col gap-2">
                            <button type="button" onClick={() => onNavigate('SIGNUP_VOYAGEUR')} className="text-sm font-bold text-[#008751] hover:underline">Pas encore de compte ? Créer un compte</button>
                            <button type="button" onClick={() => onNavigate('LANDING')} className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"><ArrowLeft size={12} /> Retour à l'accueil</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};