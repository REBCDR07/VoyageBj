
import React, { useState } from 'react';
import { Truck, Home, Bell, Menu, LayoutDashboard, LogOut, X, ChevronRight, User as UserIcon, Briefcase, Shield } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
    user: User | null;
    onNavigate: (view: any) => void;
    onLogout: () => void;
    onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout, onToggleSidebar }) => {
    const [visitorMenuOpen, setVisitorMenuOpen] = useState(false);

    const toggleMenu = () => {
        if (user) {
            onToggleSidebar();
        } else {
            setVisitorMenuOpen(!visitorMenuOpen);
        }
    };

    const handleNav = (view: string) => {
        onNavigate(view);
        setVisitorMenuOpen(false);
    };

    return (
        <>
            <nav className="af-navbar">
                <div className="flex items-center">
                    {/* Hamburger Button - Visible on Mobile (md breakpoint to match links visibility) */}
                    <button onClick={toggleMenu} className="p-2 mr-2 text-gray-500 hover:text-[#008751] focus:outline-none md:hidden">
                        <Menu size={24} />
                    </button>

                    {/* Brand */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onNavigate('LANDING')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#008751] to-[#006b40] text-white flex items-center justify-center rounded-lg shadow-lg">
                            <Truck size={24} />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-2xl font-dancing font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#008751] to-[#e8112d] tracking-tight leading-none">VoyageBj</h1>
                            <p className="text-[10px] text-[#008751] font-bold uppercase tracking-widest">Bénin Transport</p>
                        </div>
                    </div>
                </div>

                {/* Right Links (Desktop) */}
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('LANDING')} className="text-gray-400 hover:text-[#008751] transition-colors p-2" title="Accueil">
                        <Home size={20} />
                    </button>

                    {user ? (
                        /* User Logged In */
                        <>
                            <div className="relative group cursor-pointer p-2">
                                <div className="relative">
                                    <Bell size={20} className="text-gray-400 group-hover:text-gray-600" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e8112d] rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">3</span>
                                </div>
                            </div>

                            <div className="relative group ml-2">
                                <button className="flex items-center gap-3 focus:outline-none">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-gray-800 leading-tight">{user.companyName || user.name}</p>
                                        <p className="text-xs text-gray-500">{user.role === 'ADMIN' ? 'Administrateur' : (user.role === 'COMPANY' ? 'Partenaire' : 'Voyageur')}</p>
                                    </div>
                                    <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-[#e9b400] shadow-sm object-cover bg-gray-100" />
                                </button>

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block z-50 animate-fade-in">
                                    <div className="py-1">
                                        <button onClick={() => onNavigate(user.role === 'COMPANY' ? 'DASHBOARD_COMPANY' : (user.role === 'ADMIN' ? 'DASHBOARD_ADMIN' : 'DASHBOARD_CLIENT'))} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#008751] font-medium">
                                            <div className="flex items-center gap-2"><LayoutDashboard size={16} /> Tableau de bord</div>
                                        </button>
                                        <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-[#e8112d] hover:bg-red-50 font-medium border-t border-gray-50">
                                            <div className="flex items-center gap-2"><LogOut size={16} /> Se déconnecter</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Visitor (Desktop) */
                        <div className="flex items-center gap-3">
                            <button onClick={() => onNavigate('LOGIN_VOYAGEUR')} className="hidden md:flex text-sm font-bold text-gray-500 hover:text-[#008751]">Je voyage</button>
                            <button onClick={() => onNavigate('LOGIN_COMPANY')} className="hidden md:flex text-sm font-bold text-gray-500 hover:text-[#008751]">Je suis une compagnie</button>
                            <button onClick={() => onNavigate('LOGIN_ADMIN')} className="hidden md:flex text-sm font-bold text-gray-400 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all" title="Accès Administration">Admin</button>
                            <button onClick={() => onNavigate('LOGIN_VOYAGEUR')} className="bg-[#008751] text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#006b40] hover:shadow-lg transition-all hidden md:block">Connexion</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Drawer (Visitor Only) */}
            {!user && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 md:hidden ${visitorMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setVisitorMenuOpen(false)}
                    />

                    {/* Sliding Panel */}
                    <div className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[9999] shadow-2xl transform transition-transform duration-300 md:hidden ${visitorMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#008751] to-[#006b40] text-white flex items-center justify-center rounded-lg shadow-lg">
                                        <Truck size={24} />
                                    </div>
                                    <span className="font-extrabold text-2xl text-gray-800">VoyageBj</span>
                                </div>
                                <button onClick={() => setVisitorMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-3 flex-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Espace Membre</p>

                                <button onClick={() => handleNav('LOGIN_VOYAGEUR')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 rounded-xl group transition-colors border border-transparent hover:border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm text-gray-600 group-hover:text-[#008751]"><UserIcon size={20} /></div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-800">Je voyage</p>
                                            <p className="text-xs text-gray-500">Connexion Client</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#008751]" />
                                </button>

                                <button onClick={() => handleNav('LOGIN_COMPANY')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-yellow-50 rounded-xl group transition-colors border border-transparent hover:border-yellow-200">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm text-gray-600 group-hover:text-[#e9b400]"><Briefcase size={20} /></div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-800">Je suis une compagnie</p>
                                            <p className="text-xs text-gray-500">Espace Pro</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#e9b400]" />
                                </button>

                                <button onClick={() => handleNav('LOGIN_ADMIN')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl group transition-colors border border-transparent hover:border-gray-300">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm text-gray-600 group-hover:text-gray-900"><Shield size={20} /></div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-800">Administration</p>
                                            <p className="text-xs text-gray-500">Accès restreint</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-900" />
                                </button>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs border border-green-200">BJ</div>
                                    <div>
                                        <p className="text-xs text-gray-500">Support Client</p>
                                        <p className="font-bold text-sm text-gray-800">+229 97 00 00 00</p>
                                    </div>
                                </div>
                                <button onClick={() => handleNav('SIGNUP_VOYAGEUR')} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#008751] to-[#e9b400] text-white font-bold shadow-lg shadow-green-200 hover:shadow-xl transition-shadow">
                                    Créer un compte
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};