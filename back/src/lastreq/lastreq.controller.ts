import { Controller, Get, Res } from '@nestjs/common';
import { LastreqService } from './lastreq.service';
import { Response } from 'express';

@Controller('lastreq')
export class LastreqController {
  constructor(private readonly lastreqService: LastreqService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const lastreq = await this.lastreqService.findAll();
    res.json(lastreq);
  }
}
