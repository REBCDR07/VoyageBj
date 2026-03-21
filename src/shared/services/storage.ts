import { Station, Reservation, User } from '../types';
import { MOCK_USERS, MOCK_STATIONS, MOCK_RESERVATIONS } from './mocks';

// --- In-Memory State (Mocks) ---
// These variables exist only for the duration of the page session.
// Refreshing the page (F5) will reset them to their initial mock values.

let memoUsers: User[] = [...MOCK_USERS];
let memoStations: Station[] = [...MOCK_STATIONS];
let memoReservations: Reservation[] = [...MOCK_RESERVATIONS];
let memoCurrentUser: User | null = null;

// --- API de Stockage (Refactored for Memory Operations) ---

export const getStations = (): Station[] => {
  return [...memoStations];
};

export const saveStation = (station: Station) => {
  const index = memoStations.findIndex(s => s.id === station.id);
  if (index >= 0) {
    memoStations[index] = { ...station };
  } else {
    memoStations.push({ ...station });
  }
};

export const deleteStation = (id: string) => {
  memoStations = memoStations.filter(s => s.id !== id);
};

export const getReservations = (): Reservation[] => {
  return [...memoReservations];
};

export const createReservation = (reservation: Reservation) => {
  memoReservations.push({ ...reservation });
};

export const updateReservation = (reservation: Reservation) => {
  const index = memoReservations.findIndex(r => r.id === reservation.id);
  if (index >= 0) {
    memoReservations[index] = { ...reservation };
  } else {
    throw new Error('Réservation introuvable');
  }
};

export const getUsers = (): User[] => {
  return [...memoUsers];
};

export const saveUser = (user: User) => {
  const idx = memoUsers.findIndex(u => u.id === user.id);
  if (idx >= 0) {
    memoUsers[idx] = { ...user };
  } else {
    memoUsers.push({ ...user });
  }

  // Update current session if it's the same user
  if (memoCurrentUser && memoCurrentUser.id === user.id) {
    memoCurrentUser = { ...user };
  }
};

export const getCurrentUser = (): User | null => {
  return memoCurrentUser ? { ...memoCurrentUser } : null;
};

export const setCurrentUser = (user: User | null) => {
  memoCurrentUser = user ? { ...user } : null;
};

// --- Helpers ---

export const generateStationDescription = async (stationData: Partial<Station>): Promise<string> => {
  return "";
};