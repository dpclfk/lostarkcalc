import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Creation } from 'src/entities/creation.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { In, Like, Repository } from 'typeorm';

interface ICalcList {
  id: number;
  itemName: string;
  currentMinPrice: number;
  ingredientAllCost: number;
  createCost: number;
  energy: number;
  createBundle: number;
  marketBundle: number;
  categoryId: number;
  icon: string;
}

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(Creation)
    private creationRepository: Repository<Creation>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAll(category: string, search: string) {
    let categoryarr: number[] = [];

    category ? (categoryarr = category.split(',').map(Number)) : '';

    let listCreation: Creation[] = [];

    if (!category) {
      listCreation = await this.creationRepository.find({
        where: { name: Like(`%${search ? search : ''}%`) },
        select: ['id', 'name', 'createBundle', 'energy', 'createCost'],
      });
    } else {
      listCreation = await this.creationRepository.find({
        where: {
          category: In(categoryarr),
          name: Like(`%${search ? search : ''}%`),
        },
      });
    }
    let calclist: ICalcList[] = [];

    for (let i = 0; i < listCreation.length; i++) {
      let ingredientAllCost: number = 0;

      const ingredientlist = await this.ingredientRepository.find({
        where: { creation: { id: listCreation[i].id } },
      });

      for (const calc of ingredientlist) {
        ingredientAllCost = +(
          +ingredientAllCost +
          +calc.ingredientCount *
            (calc.market.currentMinPrice / calc.market.bundle)
        ).toFixed(2);
      }

      calclist = [
        ...calclist,
        {
          id: listCreation[i].id,
          itemName: listCreation[i].name,
          currentMinPrice: listCreation[i].market.currentMinPrice || 0,
          ingredientAllCost: ingredientAllCost * 100,
          createCost: listCreation[i].createCost,
          energy: listCreation[i].energy,
          createBundle: listCreation[i].createBundle,
          marketBundle: listCreation[i].market.bundle,
          categoryId: listCreation[i].category.id,
          icon: listCreation[i].icon.icon,
        },
      ];
    }
    return calclist;
  }
}
