import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LastRequest } from 'src/entities/lastRequest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LastreqService {
  constructor(
    @InjectRepository(LastRequest)
    private lastReqRepository: Repository<LastRequest>,
  ) {}

  async findAll() {
    try {
      console.log('qwr');
      let lastreq = await this.lastReqRepository.findOne({
        where: { id: 1 },
        select: ['lastReq'],
      });

      return lastreq;
    } catch (err) {
      return { result: 'fail' };
    }
  }
}
