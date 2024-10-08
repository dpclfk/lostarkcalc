import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  Res,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateResRecipeDto } from './dto/res-recipe.dto';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiOperation({
    summary: '레시피 생성 API',
    description: '레시피를 생성하는 API',
  })
  @ApiCreatedResponse({
    description: '레시피 생성 완료',
    type: CreateResRecipeDto,
  })
  @ApiResponse({
    status: 405,
    description: '같은 이름의 아이템이 있음',
    example: { result: 'duplication Item' },
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
    @Body() createRecipeDto: CreateRecipeDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const recipecreate = await this.recipeService.create(
      createRecipeDto,
      session,
    );

    if (recipecreate.statusCode) {
      res.status(recipecreate.statusCode).json({ result: recipecreate.result });
    } else {
      return res.json({ itemId: recipecreate.itemId });
    }
  }

  @ApiOperation({
    summary: '레시피 수정 API',
    description: '레시피를 수정하는 API',
  })
  @ApiCreatedResponse({
    description: '레시피 수정 완료',
    type: CreateResRecipeDto,
  })
  @ApiResponse({
    status: 405,
    description: '같은 이름의 레시피가 있음',
    example: { result: 'duplication Item' },
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
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const recipepatch = await this.recipeService.update(
      id,
      updateRecipeDto,
      session,
    );

    if (recipepatch.statusCode) {
      res.status(recipepatch.statusCode).json({ result: recipepatch.result });
    } else {
      return res.json({ itemId: recipepatch.itemId });
    }
  }

  @ApiOperation({
    summary: '레시피 삭제 API',
    description: '레시피를 삭제하는 API',
  })
  @ApiCreatedResponse({
    description: '레시피 삭제 완료',
    example: { result: 'ok' },
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
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const recipedelete = await this.recipeService.remove(id, session);

    if (recipedelete.statusCode) {
      res.status(recipedelete.statusCode).json({ result: recipedelete.result });
    } else {
      return res.json({ result: recipedelete.result });
    }
  }
}
