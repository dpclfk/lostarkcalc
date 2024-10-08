import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class ResAdminDto {
  @ApiProperty()
  admin: boolean;
}

export class AdminLogoutDto {
  @ApiProperty()
  logout: boolean;
}
