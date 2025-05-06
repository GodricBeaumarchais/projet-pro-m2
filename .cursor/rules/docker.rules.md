# Docker Development Rules

## Configuration de l'environnement

### Variables d'environnement
Les variables d'environnement sont définies directement dans le `docker-compose.yml` pour le développement :

```yaml
environment:
  # Configuration de l'environnement
  - NODE_ENV=development
  - DATABASE_URL=postgresql://user:password@postgres:5432/mydb
  
  # Configuration des rôles
  - ROLE_ADMIN_UUID=550e8400-e29b-41d4-a716-446655440000
  - ROLE_SUPERADMIN_UUID=6ba7b810-9dad-11d1-80b4-00c04fd430c8
  - ROLE_DEFAULT_UUID=7ba7b810-9dad-11d1-80b4-00c04fd430c9
  
  # Configuration de l'authentification
  - JWT_SECRET=votre_jwt_secret_tres_long_et_complexe
  - JWT_EXPIRATION=3600
  - RIOT_CLIENT_ID=votre_riot_client_id
  - RIOT_CLIENT_SECRET=votre_riot_client_secret
  - RIOT_REDIRECT_URI=http://localhost:3000/auth/riot/callback
```

**Important** : Ne pas utiliser de fichier `.env` en développement, toutes les variables sont dans le `docker-compose.yml`

### Méthode de développement
1. Lancer uniquement les services nécessaires :
```bash
# Arrêter tous les conteneurs existants
docker compose down

# Lancer l'environnement de développement
docker compose up -d --build api-dev postgres
```

2. Vérifier les logs :
```bash
# Voir les logs en temps réel
docker compose logs -f api-dev
```

3. Accès aux outils de développement :
- API : http://localhost:3000
- Prisma Studio : http://localhost:5555
- Base de données : postgresql://user:password@localhost:5432/mydb

4. Hot Reload :
- Le code est monté en volume (`./back:/app`)
- Les modifications sont prises en compte automatiquement
- Les node_modules sont préservés (`/app/node_modules`)

5. Base de données :
- Les migrations sont exécutées au démarrage
- Le seeding est automatique
- Prisma Studio permet de visualiser/modifier les données

### Terminal
- Utiliser **Command Prompt** (cmd.exe) au lieu de PowerShell
- Configuration dans `.vscode/settings.json` :
```json
{
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "terminal.integrated.shell.windows": "C:\\Windows\\System32\\cmd.exe",
    "terminal.integrated.profiles.windows": {
        "Command Prompt": {
            "path": "C:\\Windows\\System32\\cmd.exe",
            "args": [],
            "icon": "terminal-cmd"
        }
    },
    "terminal.integrated.automationShell.windows": "C:\\Windows\\System32\\cmd.exe"
}
```

### Structure du projet
- Backend (NestJS) dans le dossier `back/`
- Base de données PostgreSQL dans un conteneur Docker
- Prisma comme ORM
  - Schéma : `back/src/orm/prisma/schema.prisma`
  - Migrations : `back/src/orm/prisma/migrations`
  - Client généré : `back/src/orm/prisma/migrations`

## Commandes Docker

### Gestion des conteneurs
```bash
# Voir les conteneurs en cours d'exécution
docker compose ps

# Arrêter les conteneurs
docker compose down

# Redémarrer un service spécifique
docker compose restart api-dev
```

## Base de données

### Initialisation
- La base de données est initialisée automatiquement au démarrage
- Les migrations Prisma sont exécutées via la commande dans docker-compose.yml :
  ```bash
  npx prisma migrate deploy && npx prisma db seed && npx prisma studio
  ```

### Accès
- Base de données : `postgresql://user:password@localhost:5432/mydb`
- Prisma Studio : `http://localhost:5555`

### Rôles par défaut
Les UUIDs des rôles sont définis dans les variables d'environnement du docker-compose.yml

## Structure du code

### Modèle User
```