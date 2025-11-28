
export enum UserRole {
  COMPANY = 'COMPANY',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export type ViewState = 'LANDING' | 'LOGIN_VOYAGEUR' | 'SIGNUP_VOYAGEUR' | 'LOGIN_COMPANY' | 'SIGNUP_COMPANY' | 'LOGIN_ADMIN' | 'DASHBOARD_ADMIN' | 'DASHBOARD_COMPANY' | 'DASHBOARD_CLIENT' | 'STATION_MANAGER' | 'ADMIN_VALIDATIONS' | 'ADMIN_PROFILE' | 'SEARCH_RESULTS' | 'COMPANIES';
export type CompanyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  description: string;
  id: string;
  name: string; // Manager name for company, Full name for client
  email: string;
  role: UserRole;
  avatarUrl?: string;
  npi?: string; // Numéro Personnel d'Identification

  // Spécifique au client
  phone?: string;

  // Spécifique à la compagnie
  companyName?: string;
  bannerUrl?: string;
  ifu?: string;
  rccm?: string;
  anattUrl?: string; // Primary auth doc
  otherDocsUrl?: string; // Supplemental docs
  status?: CompanyStatus; // Approval status

  // Informations de contact admin
  address?: string;
  whatsapp?: string;
}

export interface Station {
  id: string;
  companyId: string;
  companyName: string;
  type: 'STATION' | 'ROUTE'; // Sub-station or direct route
  name: string;
  photoUrl: string;
  location: string; // City/Area
  description?: string;

  // Détails du trajet
  pointA: string;
  pointB: string;
  departurePoint: string; // Specific spot

  // Horaires
  workDays: string[]; // ["Mon", "Tue", ...]
  departureHours: string[]; // ["08:00", "14:00"]
  arrivalHours?: string[]; // ["12:00", "18:00"]

  price: number;
  pricePremium?: number;
}

export interface Reservation {
  id: string;
  stationId: string;
  companyId: string;
  clientId: string;

  // Détails du passager
  clientName: string;
  clientEmail: string;
  clientPhone: string;

  // Copie des détails du voyage (instantané au moment de la réservation)
  routeSummary: string;
  departureTime: string;
  departureDate: string; // ISO Date string
  pricePaid: number;
  ticketClass: 'STANDARD' | 'PREMIUM';

  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';
  createdAt: string;
}

export const MOCK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
