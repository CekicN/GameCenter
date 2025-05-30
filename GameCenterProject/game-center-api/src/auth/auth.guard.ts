import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './auth-public.decorator';

require('dotenv').config;
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector){}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token)
      throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );
      
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const {authorization}:any = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }
    const [type, token] = authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
