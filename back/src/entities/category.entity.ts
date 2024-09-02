import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Creation } from './creation.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true })
  categoryName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Creation, (creation) => creation.category)
  creations: Creation[];
}
