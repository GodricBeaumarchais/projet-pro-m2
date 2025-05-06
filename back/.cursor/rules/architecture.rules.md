# Architecture Rules - Backend NestJS avec Prisma

## Structure Générale
```
src/
├── index.ts                # Export principal du module
├── controllers/           # Points d'entrée de l'API (routes)
│   └── index.ts          # Export des controllers
├── core/                 # Cœur de l'application
│   ├── index.ts         # Export des éléments du core
│   ├── entities/        # Types TypeScript représentant les modèles
│   │   └── index.ts    # Export des entities
│   ├── dtos/           # Objets de validation des données
│   │   └── index.ts    # Export des DTOs
│   └── abstract/       # Classes abstraites pour l'accès aux données
│       └── index.ts    # Export des classes abstraites
├── use-cases/           # Logique métier et conditionnelle
│   ├── index.ts        # Export des use-cases
│   └── [feature]/      # Un dossier par fonctionnalité
│       └── index.ts    # Export des use-cases de la feature
└── orm/                # Configuration et services Prisma
    ├── index.ts        # Export des services Prisma
    └── prisma/        # Client et schémas Prisma
```

## Règles par Couche

### 1. Controllers (Routes)
- Chaque controller doit être décoré avec `@Controller()`
- Les controllers ne doivent contenir que la logique de routage
- Les validations basiques des requêtes doivent utiliser les DTOs
- Les controllers doivent déléguer tout traitement aux use-cases
- Format de nommage: `[feature].controller.ts`

### 2. Core
#### Entities
- Doivent être des types TypeScript purs
- Représentent la structure exacte des données en base
- Pas de logique métier dans les entités
- Format de nommage: `[feature].entity.ts`

#### DTOs
- Doivent utiliser les décorateurs de validation class-validator
- Chaque opération CRUD doit avoir son propre DTO
- Les DTOs doivent être immutables (readonly)
- Format de nommage: `[feature].[operation].dto.ts`

#### Abstract (Repositories)
- Définir les interfaces pour l'accès aux données
- Chaque entité doit avoir sa classe abstraite correspondante
- Les méthodes CRUD de base doivent être définies
- Format de nommage: `abstract.[feature].repository.ts`

### 3. Use-Cases
- Contiennent toute la logique métier
- Transforment les DTOs en entités
- Gèrent les conditions et les règles métier
- Utilisent l'injection de dépendances pour le dataService
- Cas spécial pour l'authentification (pas d'accès direct BDD)
- Format de nommage: `[feature].[operation].use-case.ts`

### 4. ORM/Prisma
- Le dataService doit implémenter les classes abstraites
- Centralise tous les accès à la base de données
- Utilise les transactions quand nécessaire
- Format de nommage: `[feature].prisma.service.ts`

## Organisation des Imports

### Structure des index.ts
- Chaque dossier doit contenir un `index.ts`
- Les index.ts facilitent les imports dans le code
- Format type d'un index.ts:
```typescript
// Exporter les éléments publics
export * from './[feature].entity';
export * from './[feature].dto';
export * from './[feature].repository';

// Re-exporter les sous-dossiers si nécessaire
export * from './sub-feature';
```

### Imports dans le Code
1. Imports externes (NestJS, Prisma, etc.)
2. Imports internes (via index.ts)
3. Imports relatifs au même module

## Bonnes Pratiques

### Injection de Dépendances
- Utiliser le système d'injection de dépendances de NestJS
- Définir les services comme providers dans les modules
- Favoriser l'injection par constructeur

### Gestion des Erreurs
- Utiliser les exceptions NestJS appropriées
- Créer des filtres d'exception personnalisés si nécessaire
- Logger les erreurs de manière appropriée

### Tests
- Chaque composant doit avoir ses tests unitaires
- Les use-cases doivent avoir des tests d'intégration
- Utiliser des mocks pour les dépendances externes

### Documentation
- Utiliser Swagger pour documenter l'API
- Documenter les DTOs avec les décorateurs OpenAPI
- Maintenir une documentation à jour des use-cases

## Conventions de Code

### Nommage
- PascalCase pour les classes et interfaces
- camelCase pour les méthodes et variables
- UPPER_CASE pour les constantes
- kebab-case pour les fichiers

### Organisation des Imports
1. Imports externes (NestJS, Prisma, etc.)
2. Imports internes (par couche)
3. Imports relatifs au même module

### Style de Code
- Utiliser les types stricts TypeScript
- Éviter any
- Utiliser les interfaces pour les contrats
- Préférer les classes abstraites pour les repositories 