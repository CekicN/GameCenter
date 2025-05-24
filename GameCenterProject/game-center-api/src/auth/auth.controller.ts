import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth-public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}
    
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req)
    {
        return await this.authService.login(req.user.id, req.user.email);
    }

    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    refreshToken(@Req() req)
    {
        return this.authService.refreshToken(req.user.id, req.user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    Logout(@Req() req)
    {
        this.authService.logout(req.user.email);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    googleLogin(){}

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Req() req, @Res() res){
        const response = await this.authService.login(req.user.id, req.user.email)

        res.redirect(`http://localhost:4200?token=${response.accessToken}`);
    }
}
