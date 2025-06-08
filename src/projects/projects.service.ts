import { Injectable } from '@nestjs/common';
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
  async create(createProjectDto: CreateProjectDto, file: Express.Multer.File) {
    try {
      if (!file) {
        return {
          success: false,
          message: 'Failed to add new project',
        };
      }
      const imageUrl = file.filename;
      const newProject = await this.projectsRepo.save({
        ...createProjectDto,
        image: imageUrl,
      });
      if (!newProject) {
        return {
          success: false,
          message: 'Failed to add new project',
        };
      }
      return {
        success: true,
        message: 'Add new project successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  async findAll() {
    try {
      const res = await this.projectsRepo.find();
      return {
        data: res,
        success: true,
        message: 'Success to fetch projects',
      };
    } catch (error) {
      console.error(error);
      return {
        data: [],
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.projectsRepo.findOneBy({ id: id });
      if (!res) {
        return {
          success: false,
          message: 'Project not found',
        };
      }
      return {
        data: res,
        success: true,
        message: 'Success to fetch project',
      };
    } catch (error) {
      console.error(error);
      return {
        data: [],
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    file: Express.Multer.File,
  ) {
    try {
      const project = await this.projectsRepo.findOneBy({ id: id });

      if (!project || !file) {
        return {
          success: false,
          message: 'Project not found',
        };
      }
      const imageUrl = file.filename;
      if (updateProjectDto.title !== undefined) {
        project.title = updateProjectDto.title;
      }
      if (updateProjectDto.description !== undefined) {
        project.description = updateProjectDto.description;
      }
      if (updateProjectDto.image !== undefined) {
        project.image = imageUrl;
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
      console.error(error);
      return {
        success: false,
        message: 'Something went wrong',
      };
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
