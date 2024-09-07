import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LogService } from 'src/log/log.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private logService: LogService,
  ) {}

  async createUser(createUserParams: User): Promise<User> {
    try {
      // Create a new user instance
      const newUser = this.userRepository.create(createUserParams);

      // Save the new user to the database
      const user = await this.userRepository.save(newUser);
      if (user) {
        await this.logService.logAction('CREATE USER', user.id);
      }

      return user;
    } catch (error) {
      // Handle duplicate key violation (error code 23505)
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new Error('User with this email already exists.');
      }

      // Rethrow the error for other unexpected errors
      throw error;
    }
  }

  async findAll(
    includeDeleted: boolean = false,
    searchParams?: { [key: string]: string | boolean },
  ): Promise<User[]> {
    // Base query
    const query: FindOptionsWhere<User> = {};

    if (searchParams) {
      if (searchParams['id']) {
        query.id = Number(searchParams['id']);
      }
      if (searchParams['fullName']) {
        query.fullName = Like(`%${searchParams['fullName']}%`); // Use LIKE operator for partial matches
      }
      if (searchParams['email']) {
        query.email = Like(`%${searchParams['email']}%`); // Use LIKE operator for partial matches
      }
      if (searchParams['isDeleted'] !== undefined) {
        query.isDeleted = searchParams['isDeleted'] === 'true'; // Convert string 'true'/'false' to boolean
      }
    }

    // Include or exclude soft-deleted users
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    try {
      // Execute query
      return this.userRepository.find({ where: query });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve users.',
        error.message,
      );
    }
  }

  async updateUser(id: number, updateUserParams: UpdateUserDto): Promise<User> {
    let user: User;

    try {
      // Find the user by ID
      user = await this.userRepository.findOneBy({ id, isDeleted: false });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      // Update user properties
      Object.assign(user, updateUserParams);

      // Save the updated user
      const updatedUser = await this.userRepository.save(user);

      // Create a log entry
      if (user) {
        await this.logService.logAction('UPDATE USER', user.id);
      }

      return updatedUser;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new BadRequestException(
          'Duplicate entry. This resource already exists.',
        );
      }
      throw error;
    }
  }

  async deleteUser(id: number, hardDelete: boolean = false): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      if (hardDelete) {
        // Hard delete: remove from database
        await this.userRepository.remove(user);
        await this.logService.logAction('UPDATE USER', user.id);
      } else {
        // Soft delete: set isDeleted to true
        user.isDeleted = true;
        await this.userRepository.save(user);
        await this.logService.logAction('UPDATE USER', user.id);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete user.',
        error.message,
      );
    }
  }
}
