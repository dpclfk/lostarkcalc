import { Controller, Get, Query, Res } from '@nestjs/common';
import { ListService } from './list.service';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListDto } from './dto/create-list.dto';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({
    summary: 'item list API',
    description: 'item list를 가져옴',
  })
  @ApiCreatedResponse({
    description: 'item list',
    type: ListDto,
  })
  @Get()
  async findAll(
    @Query('category') category: string,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    const list = await this.listService.findAll(category, search);

    res.json(list);
  }
}
