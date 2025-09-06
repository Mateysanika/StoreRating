import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';




@Injectable()

export class UsersService {
  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.usersRepository.delete({ id: parseInt(id, 10) });
    return { deleted: !!result.affected };

  }

  constructor(

    @InjectRepository(User)
    private usersRepository: Repository<User>,

  ) {}

  async create(email: string, password: string, role: UserRole, name: string, address: string): Promise<User> {

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');

    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashedPassword, role, name, address });
    return this.usersRepository.save(user);
  }


  async findByEmail(email: string): Promise<User | undefined> {

  const user = await this.usersRepository.findOne({ where: { email } });
  return user || undefined;

  }
  
  async count(): Promise<number> {

    return this.usersRepository.count();

  }

  async findAll(role?: string): Promise<User[]> {

    if (role) {
      return this.usersRepository.find({ where: { role: role as UserRole } });
    }
    return this.usersRepository.find();

  }

  async findOne(id: string): Promise<User | undefined> {

    const user = await this.usersRepository.findOne({ where: { id: parseInt(id, 10) } });
    return user || undefined;

  }
}

