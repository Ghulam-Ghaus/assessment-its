import { IsNotEmpty } from 'class-validator';

export class CreateLogDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  action: string;
}
