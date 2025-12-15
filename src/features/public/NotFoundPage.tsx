import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { ViewState } from '../../shared/types';

interface Props {
    onNavigate: (view: ViewState) => void;
}

export const NotFoundPage: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-[#e8112d] mb-6 animate-bounce">
                <AlertTriangle size={48} />
            </div>

            <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Page introuvable</h2>

            <p className="text-gray-500 max-w-md mb-8">
                Oups ! La page que vous recherchez semble avoir pris le bus sans vous. Elle n'existe pas ou a été déplacée.
            </p>

            <button
                onClick={() => onNavigate('LANDING')}
                className="bg-[#008751] hover:bg-[#006b40] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 group"
            >
                <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
                Retour à l'accueil
            </button>
        </div>
    );
};
