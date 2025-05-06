# ORM Rules (Prisma)

## Structure des fichiers

### Emplacement
```
back/src/orm/prisma/
├── schema.prisma        # Schéma de la base de données
├── migrations/         # Dossier des migrations et client généré
├── seed.ts            # Script de seeding
├── services/          # Services Prisma
│   └── user.service.ts  # Service spécifique uniquement pour User
├── prisma-service.service.ts  # Service principal Prisma
└── generique-repo.ts         # Repository générique utilisé directement pour Role
```

## Configuration Prisma

### Schema Configuration
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "./migrations"  // Client généré dans le dossier migrations
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Modèles
```prisma
model User {
  id                String            @id @unique @default(uuid())
  lastName          String
  firstName         String
  email             String            @unique
  riotId            String            @unique
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  role              Role              @relation(fields: [roleId], references: [id])
  roleId            String
}

model Role {
  id          String @id @unique @default(uuid())
  titre       String @unique
  description String
  users       User[]
}
```

## Services

### Generic Repository
- Implémente les opérations CRUD de base
- Utilisé comme classe de base pour les services spécifiques (User)
- Utilisé directement pour les entités simples (Role)
```typescript
export abstract class PrismaGenericRepository<T> {
  protected _client: PrismaClient;
  protected _modelName: string;

  constructor(prismaClient: PrismaClient, modelName: string) {
    this._client = prismaClient;
    this._modelName = modelName;
  }

  // Méthodes CRUD génériques suffisantes pour Role
  async getAll(): Promise<T[]>
  async get(id: string): Promise<T>
  async create(data: T): Promise<T>
  async update(id: string, data: T): Promise<T>
  async delete(id: string): Promise<T>
}
```

### Service Pattern
- Service personnalisé uniquement pour les entités nécessitant une logique métier spécifique
- User nécessite un service dédié pour :
  - Gestion des rôles
  - Recherche par email
  - Logique métier spécifique
  - Sélections personnalisées

Exemple pour UserService :
```typescript
@Injectable()
export class UserService extends PrismaGenericRepository<User> {
    constructor(
        prismaClient: PrismaClient,
        private readonly configService: ConfigService
    ) {
        super(prismaClient, 'user');
    }

    // Méthodes spécifiques aux utilisateurs
    async getByEmail(email: string): Promise<Partial<User>>
    async getByRoleName(roleName: string): Promise<User[]>
    async getUserSafe(id: string): Promise<UserSafe>
    async getSelf(userId: string): Promise<Partial<User>>
    async searchUsersByEmail(searchTerm: string): Promise<UserSafe[]>
}
```

## Migrations et Seeding

### Commandes de Migration
```bash
# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base de données
npx prisma migrate reset
```

### Seeding
- Le seeding est configuré dans `package.json` :
```json
{
  "prisma": {
    "seed": "ts-node src/orm/prisma/seed.ts"
  }
}
```

- Exécution manuelle du seeding :
```bash
npx prisma db seed
```

## Validation des données

### DTOs
- Utilisation de class-validator pour la validation
```typescript
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  riotId: string;

  @IsNotEmpty()
  @IsUUID()
  roleId?: string;
}
```

## Bonnes pratiques

### Gestion des erreurs
1. Utiliser les exceptions NestJS pour la gestion des erreurs
2. Implémenter des try/catch appropriés dans les services
3. Retourner des types précis (éviter any)

### Performance
1. Utiliser les sélections spécifiques dans les requêtes
2. Éviter le N+1 problem avec les includes appropriés
3. Utiliser les transactions pour les opérations multiples

### Sécurité
1. Ne jamais exposer directement les erreurs Prisma
2. Valider toutes les entrées via les DTOs
3. Utiliser les variables d'environnement pour les configurations sensibles

### Maintenance
1. Documenter les changements de schéma
2. Versionner les migrations
3. Tester les migrations avant le déploiement
4. Maintenir les seeds à jour

## Prisma Studio
- Accessible en développement sur `http://localhost:5555`
- Utile pour :
  - Visualiser les données
  - Tester les relations
  - Déboguer les problèmes de données
  - Effectuer des modifications manuelles en développement 