# Architecture ORM avec Prisma

## Structure du Module ORM
```
src/orm/
├── index.ts                    # Export des services et configurations
└── prisma/
    ├── schema.prisma          # Schéma de la base de données
    ├── migrations/            # Migrations de la base de données
    ├── prisma-module.module.ts # Module NestJS pour Prisma
    ├── prisma-service.service.ts # Service principal Prisma
    ├── generique-repo.ts      # Repository générique réutilisable
    └── services/             # Services spécifiques par entité
        ├── index.ts          # Export des services
        └── [entity].service.ts # Service spécifique par entité
```

## Architecture des Services

### Service Prisma Principal
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty'
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Repository Générique
```typescript
export abstract class GenericRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly entityName: string
  ) {}

  async create(data: T): Promise<T> {
    return this.prisma[this.entityName].create({ data });
  }

  async findOne(id: string): Promise<T | null> {
    return this.prisma[this.entityName].findUnique({ where: { id } });
  }

  // ... autres méthodes CRUD génériques
}
```

### Services Spécifiques aux Entités
```typescript
@Injectable()
export class UserPrismaService extends GenericRepository<User> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  // Méthodes spécifiques aux utilisateurs
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

## Utilisation dans les Use-Cases

### Configuration du Module
```typescript
@Module({
  imports: [PrismaModule],
  providers: [
    UserPrismaService,
    UserUseCase,
    UserFactoryService
  ],
  exports: [UserUseCase]
})
export class UserModule {}
```

### Factory Service
```typescript
@Injectable()
export class UserFactoryService {
  createEntity(dto: CreateUserDTO): UserEntity {
    return {
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  updateEntity(entity: UserEntity, dto: UpdateUserDTO): UserEntity {
    return {
      ...entity,
      ...dto,
      updatedAt: new Date()
    };
  }
}
```

### Use-Case avec ORM
```typescript
@Injectable()
export class UserUseCase {
  constructor(
    private readonly prismaService: UserPrismaService,
    private readonly factory: UserFactoryService
  ) {}

  async create(dto: CreateUserDTO): Promise<UserEntity> {
    const entity = this.factory.createEntity(dto);
    return this.prismaService.create(entity);
  }

  async update(id: string, dto: UpdateUserDTO): Promise<UserEntity> {
    const existingUser = await this.prismaService.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedEntity = this.factory.updateEntity(existingUser, dto);
    return this.prismaService.update(id, updatedEntity);
  }
}
```

## Bonnes Pratiques

### Transactions
- Utiliser le service Prisma pour les transactions
- Gérer les rollbacks automatiquement
- Définir un timeout approprié

```typescript
async transferMoney(from: string, to: string, amount: number) {
  return this.prisma.$transaction(async (tx) => {
    await tx.account.update({
      where: { id: from },
      data: { balance: { decrement: amount } }
    });
    await tx.account.update({
      where: { id: to },
      data: { balance: { increment: amount } }
    });
  });
}
```

### Gestion des Relations
- Utiliser include pour les relations nécessaires
- Éviter le N+1 problem
- Optimiser les requêtes

```typescript
async getUserWithPosts(id: string) {
  return this.prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      }
    }
  });
}
```

### Sécurité
- Ne jamais exposer directement le client Prisma
- Valider les entrées avant les requêtes
- Utiliser des transactions pour les opérations critiques
- Gérer correctement les erreurs Prisma

### Performance
- Utiliser les bonnes méthodes de requête
- Paginer les résultats volumineux
- Indexer les champs fréquemment utilisés
- Monitorer les performances des requêtes 