import { Controller, Get, Query } from '@nestjs/common';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  findAll(
    @Query('category') category: string,
    @Query('search') search: string,
  ) {
    return this.listService.findAll(category, search);
  }
}
