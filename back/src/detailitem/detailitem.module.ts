import { Module } from '@nestjs/common';
import { DetailitemService } from './detailitem.service';
import { DetailitemController } from './detailitem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creation } from 'src/entities/creation.entity';
import { Ingredient } from 'src/entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creation, Ingredient])],
  controllers: [DetailitemController],
  providers: [DetailitemService],
})
export class DetailitemModule {}
