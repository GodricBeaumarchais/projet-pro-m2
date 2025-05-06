import { PrismaClient } from "../../../generated";

const prisma = new PrismaClient();

// Récupération des UUIDs depuis les variables d'environnement
const ROLE_ADMIN_UUID = process.env.ROLE_ADMIN_UUID;
const ROLE_SUPERADMIN_UUID = process.env.ROLE_SUPERADMIN_UUID;
const ROLE_DEFAULT_UUID = process.env.ROLE_DEFAULT_UUID;

// Vérification de la présence des variables d'environnement
if (!ROLE_ADMIN_UUID || !ROLE_SUPERADMIN_UUID || !ROLE_DEFAULT_UUID) {
  throw new Error('Les UUIDs des rôles doivent être définis dans les variables d\'environnement');
}

async function main() {
  // Création du rôle ADMIN
  await prisma.role.upsert({
    where: { id: ROLE_ADMIN_UUID },
    update: {},
    create: {
      id: ROLE_ADMIN_UUID,
      titre: 'ADMIN',
      description: 'Administrateur avec accès complet à la gestion des utilisateurs et des contenus'
    },
  });

  // Création du rôle SUPERADMIN
  await prisma.role.upsert({
    where: { id: ROLE_SUPERADMIN_UUID },
    update: {},
    create: {
      id: ROLE_SUPERADMIN_UUID,
      titre: 'SUPERADMIN',
      description: 'Super administrateur avec accès total au système et aux configurations avancées'
    },
  });

  // Création du rôle DEFAULT
  await prisma.role.upsert({
    where: { id: ROLE_DEFAULT_UUID },
    update: {},
    create: {
      id: ROLE_DEFAULT_UUID,
      titre: 'DEFAULT',
      description: 'Utilisateur standard avec accès limité aux fonctionnalités de base'
    },
  });

  console.log('Base de données initialisée avec les rôles par défaut');
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'initialisation des rôles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 