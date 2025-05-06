import { Controller, Get, Query, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../use-cases/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Get('riot/login')
    async riotLogin(@Res() res: Response) {
        const clientId = this.configService.get('RIOT_CLIENT_ID');
        const redirectUri = this.configService.get('RIOT_REDIRECT_URI');
        const riotAuthUrl = `https://auth.riotgames.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+email+phone`;
        
        return res.redirect(riotAuthUrl);
    }

    @Get('riot/callback')
    async riotCallback(@Query('code') code: string) {
        return this.authService.handleRiotCallback(code);
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() req) {
        return req.user;
    }
}
