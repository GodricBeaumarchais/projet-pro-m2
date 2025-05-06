# Stage de build
FROM node:22-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du schéma Prisma
COPY ./src/orm/prisma ./src/orm/prisma/

# Copie du reste du code source
COPY . .

# Génération du client Prisma et build de l'application
RUN npx prisma generate && npm run build

# Stage de développement
FROM node:22-alpine AS development

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de développement
RUN npm install

# Copie du schéma Prisma
COPY ./src/orm/prisma ./src/orm/prisma/

# Génération du client Prisma
RUN npx prisma generate


# Copie du reste du code source
COPY . .

# Exposition des ports
EXPOSE 3000
EXPOSE 5555

# Commande de démarrage en mode développement
CMD ["npm", "run", "start:dev"]

# Stage de production
FROM node:22-alpine AS production

WORKDIR /app

# Copie des fichiers package.json
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Copie du schéma Prisma
COPY ./src/orm/prisma ./src/orm/prisma/

# Génération du client Prisma
RUN npx prisma generate

# Copie des fichiers de build depuis le builder
COPY --from=builder /app/dist ./dist

# Variables d'environnement pour la production
ENV NODE_ENV=production

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "run", "start:prod"] 