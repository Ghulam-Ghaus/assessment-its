import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Log } from 'src/log/entities/log.entity';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Log]), LogModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
