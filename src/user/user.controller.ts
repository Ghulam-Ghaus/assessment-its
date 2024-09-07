import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoggingInterceptor } from 'src/interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(LoggingInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseInterceptors(LoggingInterceptor)
  async findAll(
    @Query('includeDeleted') includeDeleted: string,
    @Query() searchParams: { [key: string]: string }, // Query parameters for search
  ): Promise<User[]> {
    const include = includeDeleted === 'true';
    return this.userService.findAll(include, searchParams);
  }

  @Patch(':id')
  @UseInterceptors(LoggingInterceptor)
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(LoggingInterceptor)
  async deleteUser(
    @Param('id') id: number,
    @Query('hardDelete') hardDelete: string, // Query parameter to specify delete type
  ): Promise<void> {
    const isHardDelete = hardDelete === 'true';
    return this.userService.deleteUser(id, isHardDelete);
  }
}
