import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar')
  userId: string;
  @Column('varchar')
  symbol: string;
  @Column('timestamptz')
  date: Date;
  @Column('varchar')
  open: string;
  @Column('varchar')
  high: string;
  @Column('varchar')
  low: string;
  @Column('varchar')
  close: string;
  @Column('varchar')
  name: string;
  @Column('integer')
  times_requested: number;
  @CreateDateColumn()
  createdAt: Date;
}
