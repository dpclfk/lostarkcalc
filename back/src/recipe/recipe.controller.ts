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

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const recipepatch = await this.recipeService.update(
      +id,
      updateRecipeDto,
      session,
    );

    if (recipepatch.statusCode) {
      res.status(recipepatch.statusCode).json({ result: recipepatch.result });
    } else {
      return res.json({ itemId: recipepatch.itemId });
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const recipedelete = await this.recipeService.remove(+id, session);

    if (recipedelete.statusCode) {
      res.status(recipedelete.statusCode).json({ result: recipedelete.result });
    } else {
      return res.json({ result: recipedelete.result });
    }
  }
}
