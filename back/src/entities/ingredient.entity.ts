import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Creation } from './creation.entity';
import { Market } from './market.entity';

@Entity({ name: 'ingredient' })
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unsigned: true, type: 'smallint' })
  ingredientCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Creation, (creation) => creation.ingredients, {})
  creation: Creation;

  @ManyToOne(() => Market, (market) => market.ingredients, { eager: true })
  market: Market;
}
