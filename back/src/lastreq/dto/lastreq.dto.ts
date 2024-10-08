import { ApiProperty } from '@nestjs/swagger';

export class LastReqDto {
  @ApiProperty()
  lastReq: Date;
}
