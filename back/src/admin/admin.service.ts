import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/admin.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(private configService: ConfigService) {}

  async create(createAdminDto: CreateAdminDto, session: any) {
    if (
      createAdminDto.password === this.configService.get<string>(`PAGEPASSWORD`)
    ) {
      session.admin = this.configService.get<string>(`ADMINNAME`);
      return { admin: true };
    } else {
      return { statusCode: 401, admin: false };
    }
  }

  async findAll(session: any) {
    if (session.admin === this.configService.get<string>(`ADMINNAME`)) {
      return { admin: true };
    } else {
      return { admin: false };
    }
  }

  async delete(session: any) {
    await session.destroy();
    if (session.admin === this.configService.get<string>(`ADMINNAME`)) {
      return { logout: false };
    } else {
      return { logout: true };
    }
  }
}
