import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAllProjects(): string {
    return 'Hello World!';
  }
}
