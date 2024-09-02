import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { Creation } from './creation.entity';
import { Icon } from './icon.entity';

@Entity({ name: 'market' })
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ unsigned: true, unique: true })
  itemCode: number;

  @Column({ unsigned: true, type: 'smallint' })
  bundle: number;

  @Column({ unsigned: true })
  currentMinPrice: number;

  @Column({ unsigned: true })
  recentPrice: number;

  @Column({ unsigned: true })
  yDayAvgPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.market)
  ingredients: Ingredient[];

  @OneToMany(() => Creation, (creation) => creation.market)
  creations: Creation[];

  @ManyToOne(() => Icon, (icon) => icon.markets, { eager: true })
  icon: Icon;
}
