import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LoginService } from '../login.service';
import { JwtPayload } from '../utils/utils';
import { UserType } from '../utils/enums';

/**
 * @Authorization Guard with Role Check (Admin Only)
 */
@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loginService: LoginService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Access denied: No token provided');
    }

    const splitedAuthorization: string[] = authorization.split(' ');

    if (splitedAuthorization[0] !== 'Bearer' || !splitedAuthorization[1]) {
      throw new UnauthorizedException('Access denied: Invalid token');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        splitedAuthorization[1],
        {
          secret: process.env.JWT_SECRET_KEY,
        },
      );

      const user = await this.loginService.getAdminUser(payload.id);

      if (!user) {
        throw new UnauthorizedException('Access denied: User not found');
      }

      if (user.data.userType !== UserType.ADMIN.toString()) {
        throw new UnauthorizedException(
          'Access denied: Insufficient permissions',
        );
      }
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to validate token');
    }
  }
}
