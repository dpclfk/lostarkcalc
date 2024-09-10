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

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

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

  @Get()
  async findAll(@Query('search') search: string, @Res() res: Response) {
    const marketsearch = await this.marketService.findAll(search);

    if (marketsearch.statusCode) {
      res.status(marketsearch.statusCode).json({ result: marketsearch.result });
    } else {
      return res.json({ marketList: marketsearch.marketList });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateMarketDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const marketpatch = await this.marketService.update(
      +id,
      updateMarketDto,
      session,
    );

    if (marketpatch.statusCode)
      res.status(marketpatch.statusCode).json({ result: marketpatch.result });
    else {
      // return await this.marketService.update(+id, updateMarketDto);
      res.json({ name: marketpatch.name });
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const marketdelete = await this.marketService.remove(+id, session);

    if (marketdelete.statusCode) {
      res.status(marketdelete.statusCode).json({ result: marketdelete.result });
    } else {
      res.json({ result: marketdelete.result });
    }
  }
}
