import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, ShieldCheck, Users, ArrowRight, Clock, Map, Star, CheckCircle,
  Briefcase, Search, MapPin, Calendar, CreditCard, Ticket, Globe,
  AlertTriangle, TrendingUp, Server, Cloud, Smartphone, Mail, Facebook, Twitter, Linkedin, Instagram,
  ChevronRight, Play, Zap, Award, Heart, Bus, MessageCircle, Download, BarChart
} from 'lucide-react';
import { User, Station, ViewState } from '../../shared/types';
import { getStations, getUsers } from '../../shared/services/storage';

interface Props {
  onNavigate: (page: ViewState, params?: any) => void;
  user: User | null;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
];

const PARTNERS = [
  "Baobab Express", "ATT Transport", "La Poste", "STM", "Rana Transport", "Confort Lines"
];

export const LandingPage: React.FC<Props> = ({ onNavigate, user }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popularRoutes, setPopularRoutes] = useState<Station[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [workflowType, setWorkflowType] = useState<'VOYAGEUR' | 'COMPANY'>('VOYAGEUR');

  // Compteurs d'animation
  const [stats, setStats] = useState({
    partners: 0,
    cities: 0,
    travelers: 0,
    satisfaction: 0
  });
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cycle animation
  useEffect(() => {
    const maxSteps = workflowType === 'VOYAGEUR' ? 3 : 4;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % maxSteps) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [workflowType]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const stations = getStations();
    const approvedCompanies = getUsers().filter(u => u.role === 'COMPANY' && u.status === 'APPROVED');
    const approvedCompanyIds = approvedCompanies.map(c => c.id);
    const approvedStations = stations.filter(s => approvedCompanyIds.includes(s.companyId) && s.type === 'STATION');
    setPopularRoutes(approvedStations.slice(0, 3));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        animateValue('partners', 50);
        animateValue('cities', 25);
        animateValue('travelers', 10000);
        animateValue('satisfaction', 98);
      }
    }, { threshold: 0.5 });

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateValue = (key: keyof typeof stats, target: number) => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setStats(prev => ({ ...prev, [key]: target }));
        clearInterval(timer);
      } else {
        setStats(prev => ({ ...prev, [key]: Math.floor(start) }));
      }
    }, 16);
  };

  const getWorkflowSteps = () => {
    if (workflowType === 'VOYAGEUR') {
      return [
        { id: 1, icon: Search, label: "Recherche", color: "blue", pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-8", title: "Trouvez votre trajet", desc: "Comparez les horaires et tarifs de toutes les compagnies.", classes: { bg: "bg-blue-50", text: "text-blue-600", line: "bg-blue-500" } },
        { id: 2, icon: CheckCircle, label: "Sélection", color: "green", pos: "bottom-0 right-0 translate-x-4 translate-y-4", title: "Choisissez votre place", desc: "Sélectionnez votre siège préféré sur le plan du bus.", classes: { bg: "bg-green-50", text: "text-green-600", line: "bg-green-500" } },
        { id: 3, icon: Ticket, label: "Voyage", color: "red", pos: "bottom-0 left-0 -translate-x-4 translate-y-4", title: "Embarquez !", desc: "Recevez votre e-billet et présentez-le au départ.", classes: { bg: "bg-red-50", text: "text-red-600", line: "bg-red-500" } }
      ];
    } else {
      return [
        { id: 1, icon: Briefcase, label: "Inscription", color: "blue", pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-8", title: "Créez votre compte", desc: "Inscrivez votre compagnie en quelques clics.", classes: { bg: "bg-blue-50", text: "text-blue-600", line: "bg-blue-500" } },
        { id: 2, icon: ShieldCheck, label: "Validation", color: "green", pos: "right-0 top-1/2 translate-x-8 -translate-y-1/2", title: "Vérification", desc: "Nous validons vos documents officiels (ANaTT).", classes: { bg: "bg-green-50", text: "text-green-600", line: "bg-green-500" } },
        { id: 3, icon: Map, label: "Gestion", color: "yellow", pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-8", title: "Publiez vos trajets", desc: "Gérez vos lignes, horaires et tarifs facilement.", classes: { bg: "bg-yellow-50", text: "text-yellow-600", line: "bg-yellow-500" } },
        { id: 4, icon: TrendingUp, label: "Revenus", color: "red", pos: "left-0 top-1/2 -translate-x-8 -translate-y-1/2", title: "Encaissez", desc: "Recevez vos paiements et suivez vos statistiques.", classes: { bg: "bg-red-50", text: "text-red-600", line: "bg-red-500" } }
      ];
    }
  };

  const steps = getWorkflowSteps();

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col overflow-x-hidden">

      {/* 1. HERO SECTION PREMIUM V2 */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Slider */}
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>
            <img src={img} alt="Hero" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full flex flex-col items-center justify-center h-full pt-20">

          {/* Floating Grid Cards (Background Effect) */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {/* Card 1: Ticket */}
            <div className="absolute top-1/4 left-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 transform -rotate-6 animate-float-slow">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-[#008751] rounded-full flex items-center justify-center text-white"><Bus size={20} /></div>
                <div className="text-white">
                  <div className="font-bold text-sm">Cotonou</div>
                  <div className="text-xs opacity-70">08:00</div>
                </div>
                <ArrowRight className="text-white/50" size={16} />
                <div className="text-white text-right">
                  <div className="font-bold text-sm">Parakou</div>
                  <div className="text-xs opacity-70">14:30</div>
                </div>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full mt-2"></div>
            </div>

            {/* Card 2: Reservation */}
            <div className="absolute bottom-1/3 right-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 transform rotate-3 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=100" className="w-full h-full object-cover" />
                </div>
                <div className="text-white">
                  <div className="font-bold text-sm">Baobab Express</div>
                  <div className="text-xs text-[#FCD116] font-bold">Confirmé</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto relative z-30">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-[#008751] animate-pulse"></span>
              <span>La référence du voyage au Bénin</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-tight mb-8 drop-shadow-2xl animate-fade-in-up delay-100 font-['Dancing_Script']">
              <span className="text-[#008751]">Voyage</span>
              <span className="text-[#FCD116]">B</span>
              <span className="text-[#E8112D]">j</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up delay-200">
              Réservez vos billets de bus en ligne, simplement et en toute sécurité.
              <br className="hidden md:block" />
              <span className="text-[#FCD116] font-medium">Voyagez mieux, voyagez connecté.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-300">
              <button
                onClick={() => onNavigate('SIGNUP_VOYAGEUR')}
                className="group bg-[#008751] hover:bg-[#006b40] text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(0,135,81,0.4)] hover:shadow-[0_0_50px_rgba(0,135,81,0.6)] flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <span>Je réserve mon billet</span>
                <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </button>

              <button
                onClick={() => onNavigate('SIGNUP_COMPANY')}
                className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-5 rounded-full font-bold text-lg transition-all border border-white/30 flex items-center justify-center gap-3"
              >
                <Briefcase size={20} />
                <span>Espace Compagnie</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50 z-20">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 2. CREDIBILITY MARQUEE */}
      <div className="bg-white py-10 border-b border-gray-100 overflow-hidden">
        <p className="text-center text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Ils nous font confiance</p>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <span key={idx} className="text-2xl font-black text-gray-300 hover:text-[#008751] transition-colors cursor-default">
                {partner}
              </span>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 px-8">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <span key={`dup-${idx}`} className="text-2xl font-black text-gray-300 hover:text-[#008751] transition-colors cursor-default">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. NOTRE MISSION (Problème, Solution, But) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Notre <span className="text-[#008751]">Mission</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Moderniser le secteur du transport au Bénin pour offrir une expérience de voyage simple, sécurisée et accessible à tous.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Le Problème */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-[#e8112d] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-[#e8112d] mb-6">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Le Problème Actuel</h3>
              <p className="text-gray-600 leading-relaxed">
                Les gares bondées, les files d'attente interminables, l'incertitude sur les horaires et les tarifs non réglementés rendent les voyages stressants et fatigants.
              </p>
            </div>

            {/* La Solution */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-[#008751] transform md:scale-110 md:-translate-y-4 z-10">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-[#008751] mb-6">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">La Solution VoyageBJ</h3>
              <p className="text-gray-600 leading-relaxed">
                Une plateforme unique centralisant toutes les compagnies. Réservez votre billet en 2 minutes depuis votre canapé, choisissez votre siège et recevez votre E-Ticket instantanément.
              </p>
            </div>

            {/* L'Objectif */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-[#e9b400] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-[#e9b400] mb-6">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Notre Objectif</h3>
              <p className="text-gray-600 leading-relaxed">
                Connecter toutes les villes du Bénin, digitaliser 100% des compagnies de transport et devenir la référence incontournable de la mobilité en Afrique de l'Ouest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMENT CA MARCHE (3D Grid Cards) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Comment ça <span className="text-[#008751] font-['Dancing_Script'] text-5xl md:text-6xl">marche ?</span>
            </h2>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 p-1.5 rounded-full inline-flex relative">
                <button
                  onClick={() => setWorkflowType('VOYAGEUR')}
                  className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${workflowType === 'VOYAGEUR' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Voyageur
                </button>
                <button
                  onClick={() => setWorkflowType('COMPANY')}
                  className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${workflowType === 'COMPANY' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Compagnie
                </button>

                {/* Rolling Background */}
                <div className={`absolute top-1.5 bottom-1.5 rounded-full bg-[#008751] shadow-md transition-all duration-300 ease-out ${workflowType === 'VOYAGEUR' ? 'left-1.5 w-[50%] md:w-[130px]' : 'left-[50%] w-[50%] md:w-[130px]'}`}></div>
              </div>
            </div>
          </div>

          {/* 3D Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="group h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(5deg)_rotateY(5deg)_scale(1.02)]">
                  {/* Decorative number background */}
                  <div className="absolute top-0 right-0 p-6 opacity-5 font-black text-9xl text-gray-900 select-none pointer-events-none transition-transform duration-500 group-hover:translate-z-10 [transform:translateZ(0)] group-hover:[transform:translateZ(20px)]">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${step.classes.bg} mb-6 flex items-center justify-center ${step.classes.text} transition-transform duration-500 group-hover:[transform:translateZ(30px)]`}>
                    <step.icon size={32} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 transition-transform duration-500 group-hover:[transform:translateZ(20px)]">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bottom Line */}
                  <div className={`absolute bottom-0 left-0 h-1.5 ${step.classes.line} transition-all duration-500 w-0 group-hover:w-full rounded-b-3xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS & IMPACT */}
      <div ref={statsRef} className="bg-[#008751] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">{stats.partners}+</div>
              <div className="text-green-200 font-medium uppercase tracking-wider text-xs md:text-sm">Compagnies</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">{stats.cities}+</div>
              <div className="text-green-200 font-medium uppercase tracking-wider text-xs md:text-sm">Villes Desservies</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">{stats.travelers.toLocaleString()}</div>
              <div className="text-green-200 font-medium uppercase tracking-wider text-xs md:text-sm">Voyageurs Heureux</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">{stats.satisfaction}%</div>
              <div className="text-green-200 font-medium uppercase tracking-wider text-xs md:text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. POPULAR ROUTES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Destinations <span className="text-[#e9b400]">Populaires</span>
              </h2>
              <p className="text-gray-500 text-lg">Découvrez les gares les plus fréquentées du moment.</p>
            </div>
            <button onClick={() => onNavigate('COMPANIES_LIST')} className="text-[#008751] font-bold flex items-center gap-2 hover:gap-4 transition-all">
              Voir toutes les gares <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {popularRoutes.length > 0 ? popularRoutes.map((station) => {
              const allStations = getStations();
              const routeCount = allStations.filter(s => s.parentId === station.id).length;

              return (
                <div
                  key={station.id}
                  onClick={() => onNavigate('SEARCH_RESULTS', { departure: station.location, arrival: '', date: '' })}
                  className="group relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_20px_60px_rgba(0,107,64,0.15)] transition-all duration-700 hover:-translate-y-2 border border-white"
                >
                  <img src={station.photoUrl || `https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800`} alt={station.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-[10px] font-black border border-white/30 uppercase tracking-widest">
                    {station.companyName}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="flex items-center gap-2 text-[#FCD116] mb-3 font-black text-xs uppercase tracking-widest">
                      <MapPin size={16} />
                      <span>{station.location}</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6 group-hover:text-green-300 transition-colors uppercase leading-tight">{station.name}</h3>

                    <div className="flex items-center justify-between border-t border-white/20 pt-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0">
                      <div className="text-white">
                        <span className="block text-3xl font-black text-green-400">{routeCount}</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Lignes Directes</span>
                      </div>
                      <div className="w-14 h-14 bg-[#008751] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/50 group-hover:bg-[#006b40] transition-all">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-3 text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">Chargement des destinations...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#008751] rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#e9b400] rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">La parole aux <span className="text-[#e9b400]">voyageurs</span></h2>
            <p className="text-gray-400">Découvrez pourquoi des milliers de béninois nous font confiance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Jean D.", role: "Voyageur fréquent", text: "VoyageBJ a transformé ma façon de voyager. Plus besoin de me déplacer à la gare à l'avance, je réserve en ligne et j'ai mon billet sur mon téléphone.", color: "green" },
              { name: "Marie T.", role: "Directrice de compagnie", text: "Depuis que nous sommes sur VoyageBJ, notre taux d'occupation a augmenté de 30%. La plateforme nous permet de mieux gérer nos trajets et nos revenus.", color: "yellow" },
              { name: "Koffi A.", role: "Étudiant", text: "En tant qu'étudiant, les tarifs avantageux et la facilité d'utilisation de VoyageBJ me permettent de rentrer chez moi plus souvent sans me ruiner.", color: "red" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2">
                <div className="flex items-center gap-1 mb-6 text-[#e9b400]">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed italic">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-700 flex items-center justify-center font-bold text-lg shadow-lg`}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURES 3D GRID (Ex-Newsletter) */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Pourquoi choisir <span className="text-[#008751]">VoyageBJ ?</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Des outils puissants pour les voyageurs et les compagnies, conçus pour simplifier votre quotidien.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {/* Card 1: Support (Green) */}
            <div className="group h-[400px] relative transition-all duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_scale(1.02)] cursor-pointer">
              <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
                <div className="h-1/2 bg-[#008751] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>

                  <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <MessageCircle size={48} className="text-white" />
                  </div>
                </div>
                <div className="h-1/2 p-8 flex flex-col justify-center relative z-10 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#008751] transition-colors">Support Réactif 24/7</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    Une question ? Notre équipe est disponible à tout moment via notre auto-répondeur intelligent et notre chat en direct.
                  </p>
                  <div className="mt-4 flex items-center text-[#008751] font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    En savoir plus <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Export (Purple) */}
            <div className="group h-[400px] relative transition-all duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_scale(1.02)] cursor-pointer" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
                <div className="h-1/2 bg-[#8b5cf6] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>

                  <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    <Download size={48} className="text-white" />
                  </div>
                </div>
                <div className="h-1/2 p-8 flex flex-col justify-center relative z-10 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#8b5cf6] transition-colors">Export Facile</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    Téléchargez vos historiques de voyage, vos factures et vos billets au format PDF ou Excel en un seul clic.
                  </p>
                  <div className="mt-4 flex items-center text-[#8b5cf6] font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    En savoir plus <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Stats (Blue) */}
            <div className="group h-[400px] relative transition-all duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_scale(1.02)] cursor-pointer" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
                <div className="h-1/2 bg-[#3b82f6] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>

                  <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <BarChart size={48} className="text-white" />
                  </div>
                </div>
                <div className="h-1/2 p-8 flex flex-col justify-center relative z-10 bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#3b82f6] transition-colors">Statistiques Précises</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    Accédez à des rapports détaillés sur vos dépenses de transport ou vos revenus pour optimiser votre budget.
                  </p>
                  <div className="mt-4 flex items-center text-[#3b82f6] font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    En savoir plus <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 25s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-20px) rotate(-6deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>

    </div>
  );
};
