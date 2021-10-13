import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }
}
