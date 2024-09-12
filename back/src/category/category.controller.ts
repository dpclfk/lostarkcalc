import { Controller, Get, Req, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Request, Response } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const category = await this.categoryService.findAll();

    console.log('hi');

    res.json(category);
  }
}
