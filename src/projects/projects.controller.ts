import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()

  /**
   * Create a new project with image upload
   * @HttpCode decorator returns 201 Created status for successful resource creation
   */
  @HttpCode(HttpStatus.CREATED)

  // The Interceptor here is responsible for handling file uploads, i.e. receiving the file attached to the request.
  @UseInterceptors(
    // This is a type of Interceptor that is designed to capture a single file from a request (upload file).
    // prototype: file name, Multer options
    FileInterceptor('image', multerOptions),
  )
  create(
    @Body() createProjectDto: CreateProjectDto,
    // It is a NestJS decorator used inside @Controller functions to capture the single file uploaded from the user, passed in FormData as multipart/form-data.
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.create(createProjectDto, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  // ParseIntPipe is used to automatically convert the 'id' parameter from a string to a number.
  // If 'id' cannot be converted to a number, it will throw a BadRequestException.
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectsService.update(+id, updateProjectDto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.projectsService.remove(+id);
  }
}
