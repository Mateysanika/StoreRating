import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';



@Entity()
export class Rating {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  stars: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Store, store => store.id, { onDelete: 'CASCADE' })
  store: Store;
}
