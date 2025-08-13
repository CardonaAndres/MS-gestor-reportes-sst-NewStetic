import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService : JwtService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Obtener el req
    const req = context.switchToHttp().getRequest();
    //Obtener el token del header
    const token = this.extractTokenFromHeader(req);

    //Verificar si el token es valido
    if (!token) throw new UnauthorizedException('Por favor, inicie sesión para continuar.');
    
    //Verificar si el token es valido
    try {
      //Verificar el token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY
      });
       
      //Verificar si el token es valido
      req['user'] = payload;

    } catch (err) {
      throw new UnauthorizedException('Sesión inválido o expirado.');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}