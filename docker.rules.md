# Règles Docker pour le Développement

## Lancement de l'Environnement de Développement

Pour le développement, nous utilisons uniquement deux services :
- `postgres` (base de données)
- `api-dev` (API en mode développement)

### Commande de lancement

```bash
# Lancer uniquement les services nécessaires en mode détaché (-d)
docker compose up -d postgres api-dev
```

### Commandes utiles

```bash
# Arrêter tous les conteneurs
docker compose down

# Voir les logs en temps réel
docker compose logs -f api-dev

# Redémarrer le service api-dev
docker compose restart api-dev

# Accéder au shell du conteneur api-dev
docker compose exec api-dev sh
```

## Gestion de Prisma

En cas d'erreur avec Prisma, suivre ces étapes dans l'ordre :

1. Générer le client Prisma :
```bash
docker compose exec api-dev npx prisma generate
```

2. Appliquer les migrations :
```bash
docker compose exec api-dev npx prisma migrate deploy
```

3. Lancer le seed si nécessaire :
```bash
docker compose exec api-dev npx prisma db seed
```

4. En cas d'erreur persistante, réinitialiser la base de données :
```bash
# Supprimer les conteneurs et volumes
docker compose down -v

# Relancer les services
docker compose up -d postgres api-dev
```

## Notes importantes

1. Toujours utiliser le mode détaché (-d) pour le développement
2. Ne pas lancer le service api-prod en développement
3. Vérifier les logs en cas d'erreur avec `docker compose logs -f api-dev`
4. Après modification du schéma Prisma, toujours régénérer le client 