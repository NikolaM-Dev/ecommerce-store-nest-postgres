import { compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async comparePassword(user: User, candidatePassword: string) {
    return await compare(candidatePassword, user.password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const isValidPassword = await this.comparePassword(user, password);

    if (user && isValidPassword) return user;

    return null;
  }
}
