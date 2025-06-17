import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

/**
 * @Authentication Guard
 */

// auth guard is a class used to protect routes by verifying user authentication before granting access
// CanActivate is an interface that forces the class to implement the canActivate() method used for authorization logic
// context: ExecutionContext is a wrapper around the details of the current request execution (contains metadata about the request)
// switchToHttp() is a method to access the HTTP layer of the execution context (e.g., req, res)
// getRequest() is a method to retrieve the actual HTTP request object (express.Request)
// verifyAsync() is a method from JwtService that verifies and decodes a JWT token asynchronously to extract the payload (is take the token and the secretKey)
// UnauthorizedException() is an exception thrown to indicate that the request is unauthorized (returns 401 Unauthorized)

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const authorization: string = request.headers.authorization;
      if (!authorization) {
        throw new UnauthorizedException('Access denied, no token provided');
      }
      const splitedAuthorization: string[] = authorization.split(' ');
      if (
        splitedAuthorization[0] === 'Bearer' &&
        splitedAuthorization[1] !== undefined
      ) {
        try {
          await this.jwtService.verifyAsync(splitedAuthorization[1], {
            secret: process.env.JWT_SECRET_KEY,
          });
          return true;
        } catch (error) {
          console.error(error);
          throw new UnauthorizedException('access denied, invalid token');
        }
      }
    }
    throw new UnauthorizedException('access denied, no token provided');
  }
}
