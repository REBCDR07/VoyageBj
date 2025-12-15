# Besoins Backend - Projet VoyageBJ

Ce document liste les pré-requis techniques et les endpoints API nécessaires pour le développement du backend de l'application **VoyageBJ**. Actuellement, l'application utilise le `localStorage` pour simuler une base de données. L'objectif est de remplacer cette simulation par une API RESTful robuste.

## 1. Architecture Recommandée

*   **Langage/Framework** : Node.js (NestJS ou Express) ou Python (Django/FastAPI).
*   **Base de Données** : PostgreSQL (Relationnel) recommandé pour gérer les relations complexes (Compagnies -> Stations -> Trajets -> Réservations).
*   **Authentification** : JWT (JSON Web Tokens) pour la gestion des sessions sans état.
*   **Stockage de Fichiers** : AWS S3, Cloudinary ou équivalent pour stocker les images (avatars, bannières, photos de bus).

## 2. Modèles de Données (Entités)

### User (Utilisateurs)
Sert à la fois pour les **Voyageurs**, les **Compagnies** et l'**Admin**.
*   `id` (UUID)
*   `email` (Unique)
*   `password_hash`
*   `role` (ENUM: 'CLIENT', 'COMPANY', 'ADMIN')
*   `name` (Nom complet ou Nom du gestionnaire)
*   `phone`
*   `avatar_url`
*   **Champs spécifiques Compagnie** :
    *   `company_name`
    *   `ifu`, `rccm`
    *   `anatt_url`, `other_docs_url`
    *   `status` (ENUM: 'PENDING', 'APPROVED', 'REJECTED')
    *   `banner_url`
    *   `description`

### Station (Gares & Trajets)
Une entité unique qui gère à la fois les lieux physiques (Gares) et les lignes directes.
*   `id` (UUID)
*   `company_id` (FK -> User)
*   `type` (ENUM: 'STATION', 'ROUTE')
*   `name`
*   `location` (Ville)
*   `photo_url`
*   `description`
*   **Pour les Gares** : `opening_time`, `closing_time`, `map_link`
*   **Pour les Trajets** : `point_a`, `point_b`, `price`, `price_premium`, `departure_hours` (Array), `arrival_hours` (Array), `work_days` (Array), `departure_point`, `map_link_a`, `map_link_b`
*   `parent_id` (FK -> Station, optionnel, pour lier un trajet à une gare)

### Reservation (Réservations)
*   `id` (UUID)
*   `client_id` (FK -> User)
*   `company_id` (FK -> User)
*   `station_id` (FK -> Station - le trajet réservé)
*   `passenger_name`, `passenger_email`, `passenger_phone`
*   `route_summary` (Snapshot du trajet : "Cotonou -> Parakou")
*   `departure_date`, `departure_time`
*   `price_paid`
*   `ticket_class` (ENUM: 'STANDARD', 'PREMIUM')
*   `status` (ENUM: 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')
*   `created_at`

---

## 3. Endpoints API Nécessaires

### Authentification (`/auth`)
*   `POST /auth/register` : Création de compte (Client ou Compagnie).
*   `POST /auth/login` : Connexion (Retourne un Token JWT).
*   `GET /auth/me` : Récupérer le profil de l'utilisateur connecté via le Token.

### Utilisateurs (`/users`)
*   `PUT /users/profile` : Mise à jour du profil (Avatar, Nom, Infos Compagnie).
*   `GET /users/companies` : **Public**. Liste de toutes les compagnies approuvées (`status='APPROVED'`).
*   `GET /users/companies/:id` : **Public**. Détails d'une compagnie spécifique.
*   **Admin Uniquement** :
    *   `GET /users/admin/pending-companies` : Liste des compagnies en attente de validation.
    *   `PATCH /users/admin/companies/:id/status` : Valider ou rejeter une compagnie (`APPROVED` / `REJECTED`).

### Stations & Trajets (`/stations`)
*   `POST /stations` : **Compagnie**. Créer une gare ou un trajet.
*   `GET /stations` : **Public**. Recherche et Listing.
    *   *Query Params* : `?company_id=...`, `?type=...` (STATION/ROUTE), `?departure=...`, `?arrival=...`, `?date=...`.
    *   **Logique de Recherche Backend** : Le backend doit filtrer les stations qui correspondent à la ville de départ ET qui possèdent des sous-trajets vers la ville d'arrivée (si spécifiée).
*   `PUT /stations/:id` : **Compagnie**. Modifier une gare/trajet.
*   `DELETE /stations/:id` : **Compagnie**. Supprimer.

### Réservations (`/reservations`)
*   `POST /reservations` : **Client**. Créer une nouvelle réservation.
*   `GET /reservations/my-bookings` : **Client**. Historique des réservations de l'utilisateur connecté.
*   `GET /reservations/company` : **Compagnie**. Liste des réservations reçues pour la compagnie connectée.
*   `PATCH /reservations/:id/status` : **Compagnie**. Mettre à jour le statut (`CONFIRMED`, `COMPLETED`...).

### Upload (`/upload`)
*   `POST /upload` : Upload d'une image (Avatar, Photo Bus, Documents). Retourne l'URL du fichier hébergé.

---

## 4. Règles Métier Importantes

1.  **Validation des Compagnies** : Une compagnie nouvellement inscrite a le statut `PENDING`. Elle ne doit pas apparaître dans les résultats de recherche tant qu'un ADMIN ne l'a pas passée en `APPROVED`.
2.  **Recherche de Trajets** :
    *   Si un utilisateur cherche "Cotonou" -> "Parakou", l'API doit retourner :
        *   Les trajets directs (Type `ROUTE`) ayant Point A = Cotonou et Point B = Parakou.
        *   Les gares (Type `STATION`) situées à Cotonou qui ont des sous-trajets vers Parakou.
3.  **Sécurité** :
    *   Une compagnie ne peut modifier/supprimer que SES propres stations.
    *   Un client ne peut voir que SES propres réservations.

## 5. Besoin DevOps (Déploiement)
*   Serveur API hébergé (ex: VPS, Heroku, Railway, Render).
*   Base de données hébergée (ex: Supabase, Neon.tech, AWS RDS).
*   Certificat SSL (HTTPS) obligatoire.
