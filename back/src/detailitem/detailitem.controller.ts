import { Controller, Get, Param } from '@nestjs/common';
import { DetailitemService } from './detailitem.service';

@Controller('detailitem')
export class DetailitemController {
  constructor(private readonly detailitemService: DetailitemService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailitemService.findOne(+id);
  }
}
