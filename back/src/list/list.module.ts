import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creation } from 'src/entities/creation.entity';
import { Ingredient } from 'src/entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creation, Ingredient])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
