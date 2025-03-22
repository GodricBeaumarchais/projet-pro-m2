# Étape 1: Build
# Utilisation d'une image de base avec Node.js pour la construction
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2: Production
# Utilisation d'une image de base légère pour l'exécution de l'application
FROM node:18-alpine AS runner

# Définir le répertoire de travail pour l'étape de production
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Exposer le port de l'application
EXPOSE 3000

# Définir la commande de démarrage de l'application
CMD ["npm", "start"]
