import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Log } from './entities/log.entity';

@Injectable()
export class LogService {
  constructor(@InjectRepository(Log) private logRepository: Repository<Log>) {}

  async logAction(action: string, userId: number) {
    const log = this.logRepository.create({ action, userId });
    await this.logRepository.save(log);
  }

  async findAll(
    searchParams?: { [key: string]: string },
    userId?: number,
  ): Promise<Log[]> {
    // Base query
    const query: FindOptionsWhere<Log> = {};

    if (searchParams) {
      if (searchParams['action']) {
        query.action = Like(`%${searchParams['action']}%`); // Example: Use LIKE for partial matching
      }
    }

    // Filter by userId if provided
    if (userId) {
      query.userId = userId;
    }

    try {
      // Execute query
      return this.logRepository.find({ where: query });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve logs.',
        error.message,
      );
    }
  }
}
