import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Tree } from 'typeorm';
import { Projects } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects) private projectsRepo: Repository<Projects>,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    try {
      const newProject = await this.projectsRepo.save(createProjectDto);
      if (newProject) {
        return {
          success: true,
          message: 'Add new project successfully',
        };
      } else {
        return {
          success: false,
          message: 'Failed to add new project',
        };
      }
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

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const updatedProject = await this.projectsRepo.findOneBy({ id: id });
      if (updatedProject) {
        Object.assign(updatedProject, updateProjectDto);
        // updatedProject.title = updateProjectDto.title;
        // updatedProject.description = updateProjectDto.description;
        // updatedProject.image = updateProjectDto.image;
        // updatedProject.category = updateProjectDto.category;
        // updatedProject.link = updateProjectDto.link;
        // updatedProject.github = updateProjectDto.github;
        await this.projectsRepo.save(updatedProject);
        return {
          success: true,
          message: 'Project updated successfully',
        };
      } else {
        return {
          success: false,
          message: 'Failed to updated project',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        data: [],
        success: false,
        message: 'Something went wrong',
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
