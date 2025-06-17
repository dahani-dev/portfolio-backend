import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { LoginModule } from 'src/login/login.module';

// we import LoginModule to access to LoginService to use @UseGuards(AuthRolesGuard)
@Module({
  imports: [TypeOrmModule.forFeature([Project]), LoginModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
