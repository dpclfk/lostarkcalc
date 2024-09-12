import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { LastRequest } from 'src/entities/lastRequest.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Market } from 'src/entities/market.entity';
import { Icon } from 'src/entities/icon.entity';

@Injectable()
export class MarketapiMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(LastRequest)
    private lastReqRepository: Repository<LastRequest>,
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    @InjectRepository(Icon)
    private iconRepository: Repository<Icon>,
    private configService: ConfigService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    //api 받아올때 오류날경우(서버 점검등) 바로멈추고 넘어가게 함
    try {
      const lastreq = await this.lastReqRepository.findOne({
        where: { id: 1 },
        select: ['lastReq'],
      });

      if (!lastreq || +new Date() - +lastreq.lastReq > 60000) {
        await this.lastReqRepository.save({
          id: 1,
          lastReq: new Date(),
        });

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
          let icon: Icon = this.iconRepository.create({
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
            const market: Market = this.marketRepository.create({
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
      }
    } catch (error) {
      console.log(error.message);
    }
    next();
  }
}
