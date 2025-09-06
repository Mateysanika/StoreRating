import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';




@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;


  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  owner: User;

}


