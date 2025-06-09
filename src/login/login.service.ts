import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from './entities/login.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly loginRepo: Repository<AdminUser>,
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
      return {
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
