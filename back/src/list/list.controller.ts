import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ListService } from './list.service';
import { Request, Response } from 'express';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  async findAll(
    @Query('category') category: string,
    @Query('search') search: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const list = await this.listService.findAll(category, search);

    res.json(list);
  }
}
