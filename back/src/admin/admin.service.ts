import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(private configService: ConfigService) {}

  async create(createAdminDto: CreateAdminDto, session: any) {
    if (
      createAdminDto.password === this.configService.get<string>(`PAGEPASSWORD`)
    ) {
      session.user = this.configService.get<string>(`ADMINNAME`);
      return { admin: true };
    } else {
      return { statusCode: 401, admin: false };
    }
  }
}
