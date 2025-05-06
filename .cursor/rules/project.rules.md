# Règles Globales du Projet

## Objectif du Projet
League of Legends Lobby Tracker est une plateforme permettant aux joueurs de :
- Créer des pages de suivi personnalisées pour des groupes de joueurs
- Suivre l'évolution des rangs et performances en temps réel
- Partager des lobbies publics avec la communauté
- Analyser les tendances de progression des joueurs

## Principes Fondamentaux

### 1. Expérience Utilisateur
- Interface intuitive et réactive
- Temps de chargement minimal
- Mises à jour en temps réel
- Design adapté à l'univers LoL

### 2. Performance
- Cache optimisé (Redis)
- Requêtes API minimisées
- Chargement progressif des données
- Optimisation des ressources

### 3. Fiabilité
- Données toujours à jour
- Gestion robuste des erreurs
- Système de fallback
- Monitoring constant

### 4. Sécurité
- Authentification OAuth2
- Protection des données sensibles
- Rate limiting
- Validation des entrées

## Stack Technique

### Backend
- NestJS (Node.js)
- Prisma (ORM)
- PostgreSQL (Base de données)
- Redis (Cache)

### Frontend
- Next.js 14
- Tailwind CSS
- React Query
- TypeScript

### Infrastructure
- Vercel (Frontend)
- VPS (Backend)
- PostgreSQL hébergé
- Redis Cloud

## Conventions Globales

### 1. Code
- TypeScript strict
- ESLint + Prettier
- Tests unitaires obligatoires
- Documentation JSDoc

### 2. Git
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
perf: amélioration des performances
test: ajout de tests
chore: maintenance
```

### 3. Documentation
- README à jour
- Documentation API (Swagger)
- Commentaires de code pertinents
- Guides de contribution

### 4. Tests
- Coverage minimum : 80%
- Tests E2E critiques
- Tests d'intégration
- Tests de performance

## Workflow de Développement

### 1. Création de Feature
1. Créer une branche feature/
2. Développer avec tests
3. Documenter les changements
4. Créer une PR

### 2. Review Process
1. Vérification automatique (CI)
2. Review de code
3. Tests de non-régression
4. Merge si approuvé

### 3. Déploiement
1. Déploiement staging
2. Tests automatisés
3. Validation manuelle
4. Déploiement production

## Standards de Qualité

### 1. Performance
- Temps de chargement < 2s
- Time to Interactive < 3s
- Score Lighthouse > 90
- Optimisation des assets

### 2. Accessibilité
- Score WCAG AA
- Navigation clavier
- Support lecteur d'écran
- Contraste suffisant

### 3. Sécurité
- HTTPS obligatoire
- Headers sécurisés
- Sanitization des entrées
- Audit régulier

### 4. Maintenance
- Mises à jour dépendances
- Nettoyage du code mort
- Optimisation régulière
- Monitoring des erreurs

## Environnements

### 1. Développement
- Variables d'environnement définies dans `docker-compose.yml`
- Pas de fichier `.env` nécessaire
- Configuration complète dans la section `environment` du service `api-dev`
- Hot reload activé
- Outils de debug :
  - Prisma Studio (http://localhost:5555)
  - Logs Docker en temps réel
  - Base de données accessible localement

### 2. Staging
- `.env.staging` pour les variables d'environnement
- Données de test
- Monitoring complet
- Tests automatisés

### 3. Production
- `.env.production` pour les variables d'environnement
- Données réelles
- Logs détaillés
- Backup automatique

## Variables d'Environnement par Environnement

### Développement (docker-compose.yml)
```yaml
environment:
  # Base de données
  - DATABASE_URL=postgresql://user:password@postgres:5432/mydb
  
  # Rôles
  - ROLE_ADMIN_UUID=550e8400-e29b-41d4-a716-446655440000
  - ROLE_SUPERADMIN_UUID=6ba7b810-9dad-11d1-80b4-00c04fd430c8
  - ROLE_DEFAULT_UUID=7ba7b810-9dad-11d1-80b4-00c04fd430c9
  
  # JWT et Auth
  - JWT_SECRET=votre_jwt_secret_tres_long_et_complexe
  - JWT_EXPIRATION=3600
  - RIOT_CLIENT_ID=votre_riot_client_id
  - RIOT_CLIENT_SECRET=votre_riot_client_secret
  - RIOT_REDIRECT_URI=http://localhost:3000/auth/riot/callback
```

## Métriques de Succès

### 1. Techniques
- Uptime > 99.9%
- Temps de réponse < 200ms
- Erreurs 5xx < 0.1%
- Coverage > 80%

### 2. Utilisateur
- Temps de session > 5min
- Taux de retour > 50%
- Satisfaction > 4/5
- Croissance utilisateurs 