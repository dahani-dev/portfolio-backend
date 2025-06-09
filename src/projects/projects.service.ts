import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projects } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects) private projectsRepo: Repository<Projects>,
  ) {}
  // this decoratore @HttpCode() will be return the http code status lke 201 or 404 ...
  @HttpCode(HttpStatus.CREATED)
  async create(createProjectDto: CreateProjectDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    try {
      const imageUrl = file.filename;
      const newProject = await this.projectsRepo.save({
        ...createProjectDto,
        image: imageUrl,
      });
      if (!newProject) {
        throw new BadRequestException('Failed to add new project');
      }
      return {
        success: true,
        message: 'Add new project successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const res = await this.projectsRepo.find();
      return {
        data: res,
        success: true,
        message:
          res.length === 0 ? 'No projects found' : 'Success to fetch projects',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @HttpCode(HttpStatus.OK)
  async findOne(id: number) {
    try {
      const res = await this.projectsRepo.findOneBy({ id: id });
      if (!res) {
        throw new NotFoundException('Project not found');
      }
      return {
        data: res,
        success: true,
        message: 'Success to fetch project',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @HttpCode(HttpStatus.OK)
  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    file: Express.Multer.File,
  ) {
    try {
      const project = await this.projectsRepo.findOneBy({ id: id });

      if (!project) {
        throw new NotFoundException('Project not found');
      }
      if (updateProjectDto.title !== undefined) {
        project.title = updateProjectDto.title;
      }
      if (updateProjectDto.description !== undefined) {
        project.description = updateProjectDto.description;
      }
      if (updateProjectDto.image !== undefined && file !== undefined) {
        project.image = file.filename;
      }
      if (updateProjectDto.category !== undefined) {
        project.category = updateProjectDto.category;
      }
      if (updateProjectDto.link !== undefined) {
        project.link = updateProjectDto.link;
      }
      if (updateProjectDto.github !== undefined) {
        project.github = updateProjectDto.github;
      }

      await this.projectsRepo.save(project);

      return {
        success: true,
        message: 'Project updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  async remove(id: number) {
    try {
      const project = await this.projectsRepo.findOneBy({ id: id });
      if (!project) {
        return {
          success: false,
          message: 'Project not found',
        };
      }

      await this.projectsRepo.delete(project);

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }
}
