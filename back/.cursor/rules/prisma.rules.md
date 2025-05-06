# Règles Prisma

## Structure du Schema

### Modèles
- Utiliser le PascalCase pour les noms de modèles
- Chaque modèle doit avoir un champ `id` unique
- Définir les relations explicitement des deux côtés
- Utiliser des énumérations pour les valeurs fixes
- Commenter les champs complexes

### Relations
- Nommer les relations de manière explicite
- Utiliser les cardinalités appropriées (1-1, 1-n, n-n)
- Définir les comportements onDelete/onUpdate
- Éviter les relations circulaires si possible

## DataService

### Structure
```typescript
abstract class DataService {
  constructor(protected readonly prisma: PrismaClient) {}
  
  // Méthodes abstraites CRUD
  abstract create(data: CreateDTO): Promise<Entity>;
  abstract findOne(id: string): Promise<Entity | null>;
  abstract findMany(params: QueryParams): Promise<Entity[]>;
  abstract update(id: string, data: UpdateDTO): Promise<Entity>;
  abstract delete(id: string): Promise<void>;
}
```

### Transactions
- Utiliser `prisma.$transaction` pour les opérations multiples
- Gérer les rollbacks en cas d'erreur
- Définir un timeout approprié pour les transactions

### Requêtes
- Utiliser les méthodes de filtrage Prisma
- Optimiser les includes/select pour éviter l'over-fetching
- Paginer les résultats pour les grandes collections
- Utiliser les index appropriés

## Migrations

### Gestion
- Une migration par changement fonctionnel
- Nommer les migrations de manière descriptive
- Tester les migrations avant le déploiement
- Prévoir les rollbacks

### Bonnes Pratiques
- Versionner les migrations
- Ne jamais modifier une migration existante
- Documenter les changements breaking
- Sauvegarder les données sensibles avant migration

## Performance

### Optimisation
- Utiliser les index judicieusement
- Éviter les requêtes N+1
- Utiliser les requêtes batch quand possible
- Monitorer les performances des requêtes

### Caching
- Mettre en cache les requêtes fréquentes
- Invalider le cache de manière appropriée
- Utiliser Redis pour le caching distribué

## Sécurité

### Données Sensibles
- Ne pas exposer les données sensibles
- Utiliser le chiffrement quand nécessaire
- Définir des politiques d'accès strictes

### Validation
- Valider toutes les entrées utilisateur
- Utiliser les contraintes du schema
- Implémenter des hooks de validation

## Environnement

### Configuration
- Utiliser les variables d'environnement
- Séparer les configurations par environnement
- Ne pas commiter les credentials

### Logging
- Logger les opérations critiques
- Utiliser les niveaux de log appropriés
- Implémenter un système de monitoring 