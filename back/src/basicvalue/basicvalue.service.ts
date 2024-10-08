import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Market } from 'src/entities/market.entity';
import { Icon } from 'src/entities/icon.entity';
import { LastRequest } from 'src/entities/lastRequest.entity';
import { Creation } from 'src/entities/creation.entity';
import { Ingredient } from 'src/entities/ingredient.entity';
import { creationarr } from './basicvalue';

@Injectable()
export class BasicvalueService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(LastRequest)
    private lastReqRepository: Repository<LastRequest>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(Icon)
    private iconRepository: Repository<Icon>,
    @InjectRepository(Creation)
    private creationRepository: Repository<Creation>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    private configService: ConfigService,
  ) {}

  async basiccategory() {
    try {
      const findcate = await this.categoryRepository.findOne({
        where: { categoryName: '배틀아이템' },
      });

      if (!findcate) {
        const catebasic = ['배틀아이템', '요리', '생활도구', '특수'];
        for (const setting of catebasic) {
          const catesetting = this.categoryRepository.create({
            categoryName: setting,
          });
          await this.categoryRepository.save(catesetting);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  async basiccmarket() {
    try {
      const lastreq = await this.lastReqRepository.findOne({
        where: { id: 1 },
        select: ['lastReq'],
      });

      // 최신 요청DB가 없거나, 최신요청이 1분 이후인경우
      if (!lastreq || +new Date() - +lastreq.lastReq > 60000) {
        await this.lastReqRepository.save({
          id: 1,
          lastReq: new Date(),
        });

        const marketfind = await this.marketRepository.findOne({
          where: { id: 1 },
        });
        if (marketfind) {
          throw Error('already basic value');
        }
        const lostlink = axios.create({
          baseURL: 'https://developer-lostark.game.onstove.com/',
          headers: {
            accept: 'application/json',
            authorization: `${this.configService.get<string>(`LOSTAPI`)}`,
          },
        });

        //db 업데이트
        const marketapiupdate = async (item: {
          Name: string;
          Id: number;
          BundleCount: number;
          CurrentMinPrice: number;
          RecentPrice: number;
          YDayAvgPrice: number;
          Icon: string;
        }) => {
          let icon = this.iconRepository.create({
            icon: item.Icon.slice(
              'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
            ),
            itemCode: item.Id,
          });
          try {
            await this.iconRepository.save(icon);
          } catch (err) {
            icon = await this.iconRepository.findOne({ where: icon });
          }
          try {
            const market = this.marketRepository.create({
              name: item.Name,
              itemCode: item.Id,
              bundle: item.BundleCount,
              currentMinPrice: item.CurrentMinPrice,
              recentPrice: item.RecentPrice,
              yDayAvgPrice: item.YDayAvgPrice,
              icon: icon,
              patchable: false,
            });
            await this.marketRepository.upsert(market, []);
          } catch (err) {}
        };

        //배틀아이템 요청 for문
        for (let i = 1; i < 20; i++) {
          const reqapi = await lostlink.post(
            'markets/items',
            {
              Sort: 'GRADE',
              CategoryCode: 60000,
              CharacterClass: '',
              ItemTier: null,
              ItemGrade: '',
              ItemName: '',
              PageNo: i,
              SortCondition: 'ASC',
            },
            { headers: { 'Content-Type': 'application/json' } },
          );
          reqapi.data.Items.map(
            (item: {
              Name: string;
              Id: number;
              BundleCount: number;
              CurrentMinPrice: number;
              RecentPrice: number;
              YDayAvgPrice: number;
              Icon: string;
            }) => marketapiupdate(item),
          );
          // for문 멈추고싶은 조건
          if (reqapi.data.Items.length < 10) {
            break;
          }
        }
        //요리 요청 for문
        //bundilCount가 10인 아이템이 현재 사용및 제작가능 아이템임
        //그외에는 옛날아이템
        for (let i = 1; i < 20; i++) {
          const reqapi = await lostlink.post(
            'markets/items',
            {
              Sort: 'GRADE',
              CategoryCode: 70000,
              CharacterClass: '',
              ItemTier: null,
              ItemGrade: '',
              ItemName: '',
              PageNo: i,
              SortCondition: 'ASC',
            },
            { headers: { 'Content-Type': 'application/json' } },
          );
          reqapi.data.Items.map(
            async (item: {
              Name: string;
              Id: number;
              BundleCount: number;
              CurrentMinPrice: number;
              RecentPrice: number;
              YDayAvgPrice: number;
              Icon: string;
            }) => {
              if (item.BundleCount === 10) marketapiupdate(item);
            },
          );
          // for문 멈추고싶은 조건
          if (reqapi.data.Items.length < 10) {
            break;
          }
        }
        //특수아이템 요청 for문
        for (let i = 1; i < 2; i++) {
          const reqapi = await lostlink.post(
            'markets/items',
            {
              Sort: 'GRADE',
              CategoryCode: 50000,
              CharacterClass: '',
              ItemTier: null,
              ItemGrade: '',
              ItemName: '융화',
              PageNo: i,
              SortCondition: 'ASC',
            },
            { headers: { 'Content-Type': 'application/json' } },
          );
          reqapi.data.Items.map(
            async (item: {
              Name: string;
              Id: number;
              BundleCount: number;
              CurrentMinPrice: number;
              RecentPrice: number;
              YDayAvgPrice: number;
              Icon: string;
            }) => marketapiupdate(item),
          );
          // for문 멈추고싶은 조건
          if (reqapi.data.Items.length < 10) {
            break;
          }
        }
        //현자의 가루 추가
        for (let i = 1; i < 2; i++) {
          const reqapi = await lostlink.post(
            'markets/items',
            {
              Sort: 'GRADE',
              CategoryCode: 50000,
              CharacterClass: '',
              ItemTier: null,
              ItemGrade: '',
              ItemName: '현자',
              PageNo: i,
              SortCondition: 'ASC',
            },
            { headers: { 'Content-Type': 'application/json' } },
          );
          reqapi.data.Items.map(
            async (item: {
              Name: string;
              Id: number;
              BundleCount: number;
              CurrentMinPrice: number;
              RecentPrice: number;
              YDayAvgPrice: number;
              Icon: string;
            }) => marketapiupdate(item),
          );
        }
        //생활재료 요청 for문
        for (let i = 1; i < 20; i++) {
          const reqapi = await lostlink.post(
            'markets/items',
            {
              Sort: 'GRADE',
              CategoryCode: 90000,
              CharacterClass: '',
              ItemTier: null,
              ItemGrade: '',
              ItemName: '',
              PageNo: i,
              SortCondition: 'ASC',
            },
            { headers: { 'Content-Type': 'application/json' } },
          );
          reqapi.data.Items.map(
            async (item: {
              Name: string;
              Id: number;
              BundleCount: number;
              CurrentMinPrice: number;
              RecentPrice: number;
              YDayAvgPrice: number;
              Icon: string;
            }) => marketapiupdate(item),
          );
          // for문 멈추고싶은 조건
          if (reqapi.data.Items.length < 10) {
            break;
          }
        }

        const notfindMarketItem = {
          Name: '거래소에 없는 아이템',
          Id: 1,
          BundleCount: 1,
          CurrentMinPrice: 0,
          RecentPrice: 0,
          YDayAvgPrice: 0,
          Icon: 'https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_134.png',
        };
        await marketapiupdate(notfindMarketItem);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // 거래소에 없는 아이템 아이콘 만들기 현재는 달인 낚시도구만
  async basicicon() {
    const noitem: string =
      'https://cdn-lostark.game.onstove.com/efui_iconatlas/lifelevel/lifelevel_01_136.png';
    const noitemcode: number = 6811605;
    let icon = this.iconRepository.create({
      icon: noitem.slice(
        'https://cdn-lostark.game.onstove.com/efui_iconatlas/'.length,
      ),
      itemCode: noitemcode,
    });
    try {
      await this.iconRepository.save(icon);
    } catch (err) {}
  }

  async basiccreation() {
    await this.basiccategory();
    await this.basiccmarket();
    await this.basicicon();

    // 여기부터 creationarr로 반복문
    for (const creationOBJ of creationarr) {
      try {
        const duplicationcheck = await this.creationRepository.findOne({
          where: { name: creationOBJ.name },
        });
        if (duplicationcheck) {
          throw Error('duplication Item');
        }

        let findmarket = await this.marketRepository.findOne({
          where: { itemCode: creationOBJ.itemCode },
        });
        if (!findmarket) {
          findmarket = await this.marketRepository.findOne({
            where: { itemCode: 1 },
          });
        }
        const findicon = await this.iconRepository.findOne({
          where: { itemCode: creationOBJ.itemCode },
        });
        const findicategory = await this.categoryRepository.findOne({
          where: { categoryName: creationOBJ.category },
        });

        let creation = this.creationRepository.create({
          name: creationOBJ.name,
          itemCode: creationOBJ.itemCode,
          createBundle: creationOBJ.createBundle,
          energy: creationOBJ.energy,
          createTime: creationOBJ.createTime,
          createCost: creationOBJ.createCost,
          market: findmarket,
          icon: findicon,
          category: findicategory,
        });
        try {
          await this.creationRepository.save(creation);
          // 재료 추가 반복문
          for (const ingredient of creationOBJ.ingredient) {
            const findmarket = await this.marketRepository.findOne({
              where: { name: ingredient.name },
            });
            const ingredientCreate = this.ingredientRepository.create({
              market: findmarket,
              creation: creation,
              ingredientCount: ingredient.ingredientCount,
            });
            await this.ingredientRepository.save(ingredientCreate);
          }
          //재료 추가 반복문 끝
        } catch (err) {
          console.log(err.message);
        }
      } catch (error) {
        if (error.message.includes('duplication Item')) {
        } else {
          console.log(error.message);
        }
      }
    }
    // 여기서 반복문 끝
  }
}
