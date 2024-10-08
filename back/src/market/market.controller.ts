import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateResDto, GetResDto } from './dto/res-market.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({
    summary: '재료아이템 생성 API',
    description: '재료아이템을 생성하는 API',
  })
  @ApiCreatedResponse({
    description: '재료아이템 생성 완료',
    type: CreateResDto,
  })
  @ApiResponse({
    status: 405,
    description: '같은 이름의 아이템이 있음',
    example: { result: 'duplication Item' },
  })
  @ApiResponse({
    status: 401,
    description: '아이콘 url이 잘못되었음',
    example: { result: 'imgurl check' },
  })
  @ApiResponse({
    status: 403,
    description: '어드민 권한이 없음',
    example: { result: 'not admin' },
  })
  @ApiResponse({
    status: 400,
    description: '그외에 설정되지 않은 오류가 있음',
    example: { result: 'fail' },
  })
  @Post()
  async create(
    @Body() createMarketDto: CreateMarketDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const marketcreate = await this.marketService.create(
      createMarketDto,
      session,
    );
    if (marketcreate.statusCode) {
      res.status(marketcreate.statusCode).json({ result: marketcreate.result });
    } else {
      return res.json({ name: marketcreate.name });
    }
  }

  @ApiOperation({
    summary: '재료아이템을 불러오는 API',
    description: '검색된 재료아이템을 불러옴',
  })
  @ApiCreatedResponse({
    description: '재료아이템 불러오는데 성공함',
    type: GetResDto,
  })
  @ApiResponse({
    status: 401,
    description: '검색값이 비어있음',
    example: { result: 'empty search' },
  })
  @ApiResponse({
    status: 400,
    description: '그외에 설정되지 않은 오류가 있음',
    example: { result: 'fail' },
  })
  @Get()
  async findAll(@Query('search') search: string, @Res() res: Response) {
    const marketsearch = await this.marketService.findAll(search);

    if (marketsearch.statusCode) {
      res.status(marketsearch.statusCode).json({ result: marketsearch.result });
    } else {
      return res.json({ marketList: marketsearch.marketList });
    }
  }

  @ApiOperation({
    summary: '재료아이템 수정 API',
    description: '재료아이템을 수정하는 API',
  })
  @ApiCreatedResponse({
    description: '재료아이템 수정 완료',
    type: CreateResDto,
  })
  @ApiResponse({
    status: 405,
    description: '같은 이름의 아이템이 있음',
    example: { result: 'duplication Item' },
  })
  @ApiResponse({
    status: 401,
    description: '수정할수 있는 아이템이 아님',
    example: { result: 'not fatch' },
  })
  @ApiResponse({
    status: 403,
    description: '어드민 권한이 없음',
    example: { result: 'not admin' },
  })
  @ApiResponse({
    status: 400,
    description: '그외에 설정되지 않은 오류가 있음',
    example: { result: 'fail' },
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMarketDto: UpdateMarketDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const marketpatch = await this.marketService.update(
      id,
      updateMarketDto,
      session,
    );

    if (marketpatch.statusCode)
      res.status(marketpatch.statusCode).json({ result: marketpatch.result });
    else {
      res.json({ name: marketpatch.name });
    }
  }

  @ApiOperation({
    summary: '재료아이템 삭제 API',
    description: '재료아이템을 삭제하는 API',
  })
  @ApiCreatedResponse({
    description: '재료아이템 삭제 완료',
    example: { result: 'ok' },
  })
  @ApiResponse({
    status: 401,
    description: '삭제할수 있는 아이템이 아님',
    example: { result: 'not fatch' },
  })
  @ApiResponse({
    status: 403,
    description: '어드민 권한이 없음',
    example: { result: 'not admin' },
  })
  @ApiResponse({
    status: 400,
    description: '그외에 설정되지 않은 오류가 있음',
    example: { result: 'fail' },
  })
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const marketdelete = await this.marketService.remove(id, session);

    if (marketdelete.statusCode) {
      res.status(marketdelete.statusCode).json({ result: marketdelete.result });
    } else {
      res.json({ result: marketdelete.result });
    }
  }
}
