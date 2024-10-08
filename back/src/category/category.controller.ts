import { Controller, Get, Res } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '카테고리 리스트 API',
    description: '카테고리 리스트',
  })
  @ApiCreatedResponse({
    description: 'category list',
    type: CategoryDto,
  })
  @Get()
  async findAll(@Res() res: Response) {
    const category = await this.categoryService.findAll();
    res.json(category);
  }
}
