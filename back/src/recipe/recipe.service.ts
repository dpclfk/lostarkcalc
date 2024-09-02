import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Like, Repository } from 'typeorm';
import { Market } from 'src/entities/market.entity';
import { Icon } from 'src/entities/icon.entity';
import { Creation } from 'src/entities/creation.entity';
import { Ingredient } from 'src/entities/ingredient.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(Icon)
    private iconRepository: Repository<Icon>,
    @InjectRepository(Creation)
    private creationRepository: Repository<Creation>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto) {
    const findicategory = await this.categoryRepository.findOne({
      where: { categoryName: createRecipeDto.category },
    });

    let findicon = await this.iconRepository.findOne({
      where: { itemCode: createRecipeDto.itemCode },
    });
    console.log('test1');
    console.log(findicon);
    if (!findicon) {
      findicon = await this.iconRepository.findOne({
        where: {
          icon: createRecipeDto.icon.slice(
            'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
          ),
        },
      });
    }
    if (!findicon) {
      findicon = this.iconRepository.create({
        icon: createRecipeDto.icon.slice(
          'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
        ),
        itemCode: createRecipeDto.itemCode,
      });
      await this.iconRepository.save(findicon);
    }

    let findmarket = await this.marketRepository.findOne({
      where: { itemCode: createRecipeDto.itemCode },
    });
    if (!findmarket) {
      findmarket = await this.marketRepository.findOne({
        where: { itemCode: 1 },
      });
    }

    let creation = this.creationRepository.create({
      name: createRecipeDto.itemName,
      itemCode: createRecipeDto.itemCode,
      createBundle: createRecipeDto.createBundle,
      energy: createRecipeDto.energy,
      createTime: createRecipeDto.createTime,
      createCost: createRecipeDto.cost,
      market: findmarket,
      icon: findicon,
      category: findicategory,
    });
    try {
      await this.creationRepository.save(creation);
      // 재료 추가 반복문
      for (const ingredient of createRecipeDto.ingredient) {
        const findmarket = await this.marketRepository.findOne({
          where: { name: ingredient.itemName },
        });
        const ingredientCreate = this.ingredientRepository.create({
          market: findmarket,
          creation: creation,
          ingredientCount: ingredient.ingredientCount,
        });
        await this.ingredientRepository.save(ingredientCreate);
      }
      //재료 추가 반복문 끝
    } catch (error) {
      console.log(error.message);
      if (error.message.includes('Duplicate')) {
        return { result: 'duplication Item' };
      }
      return `${creation.name} 추가중 알수없는 오류가 발생했습니다.`;
    }
    return { itemId: creation.id };
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const findicategory = await this.categoryRepository.findOne({
      where: { categoryName: updateRecipeDto.category },
    });

    let findicon = await this.iconRepository.findOne({
      where: { itemCode: updateRecipeDto.itemCode },
    });
    if (!findicon) {
      findicon = await this.iconRepository.findOne({
        where: {
          icon: updateRecipeDto.icon.slice(
            'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
          ),
        },
      });
    }
    if (!findicon) {
      findicon = this.iconRepository.create({
        icon: updateRecipeDto.icon.slice(
          'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
        ),
        itemCode: updateRecipeDto.itemCode,
      });
      await this.iconRepository.save(findicon);
    }

    let findmarket = await this.marketRepository.findOne({
      where: { itemCode: updateRecipeDto.itemCode },
    });
    if (!findmarket) {
      findmarket = await this.marketRepository.findOne({
        where: { itemCode: 1 },
      });
    }

    let creation = this.creationRepository.create({
      name: updateRecipeDto.itemName,
      itemCode: updateRecipeDto.itemCode,
      createBundle: updateRecipeDto.createBundle,
      energy: updateRecipeDto.energy,
      createTime: updateRecipeDto.createTime,
      createCost: updateRecipeDto.cost,
      market: findmarket,
      icon: findicon,
      category: findicategory,
    });
    try {
      await this.creationRepository.update(id, creation);

      await this.ingredientRepository.delete({ creation: { id: id } });

      // 재료 추가 반복문
      for (const ingredient of updateRecipeDto.ingredient) {
        const findmarket = await this.marketRepository.findOne({
          where: { name: ingredient.itemName },
        });
        const ingredientCreate = this.ingredientRepository.create({
          market: findmarket,
          creation: creation,
          ingredientCount: ingredient.ingredientCount,
        });
        await this.ingredientRepository.save(ingredientCreate);
      }
      //재료 추가 반복문 끝
    } catch (error) {
      console.log(error.message);
      if (error.message.includes('Duplicate')) {
        return { result: 'duplication Item' };
      }
      return { result: 'fail' };
    }

    return { itemId: id };
  }

  async remove(id: number) {
    try {
      this.ingredientRepository.delete({ creation: { id: id } });
      this.creationRepository.delete({ id: id });
      return { result: 'ok' };
    } catch (error) {
      return { result: 'fail' };
    }
  }
}
