# Règles de Tests

## Structure des Tests

### Organisation
```
tests/
├── unit/              # Tests unitaires
│   ├── controllers/   # Tests des controllers
│   ├── use-cases/     # Tests des use-cases
│   └── services/      # Tests des services
├── integration/       # Tests d'intégration
└── e2e/              # Tests end-to-end
```

## Tests Unitaires

### Controllers
- Tester chaque route individuellement
- Mocker les use-cases
- Vérifier les codes de retour HTTP
- Tester les validations de DTO
- Tester les cas d'erreur

### Use-Cases
- Tester chaque cas d'utilisation isolément
- Mocker les dépendances (repositories, services)
- Tester les transformations DTO -> Entity
- Vérifier la logique conditionnelle
- Tester les cas d'erreur métier

### Services
- Tester les méthodes CRUD
- Mocker Prisma Client
- Vérifier les transactions
- Tester la gestion des erreurs

## Tests d'Intégration

### Configuration
- Utiliser une base de données de test
- Réinitialiser les données entre les tests
- Configurer les variables d'environnement de test

### Scénarios
- Tester les flux complets
- Vérifier les interactions entre composants
- Tester les migrations
- Valider les performances

## Tests E2E

### API
- Tester les endpoints publics
- Vérifier l'authentification
- Tester les limites de rate
- Valider les réponses complètes

### Performance
- Tester la charge
- Vérifier les temps de réponse
- Tester les limites de connexions
- Valider le comportement sous stress

## Bonnes Pratiques

### Nommage
- Descriptions claires des tests
- Grouper les tests logiquement
- Utiliser le format "should_do_something"

### Organisation du Code
```typescript
describe('EntityService', () => {
  describe('create', () => {
    it('should create entity with valid data', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should throw error with invalid data', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Mocking
- Créer des factories pour les données de test
- Utiliser des helpers de test réutilisables
- Maintenir des mocks cohérents
- Documenter les mocks complexes

### Coverage
- Viser une couverture > 80%
- Couvrir les cas limites
- Tester les cas d'erreur
- Documenter les parties non testées

## Outils

### Jest
- Utiliser les matchers appropriés
- Configurer les timeouts correctement
- Utiliser les hooks beforeEach/afterEach
- Implémenter des matchers personnalisés si nécessaire

### Supertest
- Tester les requêtes HTTP
- Vérifier les headers
- Valider le format des réponses
- Tester les uploads de fichiers

## CI/CD

### Pipeline
- Exécuter les tests automatiquement
- Vérifier la couverture
- Bloquer le merge si tests échouent
- Générer des rapports de test

### Maintenance
- Nettoyer les tests obsolètes
- Mettre à jour les mocks
- Optimiser les tests lents
- Documenter les changements majeurs 