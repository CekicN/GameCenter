import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { CurrentUser } from './types/current-user';
import { UserDto } from 'src/users/dtos/users.dto';
import { User } from 'src/users/entities/user.entity';
import { Profile } from 'src/users/entities/profile.entity';

@Injectable()
export class AuthService {
    constructor(private userService:UsersService,
                private jwtService:JwtService,
                @Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
    ){}

    async validateUser(email:string, password:string)
    {
        const user = await this.userService.findByEmail(email);
        if(!user)
            throw new UnauthorizedException("User not found, wrong email");

        if(!await bcrypt.compare(password, user.password))
            throw new UnauthorizedException("Password is incorrect");
        
        return {id: user.id, email}; 
    }

    async register(userDto:UserDto)
    {
        const user = await this.userService.findByEmail(userDto.email);
        if(user)
            throw new BadRequestException("User with that email exist");

        if(userDto.password !== userDto.confirmPassword)
            throw new BadRequestException("Passwords are not equal");
        console.log(userDto)
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(userDto.password, salt);

        const username = userDto.email.split('@')[0];
        
        const profile = Profile.create({ username })
        await profile.save();
        
        const newUser = User.create({
            email:userDto.email,
            password,
            createdAt: new Date(),
            profile
        })
        
        return newUser.save();
    }

    async login(email:string, password:string)
    {
        const user = await this.userService.findByEmail(email);
        if(!user)
            throw new BadRequestException("User doesn't exist");

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            throw new BadRequestException("Incorrect password");

        return await this.loginWithId(user.id, email);
    }

    async loginWithId(userId: number, email: string)
    {
        // const payload:AuthJwtPayload = { 
        //     sub:userId,
        //     email
        // }
        // const token = this.jwtService.sign(payload);
        // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig)

        const {accessToken, refreshToken} = await this.generateTokens(userId, email);

        const hashedRefreshToken = await argon2.hash(refreshToken);

        await this.userService.updateHashedRefreshToken(email, hashedRefreshToken);
        return {
            accessToken,
            refreshToken
        }
    }


    async generateTokens(userId:number, email:string)
    {
        const payload: AuthJwtPayload = {sub: userId, email}

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig)
        ]);

        return {
            accessToken, 
            refreshToken
        }
    }
    
    async refreshToken(userId: number, email:string) {

        const {accessToken, refreshToken} = await this.generateTokens(userId, email);

        const hashedRefreshToken = await argon2.hash(refreshToken);

        await this.userService.updateHashedRefreshToken(email, hashedRefreshToken);
        return {
            accessToken,
            refreshToken
        }
    }

    async validateRefreshToken(email:string, refreshToken:string)
    {
        const user = await this.userService.findByEmail(email);

        if(!user || !user.hashedRefreshToken) throw new UnauthorizedException("Invalid refresh token");

        const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);

        if(!refreshTokenMatches) throw new UnauthorizedException("Invalid refresh token");

        return {id:user.id, email}
    }


    async logout(email: string)
    {
        await this.userService.updateHashedRefreshToken(email, null);
    }

    async validateJwtUser(email:string)
    {
        const user = await this.userService.findByEmail(email);
        if(!user) throw new UnauthorizedException("User not found");

        const currentUser:CurrentUser = {id:user.id, email:user.email, role:user.role};
        return currentUser;
    }

    async validateGoogleUser(googleUser:UserDto)
    {
        const user = await this.userService.findByEmail(googleUser.email);

        if(user) return user;

        return await this.register(googleUser);
    }
}
