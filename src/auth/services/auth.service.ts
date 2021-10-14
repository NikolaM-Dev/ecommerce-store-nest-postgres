import { compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PayloadToken } from '../models';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async comparePassword(user: User, candidatePassword: string) {
    return await compare(candidatePassword, user.password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const isValidPassword = await this.comparePassword(user, password);

    if (user && isValidPassword) return user;

    return null;
  }

  async login(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
