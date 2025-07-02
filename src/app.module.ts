import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    ProjectsModule,
    // if you want to use a .env file to manage environment variables, use ConfigModule.forRoot()
    // isGlobal: true → makes ConfigModule available globally across the whole application (no need to import in other modules)
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      // make the synchronize true only on developement mode
      // synchronize: true,
    }),
    LoginModule,
  ],
})
export class AppModule {}
