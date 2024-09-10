import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(private configService: ConfigService) {}

  create(createAdminDto: CreateAdminDto, session: any) {
    if (
      createAdminDto.password === this.configService.get<string>(`PAGEPASSWORD`)
    ) {
      console.log('test');
    } else {
      console.log('nn');
    }
    return 'This action adds a new admin';
  }
}
