# Guide de Style et Règles de Développement

## 🎨 Système de Design

### Typographie

#### Hiérarchie des Polices
- **Titres Principaux** : Beaufort Bold
  - Utiliser pour les h1, h2, h3
  - Toujours en majuscules
  - Espacement des lettres : 0.05em
  
- **Sous-titres** : Beaufort Medium
  - Utiliser pour les h4, h5, h6
  - Capitalisation standard
  
- **Corps de Texte** : Spiegel Regular
  - Utiliser pour tout le contenu principal
  - Line-height : 1.6
  
- **Code** : Geist Mono
  - Utiliser pour les snippets de code et les valeurs techniques

### Palette de Couleurs

#### Or (Éléments Principaux)
- `--color-gold-100` (#F0E6D2) : Texte clair, accents lumineux
- `--color-gold-200` (#C8AA6E) : Titres, éléments importants
- `--color-gold-300` (#C8AA6E) : Bordures actives, hover states
- `--color-gold-400` (#C89B3C) : Boutons primaires
- `--color-gold-500` (#785A28) : Bordures, accents
- `--color-gold-600` (#463714) : Éléments décoratifs
- `--color-gold-700` (#32281E) : Ombres, arrière-plans profonds

#### Hextech (Éléments Secondaires)
- `--color-hextech-100` (#CDFAFA) : Texte sur fond sombre
- `--color-hextech-200` (#0AC8B9) : Accents lumineux
- `--color-hextech-300` (#0397AB) : Éléments interactifs
- `--color-hextech-400` (#005A82) : Boutons secondaires
- `--color-hextech-500` (#0A323C) : Arrière-plans de composants
- `--color-hextech-600` (#091428) : Arrière-plan principal
- `--color-hextech-700` (#0A1428) : Arrière-plan profond

## 💻 Règles de Développement

### Structure des Composants

1. **Organisation des Fichiers**
   ```
   components/
   ├── common/         # Composants réutilisables
   ├── layout/         # Composants de mise en page
   ├── features/       # Composants spécifiques aux fonctionnalités
   └── ui/            # Composants d'interface utilisateur
   ```

2. **Conventions de Nommage**
   - Composants : PascalCase (ex: `ButtonPrimary.tsx`)
   - Fichiers de style : kebab-case (ex: `button-styles.css`)
   - Classes utilitaires : kebab-case (ex: `text-gold`)

### Bonnes Pratiques CSS

1. **Utilisation des Variables**
   - Toujours utiliser les variables CSS définies
   - Ne pas utiliser de valeurs hexadécimales directement
   - Préfixer les nouvelles variables avec le contexte approprié

2. **Classes Utilitaires**
   - Créer des classes réutilisables pour les styles communs
   - Suivre le format : `[propriété]-[valeur]`
   - Exemple : `text-gold`, `bg-dark`

3. **Composants**
   - Utiliser des classes BEM pour les composants complexes
   - Structure : `bloc__element--modificateur`
   - Exemple : `card__header--highlighted`

### Interactions et Animations

1. **Transitions**
   - Durée standard : 0.3s
   - Timing function : ease
   - Propriétés à animer : all (pour les interactions simples)

2. **États des Éléments**
   - Hover : Changement subtil de couleur/luminosité
   - Focus : Bordure dorée + outline hextech
   - Active : Augmentation du contraste

## 📱 Responsive Design

### Breakpoints
```css
--mobile: 320px
--tablet: 768px
--desktop: 1024px
--large-desktop: 1440px
```

### Principes
1. Mobile-first approach
2. Utilisation des unités relatives (rem, em, %)
3. Flexbox et Grid pour les layouts
4. Media queries basées sur les breakpoints définis

## 🔍 Accessibilité

1. **Contraste**
   - Ratio minimum de 4.5:1 pour le texte normal
   - Ratio minimum de 3:1 pour le texte large
   - Utiliser les couleurs gold sur hextech pour un contraste optimal

2. **Navigation**
   - Support complet du clavier
   - États focus visibles
   - ARIA labels sur les éléments interactifs

## 🚀 Performance

1. **Images**
   - Formats optimisés (WebP avec fallbacks)
   - Lazy loading pour les images hors viewport
   - Utilisation appropriée des srcset

2. **CSS**
   - Éviter les sélecteurs trop profonds
   - Grouper les media queries
   - Minimiser l'utilisation des !important

## 📝 Documentation

1. **Commentaires**
   - Documenter les composants complexes
   - Expliquer les décisions de design importantes
   - Maintenir une documentation à jour des composants

2. **Storybook**
   - Créer des stories pour chaque composant
   - Documenter les variantes et les props
   - Inclure des exemples d'utilisation 