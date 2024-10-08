import { Controller, Get, Res } from '@nestjs/common';
import { LastreqService } from './lastreq.service';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LastReqDto } from './dto/lastreq.dto';

@Controller('lastreq')
export class LastreqController {
  constructor(private readonly lastreqService: LastreqService) {}

  @ApiOperation({
    summary: '최근 요청시간 API',
    description: '로스크아크 오픈 api에 최근 요청시간이 언제인지 확인함',
  })
  @ApiCreatedResponse({
    description: 'lastreq date',
    type: LastReqDto,
  })
  @ApiResponse({
    status: 400,
    description: 'lastreq fail',
    example: { result: 'fail' },
  })
  @Get()
  async findAll(@Res() res: Response) {
    const lastreq = await this.lastreqService.findAll();
    res.json(lastreq);
  }
}
