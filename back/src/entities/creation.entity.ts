import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Ingredient } from './ingredient.entity';
import { Market } from './market.entity';
import { Icon } from './icon.entity';

@Entity({ name: 'creation' })
export class Creation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ unsigned: true })
  itemCode: number;

  @Column({ unsigned: true, type: 'smallint' })
  createBundle: number;

  @Column({ unsigned: true })
  createTime: number;

  @Column({ unsigned: true })
  createCost: number;

  @Column({ unsigned: true })
  energy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Category, (category) => category.creations, { eager: true })
  category: Category;

  @ManyToOne(() => Market, (market) => market.creations, { eager: true })
  market: Market;

  @ManyToOne(() => Icon, (icon) => icon.creations, { eager: true })
  icon: Icon;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.creation)
  ingredients: Ingredient[];
}
