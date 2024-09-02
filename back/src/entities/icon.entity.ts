import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Market } from './market.entity';
import { Creation } from './creation.entity';

@Entity({ name: 'icon' })
export class Icon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unsigned: true, unique: true })
  itemCode: number;

  @Column({ unique: true })
  icon: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Creation, (creation) => creation.icon)
  creations: Creation[];

  @OneToMany(() => Market, (market) => market.icon)
  markets: Market[];
}
