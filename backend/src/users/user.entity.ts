import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';




export enum UserRole {

  USER = 'user',
  OWNER = 'owner',
  ADMIN = 'admin',

}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 60, nullable: true })
  name: string;

  @Column({ length: 400, nullable: true })
  address: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  
}
