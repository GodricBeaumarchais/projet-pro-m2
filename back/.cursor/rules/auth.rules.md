# Règles d'Authentification et d'Autorisation

## Structure des Décorateurs et Guards
```
src/use-cases/auth/
├── decorator/
│   ├── roles.decorator.ts    # Décorateur pour définir les rôles requis
│   └── user.decorator.ts     # Décorateur pour extraire l'utilisateur de la requête
├── guard/
│   ├── jwt-auth.guard.ts     # Guard pour vérifier le JWT
│   └── roles.guard.ts        # Guard pour vérifier les rôles
└── strategy/                 # Stratégies d'authentification
```

## Utilisation dans les Controllers

### Sécurisation Globale des Routes CRUD

#### Routes Administrateur
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)  // Protection globale du controller
export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  // Accessible aux ADMIN et SUPERADMIN
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async findAll(): Promise<UserEntity[]> {
    return this.userUseCase.findAll();
  }

  // Accessible aux ADMIN et SUPERADMIN
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async create(@Body() dto: CreateUserDTO): Promise<UserEntity> {
    return this.userUseCase.create(dto);
  }

  // Accessible aux ADMIN et SUPERADMIN
  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO
  ): Promise<UserEntity> {
    return this.userUseCase.update(id, dto);
  }

  // Accessible aux ADMIN et SUPERADMIN
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.userUseCase.delete(id);
  }
}
```

#### Routes Rôles (SUPERADMIN uniquement)
```typescript
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleUseCase: RoleUseCase) {}

  // Accessible uniquement au SUPERADMIN
  @Get()
  @Roles(UserRole.SUPERADMIN)
  async findAll(): Promise<RoleEntity[]> {
    return this.roleUseCase.findAll();
  }

  // Accessible uniquement au SUPERADMIN
  @Post()
  @Roles(UserRole.SUPERADMIN)
  async create(@Body() dto: CreateRoleDTO): Promise<RoleEntity> {
    return this.roleUseCase.create(dto);
  }

  // Accessible uniquement au SUPERADMIN
  @Put(':id')
  @Roles(UserRole.SUPERADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDTO
  ): Promise<RoleEntity> {
    return this.roleUseCase.update(id, dto);
  }

  // Accessible uniquement au SUPERADMIN
  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return this.roleUseCase.delete(id);
  }
}
```

### Accès à l'Utilisateur Connecté
```typescript
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly userUseCase: UserUseCase) {}

  @Get()
  async getProfile(@User() user: UserEntity) {
    return this.userUseCase.findOne(user.id);
  }

  @Put()
  async updateProfile(
    @User() user: UserEntity,
    @Body() dto: UpdateProfileDTO
  ) {
    return this.userUseCase.updateProfile(user.id, dto);
  }
}
```

## Configuration des Guards

### JWT Guard
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid token or session expired');
    }
    return user;
  }
}
```

### Roles Guard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

## Bonnes Pratiques

### Sécurité
- Toujours combiner `JwtAuthGuard` et `RolesGuard` pour les routes protégées
- Utiliser les décorateurs au niveau du controller pour une protection globale
- Surcharger les décorateurs au niveau des méthodes si nécessaire
- Vérifier les permissions avant d'accéder aux ressources

### Gestion des Rôles
- SUPERADMIN a accès à toutes les routes
- ADMIN a accès à toutes les routes CRUD sauf la gestion des rôles
- Utiliser des constantes pour les rôles :
```typescript
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}
```

### Validation
- Valider le JWT à chaque requête
- Vérifier la validité des rôles
- Gérer les erreurs d'authentification
- Logger les tentatives d'accès non autorisées

### Organisation du Code
- Regrouper les routes par niveau d'accès
- Utiliser des préfixes de route explicites
- Documenter les niveaux d'accès requis
- Centraliser la logique d'autorisation dans les guards 