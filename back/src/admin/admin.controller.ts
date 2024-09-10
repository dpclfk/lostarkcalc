import { Controller, Post, Body, Session, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const admin = await this.adminService.create(createAdminDto, session);

    if (admin.statusCode)
      res.status(admin.statusCode).json({ admin: admin.admin });
    else {
      res.json({ admin: admin.admin });
    }
  }
}
