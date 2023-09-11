import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ROLE } from './role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('varchar')
  email: string;
  @Column('enum', {
    enum: ROLE,
  })
  role: ROLE;
  @Column('varchar')
  password: string;
  @CreateDateColumn()
  createdAt: Date;
}
