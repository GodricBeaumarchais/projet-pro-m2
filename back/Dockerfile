# Stage de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY ./src/orm/prisma/schema.prisma ./src/orm/prisma/

# Installation des dépendances
RUN npm ci

# Copie du reste du code source
COPY . .

# Génération du client Prisma
RUN npx prisma generate

# Build de l'application
RUN npm run build

# Stage de développement
FROM node:18-alpine AS development

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Génération du client Prisma
RUN npx prisma generate

# Exposition du port
EXPOSE 3000

# Commande de démarrage en mode développement
CMD ["npm", "run", "start:dev"]

# Stage de production
FROM node:18-alpine AS production

WORKDIR /app

# Copie des fichiers nécessaires depuis le stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Variables d'environnement pour la production
ENV NODE_ENV=production

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "start:prod"] 