import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, file: Express.Multer.File) {
    // Image file validation (should be handled here, not in the DTO)
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    try {
      const imageUrl = file.filename;
      await this.projectsRepo.save({
        ...createProjectDto,
        image: imageUrl,
      });

      return {
        success: true,
        message: 'Project created successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating project:', error);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  /**
   * Fetch all projects
   * Returns 200 OK even for empty results (not an error)
   */
  async findAll() {
    try {
      const projects = await this.projectsRepo.find({
        order: { id: 'DESC' }, // Most recent first
      });

      return {
        data: projects,
        success: true,
        message:
          projects.length === 0
            ? 'No projects found'
            : 'Projects fetched successfully',
        count: projects.length,
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }

  /**
   * Find a single project by ID
   */
  async findOne(id: number) {
    if (id <= 0) {
      throw new BadRequestException('Invalid project ID');
    }

    try {
      const project = await this.projectsRepo.findOneBy({ id });
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return {
        data: project,
        success: true,
        message: 'Project fetched successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error fetching project:', error);
      throw new InternalServerErrorException('Failed to fetch project');
    }
  }

  /**
   * Update project with optional image upload
   * File parameter is now optional for partial updates
   */
  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    file?: Express.Multer.File, // Made optional
  ) {
    if (id <= 0) {
      throw new BadRequestException('Invalid project ID');
    }

    try {
      // Check if project exists
      const existingProject = await this.projectsRepo.findOneBy({ id });
      if (!existingProject) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      // Prepare the updated data by merging existing entity with new values
      // The merge() function is from TypeORM — it combines the current entity (existingProject)
      // with the new data (updateProjectDto) to create a single updated object
      const projectToUpdate = this.projectsRepo.merge(
        existingProject,
        updateProjectDto,
      );

      // Add image only if file is provided
      if (file) {
        projectToUpdate.image = file.filename;
      }

      // Save updated project
      await this.projectsRepo.save(projectToUpdate);

      return {
        updatedProject: projectToUpdate,
        success: true,
        message: 'Project updated successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error updating project:', error);
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  /**
   * Delete a project by ID
   * Returns 200 OK for successful deletion
   */
  async remove(id: number) {
    if (id <= 0) {
      throw new BadRequestException('Invalid project ID');
    }

    try {
      const project = await this.projectsRepo.findOneBy({ id });
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      // Use remove() instead of delete() to trigger entity listeners
      await this.projectsRepo.remove(project);

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error deleting project:', error);
      throw new InternalServerErrorException('Failed to delete project');
    }
  }

  /**
   * Alternative delete method using 204 No Content status
   * Uncomment if you prefer not returning any response body
   */
  /*
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(id: number): Promise<void> {
    const result = await this.projectsRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    // No return statement for 204 No Content
  }
  */
}
