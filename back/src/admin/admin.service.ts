import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(private configService: ConfigService) {}

  async create(createAdminDto: CreateAdminDto, req: Request) {
    if (
      createAdminDto.password === this.configService.get<string>(`PAGEPASSWORD`)
    ) {
      req.session.admin = this.configService.get<string>(`ADMINNAME`);

      return { admin: true };
    } else {
      return { statusCode: 401, admin: false };
    }
  }

  async findAll(admin: string) {
    if (admin) {
      return { admin: true };
    } else {
      return { admin: false };
    }
  }
}
