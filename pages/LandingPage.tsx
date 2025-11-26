import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, ShieldCheck, Users, ArrowRight, Clock, Map, Star, CheckCircle,
  Briefcase, Search, MapPin, Calendar, CreditCard, Ticket, Globe,
  AlertTriangle, TrendingUp, Server, Cloud, Smartphone, Mail, Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react';
import { User, Station } from '../types';
import { Footer } from '../components/Footer';
import { getStations, getUsers } from '../services/storage';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  user: User | null;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
];

export const LandingPage: React.FC<Props> = ({ onNavigate, user }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popularRoutes, setPopularRoutes] = useState<Station[]>([]);

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

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Load popular routes from approved companies
    const stations = getStations();
    const approvedCompanies = getUsers().filter(u => u.role === 'COMPANY' && u.status === 'APPROVED');
    const approvedCompanyIds = approvedCompanies.map(c => c.id);
    
    const approvedStations = stations.filter(s => approvedCompanyIds.includes(s.companyId));
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

  return (
    <div className="bg-white font-sans min-h-screen flex flex-col pt-[60px]">
      {/* Section Hero 3D */}
      <div className="relative bg-gray-900 h-[600px] md:h-[750px] overflow-hidden flex items-center justify-center perspective-[1000px]">
        {/* Carrousel d'images */}
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${index === currentImageIndex ? 'opacity-50 scale-105' : 'opacity-0 scale-100'}`}
          >
            <img src={img} alt="Hero" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-gray-900"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center transform transition-transform duration-500 hover:scale-[1.01]">
          <span className="inline-block py-2 px-5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-8 border border-white/20 animate-fade-in shadow-lg">
            🇧🇯 Le réseau de transport n°1 au Bénin
          </span>
          <h1 className="text-5xl md:text-8xl font-extrabold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl">
            Votre voyage commence <br />
            <span className="text-transparent bg-clip-text benin-gradient-text">maintenant.</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow-md font-light">
            Comparez les compagnies, choisissez votre siège et réservez votre ticket de bus en toute sécurité depuis votre smartphone.
          </p>

          {/* Boutons CTA 3D doubles */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 perspective-[1000px]">
            <button
              onClick={() => onNavigate('SIGNUP_VOYAGEUR')}
              className="group w-full md:w-auto bg-[#008751] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#006b40] transition-all shadow-[0_20px_50px_-12px_rgba(22,163,74,0.5)] flex items-center justify-center gap-3 transform hover:-translate-y-1 hover:rotate-1 border border-lime-400/30"
            >
              <Users className="w-6 h-6" />
              <span>Je voyage</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
            </button>
            <button
              onClick={() => onNavigate('SIGNUP_COMPANY')}
              className="group w-full md:w-auto bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 border border-white/30 shadow-lg transform hover:-translate-y-1 hover:-rotate-1"
            >
              <Briefcase className="w-6 h-6" />
              <span>Je suis une Compagnie</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Widget de recherche superposé */}
      <div className="relative z-20 -mt-24 px-4 mb-20">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-float border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Trouvez Votre Trajet</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const departure = (form.elements[0] as HTMLInputElement).value;
            const arrival = (form.elements[1] as HTMLInputElement).value;
            const date = (form.elements[2] as HTMLInputElement).value;
            onNavigate('SEARCH_RESULTS', { departure, arrival, date });
          }} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Départ</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" placeholder="Ville de départ" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none bg-gray-50 focus:bg-white transition-colors" list="cities" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Arrivée</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" placeholder="Ville d'arrivée" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none bg-gray-50 focus:bg-white transition-colors" list="cities" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="date" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#008751] outline-none bg-gray-50 focus:bg-white transition-colors" min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-[#008751] text-white py-2.5 rounded-xl font-bold hover:bg-[#006b40] transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 h-[42px]">
                  <Search size={20} /> Rechercher
                </button>
              </div>
            </div>
            <datalist id="cities">
              <option value="Cotonou" />
              <option value="Porto-Novo" />
              <option value="Parakou" />
              <option value="Abomey-Calavi" />
              <option value="Bohicon" />
              <option value="Natitingou" />
              <option value="Djougou" />
              <option value="Kandi" />
              <option value="Malanville" />
              <option value="Ouidah" />
              <option value="Abomey" />
              <option value="Lokossa" />
            </datalist>
          </form>
        </div>
      </div>

      {/* Section Statistiques */}
      <div ref={statsRef} className="bg-white pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#008751] mb-2">{stats.partners}+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Compagnies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#e9b400] mb-2">{stats.cities}+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Villes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#e8112d] mb-2">{stats.travelers.toLocaleString()}</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Voyageurs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-gray-900 mb-2">{stats.satisfaction}%</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Pourquoi <span className="text-[#008751]">VoyageBJ</span> ?
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Nous digitalisons le secteur du transport terrestre béninois pour offrir
              une expérience moderne, sécurisée et efficace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Le Défi Actuel</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-red-500 mt-1 shrink-0" /> Réservation archaïque</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-red-500 mt-1 shrink-0" /> Manque de transparence</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-red-500 mt-1 shrink-0" /> Insécurité des paiements</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#008751] mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Notre Solution</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-[#008751] mt-1 shrink-0" /> Plateforme 24h/24</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-[#008751] mt-1 shrink-0" /> Réservation instantanée</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-[#008751] mt-1 shrink-0" /> Paiements Mobile Money</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Stratégique</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-blue-500 mt-1 shrink-0" /> Digitalisation du secteur</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-blue-500 mt-1 shrink-0" /> Écosystème intégré</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-blue-500 mt-1 shrink-0" /> Optimisation des revenus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <div id="process" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-lime-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-500">Votre voyage simplifié en 4 étapes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              { step: 1, title: "Recherche", icon: Search, desc: "Trouvez votre trajet" },
              { step: 2, title: "Sélection", icon: CheckCircle, desc: "Choisissez votre siège" },
              { step: 3, title: "Voyage", icon: Ticket, desc: "Recevez votre e-billet" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="w-16 h-16 bg-[#008751] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sections Audience */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-benin-green font-bold tracking-widest uppercase text-sm mb-2 block">Pour les Compagnies</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Digitalisez votre agence de transport</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Rejoignez le plus grand réseau de transporteurs au Bénin. Gérez vos départs, suivez vos ventes en temps réel et remplissez vos bus plus rapidement.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="bg-lime-100 p-2 rounded-lg text-benin-green group-hover:bg-[#008751] group-hover:text-white transition-colors"><Users size={20} /></div>
                  <span className="font-medium text-gray-700 group-hover:translate-x-2 transition-transform">Accès à une clientèle nationale</span>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="bg-lime-100 p-2 rounded-lg text-benin-green group-hover:bg-[#008751] group-hover:text-white transition-colors"><Briefcase size={20} /></div>
                  <span className="font-medium text-gray-700 group-hover:translate-x-2 transition-transform">Outils de gestion complets (Stats, Listes)</span>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="bg-lime-100 p-2 rounded-lg text-benin-green group-hover:bg-[#008751] group-hover:text-white transition-colors"><ShieldCheck size={20} /></div>
                  <span className="font-medium text-gray-700 group-hover:translate-x-2 transition-transform">Paiements sécurisés et garantis</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('SIGNUP_COMPANY')}
                className="bg-[#008751] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#006b40] transition-all shadow-lg shadow-lime-200 flex items-center gap-2 hover:-translate-y-1"
              >
                Devenir Partenaire <ArrowRight size={20} />
              </button>
            </div>
            <div className="order-1 lg:order-2 relative group perspective-[1000px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#008751] to-[#e9b400] rounded-3xl transform rotate-3 shadow-2xl group-hover:rotate-6 transition-transform duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1000&auto=format&fit=crop"
                alt="Bus Driver"
                className="relative rounded-3xl shadow-xl w-full h-[500px] object-cover transform group-hover:-translate-y-4 group-hover:-rotate-2 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grille des fonctionnalités */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Pourquoi choisir VoyageBj ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Map, title: "Couverture Totale", text: "De Cotonou à Malanville, trouvez des départs pour toutes les villes majeures.", color: "indigo" },
              { icon: Clock, title: "Gain de Temps", text: "Fini les files d'attente interminables en gare. Réservez depuis votre canapé.", color: "orange" },
              { icon: ShieldCheck, title: "Sécurité Vérifiée", text: "Nous vérifions les documents ANaTT de chaque compagnie partenaire.", color: "teal" },
              { icon: Star, title: "Service Premium", text: "Un support client dédié et une interface pensée pour votre confort.", color: "yellow" }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 group transform hover:-translate-y-2">
                <div className={`bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-${feature.color}-600 shadow-md mb-6 group-hover:scale-110 transition-transform group-hover:rotate-3`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Destinations <span className="text-[#008751]">Populaires</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Explorez les trajets les plus demandés à travers le Bénin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {popularRoutes.length > 0 ? popularRoutes.map((route, idx) => (
              <div key={route.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <img src={route.photoUrl || `https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800`} alt={`${route.pointA} to ${route.pointB}`} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-white">
                      <span className="font-bold text-lg">{route.pointA}</span>
                      <ArrowRight size={18} className="text-[#FCD116]" />
                      <span className="font-bold text-lg">{route.pointB}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">{route.companyName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">À partir de</span>
                      <span className="text-2xl font-bold text-[#FCD116]">{route.price} F</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p className="text-lg font-medium">Aucune destination disponible pour le moment</p>
                <p className="text-sm mt-2">Les compagnies approuvées apparaîtront ici</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => onNavigate('COMPANIES')} className="bg-[#008751] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#006b40] transition-all shadow-lg shadow-green-200 inline-flex items-center gap-2">
              Voir toutes les destinations <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Technology & Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Une plateforme <span className="text-[#008751]">moderne</span> et <span className="text-[#e9b400]">sécurisée</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Technologie de pointe pour une expérience utilisateur exceptionnelle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Smartphone, title: "Application Mobile", desc: "Interface responsive adaptée à tous les écrans", color: "blue" },
              { icon: Cloud, title: "Cloud Sécurisé", desc: "Vos données protégées et sauvegardées", color: "purple" },
              { icon: CreditCard, title: "Paiements Intégrés", desc: "Mobile Money et cartes bancaires acceptés", color: "green" },
              { icon: Server, title: "Disponibilité 24/7", desc: "Plateforme accessible à tout moment", color: "red" }
            ].map((tech, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-[#008751] transition-all group hover:shadow-xl">
                <div className={`w-14 h-14 bg-${tech.color}-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tech.icon size={28} className={`text-${tech.color}-600`} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{tech.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ils nous font confiance</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#008751] rounded-full flex items-center justify-center text-white font-bold mr-4">JD</div>
                <div><h4 className="font-bold">Jean D.</h4><p className="text-gray-400 text-sm">Voyageur régulier</p></div>
              </div>
              <p className="text-gray-300">"VoyageBJ a transformé ma façon de voyager. Plus besoin de me déplacer à la gare à l'avance, je réserve en ligne et j'ai mon billet sur mon téléphone."</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#e9b400] rounded-full flex items-center justify-center text-gray-900 font-bold mr-4">MT</div>
                <div><h4 className="font-bold">Marie T.</h4><p className="text-gray-400 text-sm">Directrice de compagnie</p></div>
              </div>
              <p className="text-gray-300">"Depuis que nous sommes sur VoyageBJ, notre taux d'occupation a augmenté de 30%. La plateforme nous permet de mieux gérer nos trajets et nos revenus."</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#e8112d] rounded-full flex items-center justify-center text-white font-bold mr-4">KA</div>
                <div><h4 className="font-bold">Koffi A.</h4><p className="text-gray-400 text-sm">Étudiant</p></div>
              </div>
              <p className="text-gray-300">"En tant qu'étudiant, les tarifs avantageux et la facilité d'utilisation de VoyageBJ me permettent de rentrer chez moi plus souvent sans me ruiner."</p>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};