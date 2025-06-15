import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/login.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    // if you want to use a .env file to manage environment variables, use ConfigModule.forRoot()
    // isGlobal: true → makes ConfigModule available globally across the whole application (no need to import in other modules)
    ConfigModule.forRoot({ isGlobal: true }),
    // Register JwtModule with configuration
    // global → makes the module available across the entire app without re-importing
    // secret → secret key used to sign the JWTs (from environment variable for security)
    // signOptions → options for signing the token; expiresIn → how long the token will be valid
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
