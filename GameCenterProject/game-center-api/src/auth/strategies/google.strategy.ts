import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import googleOauthConfig from "../config/google-oauth.config";
import { ConfigType } from "@nestjs/config";
import { VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject(googleOauthConfig.KEY) private googleConfiguration:ConfigType<typeof googleOauthConfig>,
        private authService:AuthService
    )
    {
        super({
            clientID: googleConfiguration.clientID,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL: googleConfiguration.callbackUrl,
            scope: ['email', 'profile']
        })
    }

    async validate(accessToken:string, refreshToken:string, profile:any, done:VerifiedCallback)
    {
        const user = await this.authService.validateGoogleUser({
            email:profile.emails[0].value, 
            password:"",
            confirmPassword:""
        })
        done(null, user);
    }
}