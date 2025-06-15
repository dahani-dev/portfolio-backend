import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from './entities/login.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './utils/utils';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly loginRepo: Repository<AdminUser>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    try {
      const admin = await this.loginRepo.findOneBy({
        username: loginDto.username.toLowerCase().trim(),
      });
      if (!admin) {
        throw new NotFoundException('invalid username or password');
      }
      if (loginDto.password !== admin.password) {
        throw new NotFoundException('invalid username or password');
      }

      // generate a token for authentication (JWT)
      // payload is the data that will be embedded inside the token (e.g., user ID, username)
      // signAsync is a method from JwtService (NestJS) that creates (signs) the token asynchronously using the secret key
      const payload: JwtPayload = { id: admin.id, username: admin.username };
      const token = await this.jwtService.signAsync(payload);

      return {
        accessToken: token,
        success: true,
        message: 'login succesfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Login failed:', error);
      throw new InternalServerErrorException('Failed to login');
    }
  }
}
