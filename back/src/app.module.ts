import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListModule } from './list/list.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormcon } from './config/typeORM.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicvalueModule } from './basicvalue/basicvalue.module';
import { BasicvalueService } from './basicvalue/basicvalue.service';
import { MarketapiMiddleware } from './marketapi/marketapi.middleware';
import { Category } from './entities/category.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Icon } from './entities/icon.entity';
import { Creation } from './entities/creation.entity';
import { LastRequest } from './entities/lastRequest.entity';
import { Market } from './entities/market.entity';
import { DetailitemModule } from './detailitem/detailitem.module';
import { RecipeModule } from './recipe/recipe.module';
import { CategoryModule } from './category/category.module';
import { MarketModule } from './market/market.module';
import { LastreqModule } from './lastreq/lastreq.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormcon,
    }),
    TypeOrmModule.forFeature([
      Category,
      Ingredient,
      Icon,
      Creation,
      LastRequest,
      Market,
    ]),
    ListModule,
    BasicvalueModule,
    DetailitemModule,
    RecipeModule,
    CategoryModule,
    MarketModule,
    LastreqModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, BasicvalueService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MarketapiMiddleware).forRoutes('*');
  }

  constructor(private basicvalue: BasicvalueService) {
    this.basicvalue.basiccreation();
  }
}
