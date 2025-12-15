# 🚌 VoyageBj - Plateforme de Réservation de Transport au Bénin

<div align="center">

![VoyageBj Banner](https://via.placeholder.com/1200x300/008751/FFFFFF?text=VoyageBj+Plateforme+Officielle)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)](https://github.com/voyagebj)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Private-red.svg?style=for-the-badge)](LICENSE)

**La première plateforme digitale qui révolutionne le transport interurbain au Bénin.**
Connectez-vous, réservez, voyagez.

[Fonctionnalités](#-fonctionnalités) • [Architecture](#-architecture) • [Workflows](#-workflows) • [Documentation](#-documentation)

</div>

---

## 📋 Table des Matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités Clés](#-fonctionnalités-clés)
- [🛠 Stack Technique](#-stack-technique)
- [🏗 Architecture du Projet](#-architecture-du-projet)
- [🔄 Workflows Métier](#-workflows-métier)
- [🚀 Installation & Démarrage](#-installation--démarrage)
- [📚 Documentation](#-documentation)
- [🤝 Contribution](#-contribution)

---

## 🎯 Vue d'ensemble

**VoyageBj** est une solution SaaS complète conçue pour moderniser le secteur du transport au Bénin. Elle offre une interface unifiée pour :
1.  **Les Voyageurs** : Réservation de billets en ligne, et suivi des trajets.
2.  **Les Compagnies** : Gestion de flotte, planification des départs, et suivi des réservations.
3.  **L'Administration** : Supervision du réseau, validation des acteurs, et statistiques globales.

### 🎨 Identité Visuelle
Le design system est ancré dans l'identité nationale :
- 🟢 **Vert (#008751)** : Espérance & Renouveau (Actions principales, Succès)
- 🟡 **Jaune (#FCD116)** : Richesse & Présage (Éléments Premium, Avertissements)
- 🔴 **Rouge (#E8112D)** : Courage & Force (Actions destructives, Erreurs)

---

## ✨ Fonctionnalités Clés

| Module | Fonctionnalités |
| :--- | :--- |
| **👤 Espace Voyageur** | • Recherche intelligente & Feed 3D interactif<br>• Sélection de siège visuelle<br>• Billets QR Code (PDF/PNG) avec design "Arrivée"<br>• Historique & Téléchargement simplifié |
| **🏢 Espace Compagnie** | • Dashboard Analytique (Vues Stations/Trajets)<br>• Création intuitive (Upload Drag & Drop + Fallback initiaux)<br>• Validation des embarquements (Scan QR)<br>• Gestion de flotte & Horaires |
| **🛡️ Espace Admin** | • KYC Compagnies (Vérification IFU, RCCM)<br>• Supervision du trafic & Notifications (Sonner)<br>• Gestion des utilisateurs & Rôles<br>• Audit logs |

---

## 🛠 Stack Technique

### Frontend
- **Framework** : React 19 (Hooks, Context API)
- **Langage** : TypeScript 5.7 (Strict Mode)
- **Build Tool** : Vite 6.1 (HMR, Optimisation)
- **Styling** : Tailwind CSS 4 (JIT, Design System)

### Bibliothèques Principales
| Lib | Usage |
| :--- | :--- |
| `lucide-react` | Icônes vectorielles légères |
| `recharts` | Visualisation de données (Graphiques) |
| `react-router-dom` | Routage client-side (SPA) |
| `jspdf` / `html2canvas` | Génération de documents PDF |
| `framer-motion` | Animations fluides (Transitions) |

---

## 🏗 Architecture du Projet

L'architecture suit une approche **Feature-Based** pour une scalabilité maximale.

```mermaid
graph TD
    SRC[src/] --> FEAT[features/]
    SRC --> SHARED[shared/]
    
    FEAT --> AUTH[auth/ (Login, Signup)]
    FEAT --> CLIENT[client/ (Dashboard Voyageur)]
    FEAT --> COMPANY[company/ (Dashboard Compagnie)]
    FEAT --> ADMIN[admin/ (Dashboard Admin)]
    FEAT --> PUBLIC[public/ (Landing, Search)]
    
    SHARED --> COMPS[components/ (UI Kit)]
    SHARED --> SERV[services/ (API, Storage)]
    SHARED --> TYPES[types/ (Interfaces TS)]
    SHARED --> UTILS[utils/ (Helpers)]
```

---

## 🔄 Workflows Métier

### 1. Processus de Réservation (Voyageur)

```mermaid
sequenceDiagram
    participant U as Voyageur
    participant S as Système
    participant C as Compagnie
    
    U->>S: Recherche (Départ, Arrivée, Date)
    S-->>U: Liste des trajets disponibles
    U->>S: Sélectionne un trajet & Siège
    U->>S: Confirme la réservation (PENDING)
    Note over U,S: Génération du Ticket Provisoire
    C->>S: Valide le paiement/embarquement
    S-->>U: Ticket Final (QR Code Validé)
    S->>S: Mise à jour du statut (COMPLETED)
```

### 2. Onboarding Compagnie (KYC)

```mermaid
graph LR
    A[Inscription Compagnie] -->|Upload Docs| B(Statut: PENDING)
    B --> C{Validation Admin}
    C -->|Documents Valides| D[Statut: APPROVED]
    C -->|Documents Incomplets| E[Statut: REJECTED]
    D --> F[Accès Dashboard]
    E --> A
```

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** v18+
- **npm** v9+

### Quick Start

```bash
# 1. Cloner le projet
git clone https://github.com/REBCDR07/VoyageBj.git

# 2. Installer les dépendances
cd VoyageBj
npm install

# 3. Lancer en mode développement
npm run dev
```

> L'application sera accessible sur `http://localhost:5173`

---

## 📚 Documentation

La documentation technique détaillée est disponible dans le dossier `/docs` :

- [📂 Architecture Détaillée](docs/ARCHITECTURE.md) : Structure des dossiers et choix techniques.
- [🚦 Guide de Démarrage](docs/GUIDE_DEMARRAGE.md) : Setup environnement et scripts.
- [📝 Règles de Contribution](docs/CONTRIBUTING.md) : Conventions de code et Git flow.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1.  Forker le projet
2.  Créer une branche (`git checkout -b feature/AmazingFeature`)
3.  Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Push vers la branche (`git push origin feature/AmazingFeature`)
5.  Ouvrir une Pull Request

---

<div align="center">

**VoyageBj** © 2025 - Made in Bénin 🇧🇯

</div>
