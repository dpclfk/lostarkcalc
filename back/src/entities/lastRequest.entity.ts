import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'lastRequest' })
export class LastRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  lastReq: Date;
}
