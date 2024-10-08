import { CreateMarketDto } from './create-market.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMarketDto extends PartialType(CreateMarketDto) {}
