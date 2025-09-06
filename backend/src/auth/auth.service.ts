import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';

import * as bcrypt from 'bcryptjs';




@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,

  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {

    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {

      return user;

    }
    return null;

  }


  async login(user: User) {

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };

  }

  async signup(email: string, password: string, role: UserRole, name: string, address: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {

      throw new UnauthorizedException('Email already exists');
    }

    const user = await this.usersService.create(email, password, role, name, address);
    
    return this.login(user);
  }
}


