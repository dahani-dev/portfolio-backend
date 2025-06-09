import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
