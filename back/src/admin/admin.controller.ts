import { Controller, Post, Body, Session } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(
    @Body() createAdminDto: CreateAdminDto,
    @Session() session: Record<string, any>,
  ) {
    return this.adminService.create(createAdminDto, session);
  }
}
