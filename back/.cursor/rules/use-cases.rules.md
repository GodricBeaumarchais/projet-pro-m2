# Structure des Use-Cases

## Organisation Générale
```
src/
└── use-cases/
    ├── index.ts                 # Export de tous les use-cases
    ├── auth/                    # Cas spécial pour l'authentification
    │   ├── index.ts            # Export des use-cases d'auth
    │   ├── login.use-case.ts
    │   └── register.use-case.ts
    └── [feature]/              # Dossier par fonctionnalité
        ├── index.ts            # Export des use-cases de la feature
        ├── [feature].module.ts # Module de la feature
        ├── [feature].use-case.ts # Use-cases de la feature
        └── [feature]-factory.service.ts # Factory pour la feature
```

## Structure d'un Use-Case Type (CRUD)

### Module Configuration
```typescript
@Module({
  imports: [PrismaModule],
  providers: [
    UserPrismaService,    // Service Prisma spécifique
    UserFactoryService,   // Factory pour la transformation des données
    UserUseCase          // Use-case principal
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

### Use-Case Principal
```typescript
@Injectable()
export class UserUseCase {
  constructor(
    private readonly prismaService: UserPrismaService,
    private readonly factory: UserFactoryService,
    private readonly logger: Logger
  ) {}

  async create(dto: CreateUserDTO): Promise<UserEntity> {
    try {
      // 1. Validation métier si nécessaire
      await this.validateBusinessRules(dto);

      // 2. Transformation DTO -> Entity via Factory
      const userEntity = this.factory.createEntity(dto);

      // 3. Appel au service Prisma
      const createdUser = await this.prismaService.create(userEntity);

      // 4. Log du succès
      this.logger.log(`User created successfully: ${createdUser.id}`);

      return createdUser;
    } catch (error) {
      // 5. Gestion des erreurs
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new ApplicationError('CREATE_USER_FAILED', error.message);
    }
  }

  async update(id: string, dto: UpdateUserDTO): Promise<UserEntity> {
    try {
      // 1. Vérifier l'existence
      const existingUser = await this.prismaService.findOne(id);
      if (!existingUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // 2. Validation métier si nécessaire
      await this.validateBusinessRules(dto);

      // 3. Transformation via Factory
      const updatedEntity = this.factory.updateEntity(existingUser, dto);

      // 4. Mise à jour via Prisma
      const updatedUser = await this.prismaService.update(id, updatedEntity);

      // 5. Log du succès
      this.logger.log(`User updated successfully: ${id}`);

      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw new ApplicationError('UPDATE_USER_FAILED', error.message);
    }
  }

  private async validateBusinessRules(dto: CreateUserDTO | UpdateUserDTO): Promise<void> {
    // Règles métier spécifiques
  }
}
```

## Cas Spécial : Use-Cases d'Authentification

### Particularités
- Ne gère pas d'accès direct à la base de données
- Utilise des services spécialisés (JWT, Hash, etc.)
- Focus sur la sécurité et la validation

### Exemple Structure Auth
```typescript
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userDataService: UserDataService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly logger: Logger
  ) {}

  async execute(dto: LoginDTO): Promise<AuthResponse> {
    try {
      // 1. Validation des credentials
      const user = await this.userDataService.findByEmail(dto.email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      // 2. Vérification du mot de passe
      const isValid = await this.hashService.compare(dto.password, user.password);
      if (!isValid) throw new UnauthorizedException('Invalid credentials');

      // 3. Génération du token
      const token = await this.jwtService.sign({
        userId: user.id,
        role: user.role
      });

      // 4. Log de la connexion
      this.logger.log(`User logged in successfully: ${user.id}`);

      return {
        token,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw new AuthenticationError('LOGIN_FAILED', error.message);
    }
  }

  private sanitizeUser(user: UserEntity): SafeUser {
    // Retirer les données sensibles
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
```

## Bonnes Pratiques

### Utilisation de l'ORM
- Toujours utiliser le service Prisma spécifique à l'entité
- Ne jamais utiliser PrismaService directement dans les use-cases
- Utiliser les factories pour la transformation des données
- Gérer les transactions via le service Prisma

### Gestion des Erreurs
- Capturer et transformer les erreurs Prisma
- Logger les erreurs avec le contexte approprié
- Utiliser des classes d'erreur personnalisées
- Gérer les cas d'erreur spécifiques à l'ORM

### Validation
- Valider les règles métier avant l'accès aux données
- Utiliser les DTOs pour la validation des données
- Vérifier les contraintes uniques via Prisma
- Valider les relations entre entités

### Tests
- Mocker le service Prisma spécifique
- Tester les transformations via Factory
- Vérifier la gestion des erreurs Prisma
- Tester les transactions

### Organisation du Code
```typescript
// 1. Imports NestJS
import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'winston';

// 2. Imports des types et DTOs
import { CreateUserDTO, UpdateUserDTO, UserEntity } from '@core/dtos';
import { ApplicationError } from '@core/errors';

// 3. Imports des services
import { UserPrismaService } from '@orm/prisma/services';
import { UserFactoryService } from './user-factory.service';
```

### Organisation des Imports
```typescript
// 1. Imports externes
import { Injectable } from '@nestjs/common';
import { Logger } from 'winston';

// 2. Imports des types et interfaces
import { CreateUserDTO, UserEntity } from '@core/dtos';
import { ApplicationError } from '@core/errors';

// 3. Imports des services
import { UserDataService } from '@core/abstract';
```

### Gestion des Erreurs
- Utiliser des classes d'erreur personnalisées
- Logger les erreurs avec le bon niveau
- Fournir des messages d'erreur explicites
- Gérer les cas d'erreur spécifiques

### Validation
- Valider les règles métier avant l'accès aux données
- Séparer la validation technique (DTO) de la validation métier
- Centraliser les règles de validation communes

### Tests
- Tester chaque branche de la logique conditionnelle
- Mocker les dépendances externes
- Tester les cas d'erreur
- Vérifier les transformations de données 