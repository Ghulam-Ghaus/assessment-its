import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateDateColumn } from 'typeorm';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @CreateDateColumn()
  timestamp?: Date;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
