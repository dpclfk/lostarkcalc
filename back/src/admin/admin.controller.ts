import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Delete,
  Session,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLogoutDto, CreateAdminDto, ResAdminDto } from './dto/admin.dto';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({
    summary: '어드민 권한부여 API',
    description: '어드민 권한을 부여한다.',
  })
  @ApiCreatedResponse({
    description: 'admin success',
    example: { admin: true },
  })
  @ApiResponse({
    status: 401,
    description: 'admin fail',
    example: { admin: false },
  })
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const admin = await this.adminService.create(createAdminDto, session);
    if (admin.statusCode === 401) {
      res.status(401).json(admin);
    } else {
      res.json(admin);
    }
  }

  @Get()
  @ApiOperation({
    summary: '어드민 권한확인 API',
    description: '어드민 권한을 확인한다.',
  })
  @ApiCreatedResponse({ description: 'admin true OR false', type: ResAdminDto })
  async findAll(@Res() res: Response, @Session() session: Record<string, any>) {
    const admin = await this.adminService.findAll(session);
    res.json(admin);
  }

  @Delete()
  @ApiOperation({
    summary: '어드민 로그아웃 API',
    description: '어드민 로그아웃',
  })
  @ApiCreatedResponse({
    description: 'admin logout true OR false',
    type: AdminLogoutDto,
  })
  async delete(
    @Res() res: Response,
    @Session()
    session: Record<string, any>,
  ) {
    const admin = await this.adminService.delete(session);
    res.json(admin);
  }
}
