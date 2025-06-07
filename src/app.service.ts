import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAllProjects(): string {
    return 'This action returns all projects';
  }
}
