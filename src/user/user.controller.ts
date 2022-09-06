import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Post,
  Body,
  UseFilters,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { Users } from '@prisma/client';
import { AuthRegisterFilter } from '../auth/filters/exception.filter';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('/')
  getUser(@GetUser() user: Users) {
    delete user.password;
    return user;
  }

}
