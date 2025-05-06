# Règles d'Intégration API Riot Games

## Structure
```
src/use-cases/riot/
├── services/
│   ├── summoner.service.ts    # Service pour les données de base du joueur
│   ├── league.service.ts      # Service pour les rangs et LP
│   └── spectator.service.ts   # Service pour les parties en cours
├── interfaces/
│   ├── summoner.interface.ts  # Types pour les données Summoner
│   ├── league.interface.ts    # Types pour les données de rang
│   └── spectator.interface.ts # Types pour les données de partie
└── riot.module.ts            # Module regroupant les services Riot
```

## Services

### Summoner Service
```typescript
@Injectable()
export class SummonerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService
  ) {}

  async getSummonerByName(name: string, tagLine: string): Promise<SummonerDTO> {
    const cacheKey = `summoner:${name}-${tagLine}`;
    
    // Vérifier le cache d'abord
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    // Appeler l'API Riot
    const response = await this.httpService.get(
      `${this.riotApiUrl}/summoner/v4/summoners/by-name/${name}`
    );

    // Mettre en cache pour 1 heure
    await this.cacheService.set(cacheKey, response.data, 3600);

    return response.data;
  }
}
```

### League Service
```typescript
@Injectable()
export class LeagueService {
  async getRankBySummonerId(summonerId: string): Promise<LeagueDTO> {
    const cacheKey = `rank:${summonerId}`;
    
    // Cache plus court pour les rangs (5 minutes)
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const response = await this.httpService.get(
      `${this.riotApiUrl}/league/v4/entries/by-summoner/${summonerId}`
    );

    await this.cacheService.set(cacheKey, response.data, 300);

    return response.data;
  }
}
```

### Spectator Service
```typescript
@Injectable()
export class SpectatorService {
  async getCurrentGame(summonerId: string): Promise<GameDTO | null> {
    const cacheKey = `game:${summonerId}`;
    
    // Cache très court pour les parties en cours (30 secondes)
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.httpService.get(
        `${this.riotApiUrl}/spectator/v4/active-games/by-summoner/${summonerId}`
      );
      
      await this.cacheService.set(cacheKey, response.data, 30);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Pas de partie en cours
      }
      throw error;
    }
  }
}
```

## Gestion du Rate Limiting

### Configuration
```typescript
@Injectable()
export class RiotRateLimiter {
  private readonly limiter: RateLimiter;

  constructor() {
    this.limiter = new RateLimiter({
      points: 100,        // Requêtes par intervalle
      duration: 120,      // Intervalle en secondes
      blockDuration: 1    // Durée de blocage si dépassement
    });
  }

  async executeRequest<T>(
    request: () => Promise<T>
  ): Promise<T> {
    await this.limiter.consume('riot-api');
    return request();
  }
}
```

### Utilisation dans les Services
```typescript
@Injectable()
export class RiotBaseService {
  constructor(
    private readonly rateLimiter: RiotRateLimiter,
    private readonly httpService: HttpService
  ) {}

  protected async executeRequest<T>(url: string): Promise<T> {
    return this.rateLimiter.executeRequest(() =>
      this.httpService.get<T>(url).toPromise()
    );
  }
}
```

## Gestion des Erreurs

### Types d'Erreurs
```typescript
export class RiotApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export class RateLimitError extends RiotApiError {
  constructor() {
    super(429, 'RATE_LIMIT', 'Rate limit exceeded');
  }
}
```

### Intercepteur d'Erreurs
```typescript
@Injectable()
export class RiotApiInterceptor implements HttpInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error.response) {
          switch (error.response.status) {
            case 429:
              throw new RateLimitError();
            case 404:
              throw new RiotApiError(404, 'NOT_FOUND', 'Resource not found');
            default:
              throw new RiotApiError(
                error.response.status,
                'API_ERROR',
                error.response.data?.message || 'Unknown error'
              );
          }
        }
        throw error;
      })
    );
  }
}
```

## Cache

### Configuration Redis
```typescript
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 3600 // TTL par défaut
      })
    })
  ]
})
export class RiotModule {}
```

### Stratégie de Cache
```typescript
const CACHE_TTL = {
  SUMMONER: 3600,    // 1 heure
  RANK: 300,         // 5 minutes
  GAME: 30,          // 30 secondes
  HISTORY: 1800      // 30 minutes
};

@Injectable()
export class RiotCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getCacheKey(type: string, id: string): Promise<string> {
    return `riot:${type}:${id}`;
  }

  async set(
    type: string,
    id: string,
    data: any
  ): Promise<void> {
    const key = await this.getCacheKey(type, id);
    await this.cacheManager.set(
      key,
      data,
      CACHE_TTL[type]
    );
  }
}
```

## Bonnes Pratiques

### Sécurité
- Ne jamais exposer la clé API Riot
- Valider toutes les entrées utilisateur
- Gérer les erreurs de manière appropriée
- Utiliser HTTPS pour toutes les requêtes

### Performance
- Mettre en cache toutes les réponses
- Optimiser les requêtes batch
- Gérer le rate limiting de manière proactive
- Monitorer les temps de réponse

### Maintenance
- Logger toutes les requêtes API
- Surveiller les quotas d'utilisation
- Mettre à jour régulièrement les versions d'API
- Documenter les changements d'API 