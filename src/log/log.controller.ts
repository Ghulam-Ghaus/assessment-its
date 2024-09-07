import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from './entities/log.entity';
import { AuthGuard } from 'src/authGuard';
import { LoggingInterceptor } from 'src/interceptor';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async findAll(
    @Query('userId') userId: string, // Query parameter for filtering by userId
    @Query() searchParams: { [key: string]: string }, // Query parameters for search
  ): Promise<Log[]> {
    const id = userId ? Number(userId) : undefined;
    return this.logService.findAll(searchParams, id);
  }
}
