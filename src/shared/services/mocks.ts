import { Station, Reservation, User, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  // Administrateur
  {
    id: 'admin',
    name: 'Administrateur',
    email: 'admin@voyagebj.com',
    role: UserRole.ADMIN,
    description: 'Gestionnaire système VoyageBJ'
  },
  // Compagnie Approuvée
  {
    id: 'comp1',
    name: 'Paul Manager',
    npi: '1234567890',
    companyName: 'Global Trans Co.',
    email: 'contact@global.com',
    role: UserRole.COMPANY,
    avatarUrl: 'https://picsum.photos/id/1/200/200',
    bannerUrl: 'https://picsum.photos/id/10/800/300',
    status: 'APPROVED',
    ifu: '1234567890123',
    rccm: 'RB/COT/001',
    anattUrl: 'autorisation_anatt.pdf',
    phone: '97000001',
    description: 'Transporteur international opérant au Bénin depuis 10 ans.'
  },
  // Compagnie En Attente
  {
    id: 'comp2',
    name: 'Jean Directeur',
    npi: '0987654321',
    companyName: 'Benin Express',
    email: 'new@benin.com',
    role: UserRole.COMPANY,
    avatarUrl: 'https://picsum.photos/id/3/200/200',
    bannerUrl: 'https://picsum.photos/id/11/800/300',
    status: 'PENDING',
    ifu: '9876543210987',
    rccm: 'RB/COT/002',
    anattUrl: 'demande_agrement.docx',
    phone: '66000002',
    description: 'Nouvelle compagnie de transport rapide.'
  },
  // Client
  {
    id: 'client1',
    name: 'Amina Client',
    npi: '1122334455',
    email: 'amina@mail.com',
    phone: '+229 97000000',
    role: UserRole.CLIENT,
    avatarUrl: 'https://picsum.photos/id/2/200/200',
    description: 'Voyageuse régulière.'
  }
];

export const MOCK_STATIONS: Station[] = [
  {
    id: 'stat1',
    companyId: 'comp1',
    companyName: 'Global Trans Co.',
    type: 'STATION',
    name: 'Gare Jonquet',
    photoUrl: 'https://picsum.photos/id/122/400/300',
    location: 'Cotonou',
    openingTime: '06:00',
    closingTime: '22:00',
    workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    description: 'Gare principale de Cotonou.'
  },
  {
    id: 'stat2',
    companyId: 'comp1',
    companyName: 'Global Trans Co.',
    type: 'STATION',
    name: 'Gare Calavi',
    photoUrl: 'https://picsum.photos/id/123/400/300',
    location: 'Abomey-Calavi',
    openingTime: '07:00',
    closingTime: '21:00',
    workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    description: 'Gare située près de l\'université.'
  },
  {
    id: 'route1',
    companyId: 'comp1',
    companyName: 'Global Trans Co.',
    type: 'ROUTE',
    name: 'Cotonou - Parakou (Express)',
    photoUrl: 'https://picsum.photos/id/124/400/300',
    location: 'Cotonou',
    pointA: 'Cotonou',
    pointB: 'Parakou',
    departurePoint: 'Gare Jonquet',
    price: 8000,
    pricePremium: 12000,
    workDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    departureHours: ["08:00", "20:00"],
    arrivalHours: ["14:00", "02:00"],
    description: 'Ligne directe vers le nord.'
  }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res1',
    stationId: 'route1',
    companyId: 'comp1',
    clientId: 'client1',
    clientName: 'Amina Client',
    clientEmail: 'amina@mail.com',
    clientPhone: '+229 97000000',
    routeSummary: 'Cotonou -> Parakou',
    departureTime: '08:00',
    departureDate: '2026-03-01',
    pricePaid: 8000,
    ticketClass: 'STANDARD',
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  }
];
