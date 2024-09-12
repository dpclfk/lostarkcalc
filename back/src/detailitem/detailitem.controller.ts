import { Controller, Get, Param, Res } from '@nestjs/common';
import { DetailitemService } from './detailitem.service';
import { Response } from 'express';

@Controller('detailitem')
export class DetailitemController {
  constructor(private readonly detailitemService: DetailitemService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const detailitem = await this.detailitemService.findOne(+id);
    res.json(detailitem);
  }
}
