
export enum UserRole {
  COMPANY = 'COMPANY',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export type ViewState = 'LANDING' | 'LOGIN_VOYAGEUR' | 'SIGNUP_VOYAGEUR' | 'LOGIN_COMPANY' | 'SIGNUP_COMPANY' | 'LOGIN_ADMIN' | 'DASHBOARD_ADMIN' | 'DASHBOARD_COMPANY' | 'DASHBOARD_CLIENT' | 'STATION_MANAGER' | 'ADMIN_VALIDATIONS' | 'ADMIN_PROFILE' | 'SEARCH_RESULTS' | 'COMPANIES_LIST' | 'COMPANY_DETAILS' | 'COMPANIES';
export type CompanyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  password?: string; // Added password as optional
  name: string; // Manager name for company, Full name for client
  role: UserRole; // Kept UserRole enum
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
  description?: string;
}

export interface Station {
  id: string;
  parentId?: string; // ID of the parent station (if this is a route)
  companyId: string;
  companyName: string;
  type: 'STATION' | 'ROUTE'; // Sub-station or direct route
  name: string;
  photoUrl: string;
  location: string; // City/Area
  mapLink?: string; // Google Maps link
  description?: string;

  // Horaires d'ouverture (Pour Station)
  openingTime?: string;
  closingTime?: string;

  // Détails du trajet (Pour Route)
  pointA?: string;
  pointB?: string;
  departurePoint?: string; // Specific spot

  // Horaires
  workDays: string[]; // ["Mon", "Tue", ...]
  departureHours?: string[]; // ["08:00", "14:00"] (Pour Route)
  arrivalHours?: string[]; // ["12:00", "18:00"] (Pour Route)

  price?: number;
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
