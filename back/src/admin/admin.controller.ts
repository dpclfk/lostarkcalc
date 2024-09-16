import { Controller, Post, Body, Res, Get, Req, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Request, Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const admin = await this.adminService.create(createAdminDto, req);

    if (admin.statusCode)
      res.status(admin.statusCode).json({ admin: admin.admin });
    else {
      res.json({ admin: admin.admin });
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    const admin = await this.adminService.findAll(req.session.admin);

    res.json(admin);
  }

  @Delete()
  async delete(@Res() res: Response, @Req() req: Request) {
    const admin = await this.adminService.delete(req.session);

    res.json(admin.admin);
  }
}
