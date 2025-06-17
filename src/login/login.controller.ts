import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(HttpStatus.OK)

  // prototype :  @Headers('authorization') headers: string
  // @Headers is a decorator used to extract HTTP headers from the incoming request
  // and value authorization is the value of the 'authorization' header, usually used to pass tokens (e.g., Bearer token)
  // !!! i dont use it here jut i want to know how i can use it
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }
}
