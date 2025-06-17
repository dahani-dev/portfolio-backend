import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../utils/utils';
import { JwtService } from '@nestjs/jwt';

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
      const headers: string[] = request.headers.authorization?.split(' ');
      if (headers[0] === 'Bearer' && headers[1] !== undefined) {
        try {
          const payload: JwtPayload = await this.jwtService.verifyAsync(
            headers[1],
            {
              secret: process.env.JWT_SECRET_KEY,
            },
          );
          request['admin'] = payload;
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
