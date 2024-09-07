import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isDeleted?: boolean;

  @CreateDateColumn()
  creationTimestamp?: Date;

  @UpdateDateColumn()
  lastUpdateTimestamp?: Date;
}
