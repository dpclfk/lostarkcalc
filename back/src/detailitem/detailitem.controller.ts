import { Controller, Get, Param, Res } from '@nestjs/common';
import { DetailitemService } from './detailitem.service';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DetailItemDto } from './dto/detailitem.dto';

@Controller('detailitem')
export class DetailitemController {
  constructor(private readonly detailitemService: DetailitemService) {}

  @ApiOperation({
    summary: '카테고리 리스트 API',
    description: '카테고리 리스트',
  })
  @ApiCreatedResponse({
    description: 'category list',
    type: DetailItemDto,
  })
  @ApiResponse({
    status: 400,
    description: 'category fail',
    example: { result: 'fail' },
  })
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const detailitem = await this.detailitemService.findOne(id);

    if (detailitem.statusCode)
      res.status(detailitem.statusCode).json({ result: detailitem.result });
    else {
      res.json(detailitem);
    }
  }
}
