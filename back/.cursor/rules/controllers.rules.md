# Règles des Controllers

## Structure Générale
```
src/controllers/
├── index.ts                # Export de tous les controllers
├── base.controller.ts      # Controller de base avec méthodes communes
├── [feature].controller.ts # Un controller par fonctionnalité
└── app.controller.ts       # Controller principal de l'application
```

## Implémentation Type

### Controller de Base
```typescript
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export abstract class BaseController<T> {
  constructor(
    protected readonly useCase: BaseUseCase<T>,
    protected readonly logger: Logger
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async findAll(): Promise<T[]> {
    return this.useCase.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async findOne(@Param('id') id: string): Promise<T> {
    return this.useCase.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async create(@Body() dto: any): Promise<T> {
    return this.useCase.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: any
  ): Promise<T> {
    return this.useCase.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.useCase.delete(id);
  }
}
```

### Controller Spécifique (Exemple: Rôles)
```typescript
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)  // Restriction globale au SUPERADMIN
export class RoleController extends BaseController<RoleEntity> {
  constructor(
    private readonly roleUseCase: RoleUseCase,
    private readonly logger: Logger
  ) {
    super(roleUseCase, logger);
  }

  // Surcharge des méthodes si nécessaire
  @Post('assign')
  async assignRole(
    @Body() dto: AssignRoleDTO
  ): Promise<void> {
    return this.roleUseCase.assignRole(dto);
  }
}
```

### Controller avec Accès Mixte
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController extends BaseController<UserEntity> {
  constructor(
    private readonly userUseCase: UserUseCase,
    private readonly logger: Logger
  ) {
    super(userUseCase, logger);
  }

  // Route publique (nécessite juste authentification)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@User() user: UserEntity) {
    return this.userUseCase.findOne(user.id);
  }

  // Route admin uniquement
  @Post('bulk-create')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async bulkCreate(@Body() dtos: CreateUserDTO[]): Promise<UserEntity[]> {
    return this.userUseCase.bulkCreate(dtos);
  }

  // Route super admin uniquement
  @Post('assign-role')
  @Roles(UserRole.SUPERADMIN)
  async assignRole(@Body() dto: AssignRoleDTO): Promise<void> {
    return this.userUseCase.assignRole(dto);
  }
}
```

### Export des Controllers (index.ts)
```typescript
export * from './base.controller';
export * from './user.controller';
export * from './role.controller';
export * from './app.controller';
```

## Décorateurs à Utiliser

### Authentification et Autorisation
```typescript
// Protection globale du controller
@UseGuards(JwtAuthGuard, RolesGuard)

// Définition des rôles autorisés
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)

// Accès à l'utilisateur connecté
@User() user: UserEntity
```

### Validation et Transformation
```typescript
// Validation du corps de la requête
@Body() dto: CreateUserDTO

// Validation des paramètres
@Param('id') id: string

// Transformation de la réponse
@UseInterceptors(TransformInterceptor)
```

## Bonnes Pratiques

### Nommage
- Utiliser le suffixe `.controller.ts` pour tous les fichiers de controllers
- Nommer les controllers de manière explicite (ex: `user.controller.ts`)
- Utiliser des noms au singulier pour les controllers
- Préfixer les routes de manière cohérente

### Sécurité
- Toujours appliquer les guards au niveau du controller
- Définir les rôles requis pour chaque route
- Valider les entrées avec des DTOs
- Logger les actions importantes

### Organisation
- Hériter du BaseController pour les opérations CRUD standard
- Surcharger les méthodes si nécessaire
- Grouper les routes par niveau d'accès
- Documenter les permissions requises

### Gestion des Erreurs
- Utiliser les exceptions NestJS appropriées
- Transformer les erreurs métier en réponses HTTP
- Logger les erreurs avec contexte
- Retourner des messages d'erreur clairs

### Documentation
```typescript
@ApiTags('users')
@ApiSecurity('jwt')
@Controller('users')
export class UserController {
  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé' })
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async create(@Body() dto: CreateUserDTO): Promise<UserEntity> {
    return this.userUseCase.create(dto);
  }
}
``` 