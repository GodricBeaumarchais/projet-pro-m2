# League of Legends Lobby Tracker

## Description du Projet
Une plateforme permettant de suivre les performances des joueurs League of Legends à travers des lobbies personnalisés. Les utilisateurs peuvent créer et gérer des pages de suivi pour différents groupes de joueurs, avec mise à jour en temps réel de leurs classements et statistiques.

## Architecture Technique

### Backend (NestJS + Prisma)
```
back/
├── src/
│   ├── controllers/        # Points d'entrée de l'API
│   ├── core/              # Entités, DTOs et abstractions
│   ├── use-cases/         # Logique métier
│   │   ├── auth/          # Authentification OAuth2 LoL
│   │   ├── lobby/         # Gestion des lobbies
│   │   ├── player/        # Gestion des joueurs
│   │   └── stats/         # Gestion des statistiques
│   └── orm/               # Configuration Prisma et services
└── prisma/
    └── schema.prisma      # Modèle de données
```

### Frontend (Next.js + Tailwind)
```
front/
├── src/
│   ├── app/              # Pages et routing Next.js
│   ├── components/       # Composants réutilisables
│   │   ├── lobby/       # Composants spécifiques aux lobbies
│   │   ├── player/      # Composants liés aux joueurs
│   │   └── ui/          # Composants UI génériques
│   ├── lib/             # Utilitaires et services
│   └── styles/          # Styles Tailwind personnalisés
```

## Fonctionnalités Principales

### 1. Authentification
- Connexion via OAuth2 League of Legends
- Gestion des sessions utilisateur
- Protection des routes authentifiées

### 2. Gestion des Lobbies
- Création de pages de suivi personnalisées
- Ajout/Suppression de joueurs
- Configuration des paramètres d'affichage
- Partage de lobbies (liens publics)

### 3. Suivi des Joueurs
- Affichage du rang actuel
- Historique des rangs
- Statistiques par rôle
- Indicateur de partie en cours
- Tag et pseudo LoL

### 4. Statistiques en Temps Réel
- Mise à jour automatique des classements
- Suivi des parties en cours
- Historique des performances
- Tendances de progression

## Modèle de Données

### Entités Principales
```prisma
model User {
  id        String   @id @default(uuid())
  lolId     String   @unique  // ID League of Legends
  username  String
  lobbies   Lobby[]  // Lobbies créés par l'utilisateur
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Lobby {
  id          String    @id @default(uuid())
  name        String
  description String?
  isPublic    Boolean   @default(false)
  creator     User      @relation(fields: [creatorId], references: [id])
  creatorId   String
  players     Player[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Player {
  id        String   @id @default(uuid())
  lolId     String   // ID League of Legends
  summonerName String
  tagLine    String
  role      Role     @default(FILL)
  rank      Rank     // Rang actuel
  lobbies   Lobby[]  // Lobbies où le joueur est suivi
  stats     Stats[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Stats {
  id        String   @id @default(uuid())
  playerId  String
  player    Player   @relation(fields: [playerId], references: [id])
  rank      Rank
  lp        Int
  wins      Int
  losses    Int
  timestamp DateTime @default(now())
}

enum Role {
  TOP
  JUNGLE
  MID
  ADC
  SUPPORT
  FILL
}

enum Rank {
  IRON
  BRONZE
  SILVER
  GOLD
  PLATINUM
  EMERALD
  DIAMOND
  MASTER
  GRANDMASTER
  CHALLENGER
}
```

## API League of Legends

### Endpoints Utilisés
- `/lol/summoner/v4/summoners/by-name/{summonerName}`
- `/lol/league/v4/entries/by-summoner/{encryptedSummonerId}`
- `/lol/spectator/v4/active-games/by-summoner/{encryptedSummonerId}`

### Rate Limiting
- Gestion des limites d'API Riot Games
- Mise en cache des données
- Optimisation des requêtes

## Interface Utilisateur

### Thème
- Design moderne et responsive
- Palette de couleurs LoL
- Composants Tailwind personnalisés
- Animations fluides

### Pages Principales
1. **Accueil**
   - Présentation du service
   - Lobbies populaires
   - Call-to-action pour connexion

2. **Dashboard**
   - Liste des lobbies de l'utilisateur
   - Création de nouveau lobby
   - Statistiques globales

3. **Page Lobby**
   - Liste des joueurs
   - Statistiques en temps réel
   - Options de configuration
   - Bouton de partage

4. **Profil Joueur**
   - Détails du compte LoL
   - Historique des rangs
   - Statistiques détaillées
   - Parties en cours

## Déploiement

### Infrastructure
- Backend: Serveur Node.js
- Base de données: PostgreSQL
- Frontend: Vercel
- Cache: Redis

### Variables d'Environnement
```env
# Backend
DATABASE_URL=
RIOT_API_KEY=
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
JWT_SECRET=

# Frontend
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_OAUTH_URL=
```

## Développement

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Compte développeur Riot Games

### Installation
```bash
# Installation des dépendances
cd back && npm install
cd front && npm install

# Configuration de la base de données
cd back && npx prisma migrate dev

# Démarrage en développement
cd back && npm run start:dev
cd front && npm run dev
```

## Contribution
- Fork du projet
- Création d'une branche feature
- Commit avec convention
- Pull request avec description 