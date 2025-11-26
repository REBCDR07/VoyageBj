import React, { useState, useEffect } from 'react';
import { User, UserRole, ViewState } from './types';
import { getCurrentUser, setCurrentUser, getUsers } from './services/storage';
import { CompanyDashboard } from './pages/dashboards/CompanyDashboard';
import { ClientDashboard } from './pages/dashboards/ClientDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { LandingPage } from './pages/LandingPage';
import { LoginVoyageur } from './pages/auth/LoginVoyageur';
import { SignupVoyageur } from './pages/auth/SignupVoyageur';
import { LoginCompany } from './pages/auth/LoginCompany';
import { SignupCompany } from './pages/auth/SignupCompany';
import { LoginAdmin } from './pages/auth/LoginAdmin';
import { StationManager } from './pages/company/StationManager';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NotificationSystem, NotificationItem, NotificationVariant, NotificationSender } from './components/NotificationSystem';

export type NotifyType = 'success' | 'error' | 'info';
export type NotifyFunc = (message: string, type: NotifyType) => void;

// --- Splash Screen ---
const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    useEffect(() => { const timer = setTimeout(onComplete, 2000); return () => clearTimeout(timer); }, [onComplete]);
    return (
        <div className="fixed inset-0 z-[20000] bg-white flex items-center justify-center animate-fade-in">
            <div className="text-center animate-slide-up">
                <h1 className="font-dancing text-6xl md:text-8xl benin-gradient-text drop-shadow-md flex items-center justify-center gap-2">
                    <span className="animate-slide-right inline-block">Voyage</span>
                    <span className="animate-slide-left inline-block">Bj</span>
                </h1>
                <p className="mt-4 text-gray-400 font-medium tracking-widest uppercase text-xs">Le transport réinventé</p>
                <div className="mt-6 flex justify-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#008751] animate-bounce"></div>
                    <div className="w-3 h-3 rounded-full bg-[#e9b400] animate-bounce delay-100"></div>
                    <div className="w-3 h-3 rounded-full bg-[#e8112d] animate-bounce delay-200"></div>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<ViewState>('LANDING');
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [editStationId, setEditStationId] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState<{ departure: string, arrival: string, date: string } | null>(null);

    const addNotification = (message: string, type: NotifyType | 'warning' | 'danger' | 'message', title?: string, sender?: NotificationSender) => {
        const id = Date.now();
        const variant = type === 'error' ? 'danger' : type as NotificationVariant;

        const newNotification: NotificationItem = {
            id,
            variant,
            message,
            title: title || (variant.charAt(0).toUpperCase() + variant.slice(1)),
            sender
        };

        setNotifications(prev => {
            const updated = [...prev, newNotification];
            if (updated.length > 20) updated.shift();
            return updated;
        });

        try {
            const audio = new Audio('https://res.cloudinary.com/ds8pgw1pf/video/upload/v1728571480/penguinui/component-assets/sounds/ding.mp3');
            audio.play().catch(e => console.error("Audio play failed", e));
        } catch (e) {
            console.error("Audio init failed", e);
        }
    };

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const showToast: NotifyFunc = (message, type) => addNotification(message, type);

    useEffect(() => {
        const storedUser = getCurrentUser();
        if (storedUser) {
            const freshUser = getUsers().find(u => u.id === storedUser.id);
            if (freshUser) {
                if (freshUser.role === UserRole.COMPANY && freshUser.status !== 'APPROVED') { handleLogout(); return; }
                setUser(freshUser);
                if (currentView === 'LANDING') {
                    if (freshUser.role === UserRole.ADMIN) setCurrentView('DASHBOARD_ADMIN');
                    else if (freshUser.role === UserRole.COMPANY) setCurrentView('DASHBOARD_COMPANY');
                    else setCurrentView('DASHBOARD_CLIENT');
                }
            } else { handleLogout(); }
        }
    }, []);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentUser(loggedInUser);
        showToast('Connexion réussie !', 'success');
        if (loggedInUser.role === UserRole.ADMIN) setCurrentView('DASHBOARD_ADMIN');
        else if (loggedInUser.role === UserRole.COMPANY) setCurrentView('DASHBOARD_COMPANY');
        else setCurrentView('DASHBOARD_CLIENT');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setUser(null);
        setCurrentView('LANDING');
        showToast('Déconnexion réussie.', 'info');
    };

    const handleNavigate = (page: string, params?: any) => {
        if (params) {
            setSearchParams(params);
        }
        setCurrentView(page as ViewState);
    };

    const isDashboardView = ['DASHBOARD_CLIENT', 'DASHBOARD_COMPANY', 'DASHBOARD_ADMIN', 'STATION_MANAGER', 'ADMIN_PROFILE', 'ADMIN_VALIDATIONS', 'COMPANY_PROFILE', 'CLIENT_PROFILE'].includes(currentView);

    const renderContent = () => {
        if (appLoading) return <SplashScreen onComplete={() => setAppLoading(false)} />;

        if (!user) {
            switch (currentView) {
                case 'LANDING':
                    return <LandingPage onNavigate={handleNavigate} user={user} />;
                case 'LOGIN_VOYAGEUR':
                    return <LoginVoyageur onNavigate={handleNavigate} notify={showToast} setUser={handleLogin} />;
                case 'SIGNUP_VOYAGEUR':
                    return <SignupVoyageur onNavigate={handleNavigate} notify={showToast} setUser={handleLogin} />;
                case 'LOGIN_COMPANY':
                    return <LoginCompany onNavigate={handleNavigate} notify={showToast} setUser={handleLogin} />;
                case 'SIGNUP_COMPANY':
                    return <SignupCompany onNavigate={handleNavigate} notify={showToast} setUser={handleLogin} />;
                case 'LOGIN_ADMIN':
                    return <LoginAdmin onNavigate={handleNavigate} notify={showToast} setUser={handleLogin} />;
                case 'SEARCH_RESULTS':
                    return <SearchResultsPage onNavigate={handleNavigate} searchParams={searchParams} />;
                case 'COMPANIES':
                    return <CompaniesPage onNavigate={handleNavigate} />;
                default:
                    return <LandingPage onNavigate={handleNavigate} user={user} />;
            }
        }

        if (user.role === 'ADMIN') {
            return <AdminDashboard user={user} notify={showToast} initialTab={currentView === 'ADMIN_PROFILE' ? 'profile' : 'dashboard'} initialFilter={currentView === 'ADMIN_VALIDATIONS' ? 'PENDING' : undefined} />;
        }

        if (user.role === 'COMPANY') {
            if (currentView === 'STATION_MANAGER') {
                return (
                    <div className="p-8 flex items-center justify-center min-h-[80vh]">
                        <StationManager
                            user={user}
                            notify={showToast}
                            onClose={() => setCurrentView('DASHBOARD_COMPANY')}
                            editId={editStationId}
                        />
                    </div>
                );
            }
            return <CompanyDashboard user={user} notify={showToast} onNavigate={setCurrentView} setEditStationId={setEditStationId} initialTab={currentView === 'COMPANY_PROFILE' ? 'profile' : 'dashboard'} />;
        }

        if (user.role === 'CLIENT') {
            return <ClientDashboard user={user} notify={showToast} initialTab={currentView === 'CLIENT_PROFILE' ? 'profile' : 'dashboard'} />;
        }

        return <div>Role non reconnu</div>;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} onNavigate={handleNavigate} onLogout={handleLogout} onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

            {user && isDashboardView && <Sidebar user={user} onNavigate={setCurrentView} onLogout={handleLogout} mobileOpen={mobileSidebarOpen} />}

            <main className={`af-content ${user && isDashboardView ? 'with-sidebar' : ''}`} onClick={() => setMobileSidebarOpen(false)}>
                <NotificationSystem notifications={notifications} removeNotification={removeNotification} />
                {renderContent()}
            </main>
        </div>
    );
};

export default App;