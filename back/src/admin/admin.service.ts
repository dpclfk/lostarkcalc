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
      console.log(session);
      // session.cookie.maxAge = 10 * 1000;
      return { admin: true };
    } else {
      return { statusCode: 401, admin: false };
    }
  }

  async findAll(session: any) {
    if (session.user === this.configService.get<string>(`ADMINNAME`)) {
      session.user = this.configService.get<string>(`ADMINNAME`);
      // session.cookie.maxAge = 10 * 1000;
      // console.log(session);
      // console.log('!24');
      console.log(session);

      return { admin: true };
    } else {
      // console.log('!24');

      // console.log(session);

      return { admin: false };
    }
  }
}
