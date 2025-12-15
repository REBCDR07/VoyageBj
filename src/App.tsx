
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { Toaster } from './shared/components/ui/Toaster';
import { toast } from 'sonner';
import { Navbar } from './shared/components/Navbar';
import { Footer } from './shared/components/Footer';
import { User, ViewState, UserRole } from './shared/types';
import { getCurrentUser, setCurrentUser as setStorageUser } from './shared/services/storage';

// Lazy loading pages
const LandingPage = React.lazy(() => import('./features/public/LandingPage').then(module => ({ default: module.LandingPage })));
const SearchResultsPage = React.lazy(() => import('./features/public/SearchResultsPage').then(module => ({ default: module.SearchResultsPage })));
const LoginVoyageur = React.lazy(() => import('./features/auth/LoginVoyageur').then(module => ({ default: module.LoginVoyageur })));
const SignupVoyageur = React.lazy(() => import('./features/auth/SignupVoyageur').then(module => ({ default: module.SignupVoyageur })));
const LoginCompany = React.lazy(() => import('./features/auth/LoginCompany').then(module => ({ default: module.LoginCompany })));
const SignupCompany = React.lazy(() => import('./features/auth/SignupCompany').then(module => ({ default: module.SignupCompany })));
const LoginAdmin = React.lazy(() => import('./features/auth/LoginAdmin').then(module => ({ default: module.LoginAdmin })));
const AdminDashboard = React.lazy(() => import('./features/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const CompanyDashboard = React.lazy(() => import('./features/company/CompanyDashboard').then(module => ({ default: module.CompanyDashboard })));
const ClientDashboard = React.lazy(() => import('./features/client/ClientDashboard').then(module => ({ default: module.ClientDashboard })));
const StationManager = React.lazy(() => import('./features/company/StationManager').then(module => ({ default: module.StationManager })));
const CompaniesListPage = React.lazy(() => import('./features/public/CompaniesListPage').then(module => ({ default: module.CompaniesListPage })));
const CompanyDetailsPage = React.lazy(() => import('./features/public/CompanyDetailsPage').then(module => ({ default: module.CompanyDetailsPage })));
const CompaniesPage = React.lazy(() => import('./features/public/CompaniesPage').then(module => ({ default: module.CompaniesPage })));
const NotFoundPage = React.lazy(() => import('./features/public/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

export type NotifyFunc = (msg: string, type: 'success' | 'error' | 'info' | 'warning' | 'danger') => void;

// Simple loading fallback
const PageLoader = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#008751] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-gray-400 font-medium animate-pulse">Chargement...</div>
    </div>
);

// Wrapper for CompanyDetails to extract ID from params
const CompanyDetailsWrapper = ({ onNavigate, user }: { onNavigate: any, user: any }) => {
    const { id } = useParams();
    return <CompanyDetailsPage onNavigate={onNavigate} companyId={id || ''} user={user} />;
};

// Wrapper for StationManager to extract props from location state
const StationManagerWrapper = ({ user, notify, onNavigate }: { user: any, notify: any, onNavigate: any }) => {
    const location = useLocation();
    const state = location.state as { editId?: string, initialType?: 'STATION' | 'ROUTE', parentId?: string } | null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <StationManager
                user={user}
                notify={notify}
                onClose={() => onNavigate('DASHBOARD_COMPANY')}
                editId={state?.editId || null}
                initialType={state?.initialType || 'STATION'}
                parentId={state?.parentId}
            />
        </div>
    );
};

const AppContent = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true); // New loading state
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const stored = getCurrentUser();
        if (stored) {
            setUser(stored);
        }
        setIsAuthChecking(false); // Auth check complete
    }, []);

    const notify: NotifyFunc = (msg, type) => {
        switch (type) {
            case 'success': toast.success(msg); break;
            case 'error': toast.error(msg); break;
            case 'info': toast.info(msg); break;
            case 'warning': toast.warning(msg); break;
            case 'danger': toast.error(msg); break;
            default: toast(msg);
        }
    };

    const handleLogout = () => {
        setStorageUser(null);
        setUser(null);
        navigate('/');
        notify("Déconnexion réussie", "info");
    };

    // Backward compatibility wrapper for onNavigate
    const handleNavigate = (view: ViewState, params?: any) => {
        window.scrollTo(0, 0);
        switch (view) {
            case 'LANDING': navigate('/'); break;
            case 'LOGIN_VOYAGEUR': navigate('/login/voyageur'); break;
            case 'SIGNUP_VOYAGEUR': navigate('/signup/voyageur'); break;
            case 'LOGIN_COMPANY': navigate('/login/company'); break;
            case 'SIGNUP_COMPANY': navigate('/signup/company'); break;
            case 'LOGIN_ADMIN': navigate('/login/admin'); break;
            case 'DASHBOARD_ADMIN': navigate('/admin/dashboard'); break;
            case 'DASHBOARD_COMPANY': navigate('/company/dashboard'); break;
            case 'DASHBOARD_CLIENT': navigate('/client/dashboard', { state: params }); break;
            case 'COMPANIES_LIST': navigate('/companies'); break;
            case 'COMPANIES': navigate('/companies-all'); break; // Assuming CompaniesPage is different
            case 'COMPANY_DETAILS': navigate(`/company/${params?.companyId}`); break;
            case 'SEARCH_RESULTS': navigate('/search', { state: params }); break;
            case 'STATION_MANAGER': navigate('/company/stations', { state: params }); break;
            default: console.warn('Unknown view:', view);
        }
    };

    // Special handling for SearchResults to get params from state
    const SearchResultsWrapper = () => {
        const loc = useLocation();
        return <SearchResultsPage onNavigate={handleNavigate} searchParams={loc.state} user={user} />;
    };

    if (isAuthChecking) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
            <Toaster position="top-right" />
            <Navbar user={user} onNavigate={handleNavigate} onLogout={handleLogout} />

            <main className="flex-grow pt-16 md:pt-20">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<LandingPage onNavigate={handleNavigate} user={user} />} />
                        <Route path="/companies" element={<CompaniesListPage onNavigate={handleNavigate} />} />
                        <Route path="/companies-all" element={<CompaniesPage onNavigate={handleNavigate} />} />
                        <Route path="/company/:id" element={<CompanyDetailsWrapper onNavigate={handleNavigate} user={user} />} />
                        <Route path="/search" element={<SearchResultsWrapper />} />

                        <Route path="/login/voyageur" element={<LoginVoyageur onNavigate={handleNavigate} notify={notify} setUser={setUser} />} />
                        <Route path="/signup/voyageur" element={<SignupVoyageur onNavigate={handleNavigate} notify={notify} setUser={setUser} />} />
                        <Route path="/login/company" element={<LoginCompany onNavigate={handleNavigate} notify={notify} setUser={setUser} />} />
                        <Route path="/signup/company" element={<SignupCompany onNavigate={handleNavigate} notify={notify} setUser={setUser} />} />
                        <Route path="/login/admin" element={<LoginAdmin onNavigate={handleNavigate} notify={notify} setUser={setUser} />} />

                        <Route path="/admin/dashboard" element={
                            user?.role === UserRole.ADMIN ?
                                <AdminDashboard user={user} notify={notify} onNavigate={handleNavigate} /> :
                                <Navigate to="/login/admin" />
                        } />

                        <Route path="/company/dashboard" element={
                            user?.role === UserRole.COMPANY ?
                                <CompanyDashboard
                                    user={user}
                                    notify={notify}
                                    onNavigate={handleNavigate}
                                    setEditStationId={(id: string | null) => handleNavigate('STATION_MANAGER', { editId: id, initialType: 'STATION' })}
                                    setStationManagerProps={(props: any) => handleNavigate('STATION_MANAGER', props)}
                                /> :
                                <Navigate to="/login/company" />
                        } />

                        <Route path="/client/dashboard" element={
                            user?.role === UserRole.CLIENT ?
                                <ClientDashboard user={user} notify={notify} onNavigate={handleNavigate} /> :
                                <Navigate to="/login/voyageur" />
                        } />

                        <Route path="/company/stations" element={
                            user?.role === UserRole.COMPANY ?
                                <StationManagerWrapper user={user} notify={notify} onNavigate={handleNavigate} /> :
                                <Navigate to="/login/company" />
                        } />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFoundPage onNavigate={handleNavigate} />} />
                    </Routes>
                </Suspense>
            </main>

            {location.pathname === '/' && <Footer onNavigate={handleNavigate} />}
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;