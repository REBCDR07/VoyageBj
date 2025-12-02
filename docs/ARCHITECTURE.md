# Architecture du Projet VoyageBj

Ce document décrit la structure du projet après le refactoring. L'objectif est de séparer le code par fonctionnalité ("features") pour une meilleure maintenabilité.

## Structure des Dossiers (`src/`)

### `features/`
Contient les modules fonctionnels de l'application. Chaque dossier correspond à un domaine métier ou un rôle utilisateur.

- **`auth/`** : Pages d'authentification (Login, Signup) pour tous les rôles.
- **`public/`** : Pages accessibles publiquement (Landing Page, Recherche, Liste des compagnies).
- **`client/`** : Tableau de bord et fonctionnalités pour les voyageurs (Clients).
- **`company/`** : Tableau de bord et gestion pour les compagnies de transport.
- **`admin/`** : Tableau de bord d'administration.

### `shared/`
Contient le code partagé utilisé par plusieurs features.

- **`components/`** : Composants UI réutilisables (Navbar, Footer, NotificationSystem, etc.).
- **`services/`** : Services d'accès aux données (ex: `storage.ts` pour le localStorage).
- **`types/`** : Définitions de types TypeScript globaux (Interfaces User, Station, Reservation).
- **`utils/`** : Fonctions utilitaires (ex: formatage de dates, helpers).

### Racine `src/`
- **`App.tsx`** : Composant principal qui gère le routage (React Router) et l'état global minimal (User session).
- **`index.tsx`** : Point d'entrée de l'application React.
- **`index.css`** : Styles globaux et configuration Tailwind.

## Routage
Le projet utilise `react-router-dom`. Les routes sont définies dans `App.tsx`.
La navigation se fait via le hook `useNavigate`.

## Flux de Données
- L'état de l'utilisateur (`user`) est géré dans `App.tsx` et passé aux composants via des props (ou pourrait être migré vers un Context).
- Les données sont persistées dans le `localStorage` via `shared/services/storage.ts`.
