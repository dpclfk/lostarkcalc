import { IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @Length(8)
  password: string;
}
