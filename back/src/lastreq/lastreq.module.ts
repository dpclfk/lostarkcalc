import { Module } from '@nestjs/common';
import { LastreqService } from './lastreq.service';
import { LastreqController } from './lastreq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastRequest } from 'src/entities/lastRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LastRequest])],
  controllers: [LastreqController],
  providers: [LastreqService],
})
export class LastreqModule {}
