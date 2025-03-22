import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserUseCases } from '../user/user.use-case'; // Assurez-vous d'avoir un service utilisateur
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserUseCases,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async handleRiotCallback(code: string) {
        try {
            // Échange du code contre un token
            const tokenResponse = await firstValueFrom(this.httpService.post('https://auth.riotgames.com/token', {
                client_id: this.configService.get('RIOT_CLIENT_ID'),
                client_secret: this.configService.get('RIOT_CLIENT_SECRET'),
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.configService.get('RIOT_REDIRECT_URI'),
            }));

            // Récupération des informations utilisateur
            const userInfoResponse = await firstValueFrom(this.httpService.get('https://auth.riotgames.com/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
            }));

            const riotUser = userInfoResponse.data;

            // Recherche ou création de l'utilisateur
            let user = await this.usersService.findOneByEmail(riotUser.email);
            
            if (!user) {
                user = await this.usersService.createUser({
                    email: riotUser.email,
                    firstName: riotUser.given_name,
                    lastName: riotUser.family_name,
                    riotId: riotUser.sub,
                });
            }

            return this.login(user);
        } catch (error) {
            throw new HttpException('Erreur d\'authentification Riot', HttpStatus.UNAUTHORIZED);
        }
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, firstName: user.firstName, lastName: user.lastName };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    // OLD
    // async refreshAccessToken(refreshToken: string) {
    //     const response = await this.httpService.post('https://oauth2.googleapis.com/token', {
    //         client_id: process.env.GOOGLE_CLIENT_ID,
    //         client_secret: process.env.GOOGLE_CLIENT_SECRET,
    //         refresh_token: refreshToken,
    //         grant_type: 'refresh_token',
    //     }).toPromise();
    //     return response.data;
    // }
}
