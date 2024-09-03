import { Controller, Get } from '@nestjs/common';
import { LastreqService } from './lastreq.service';

@Controller('lastreq')
export class LastreqController {
  constructor(private readonly lastreqService: LastreqService) {}

  @Get()
  findAll() {
    return this.lastreqService.findAll();
  }
}
