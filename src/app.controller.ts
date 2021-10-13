import { Controller, Get, UseGuards } from '@nestjs/common';

import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { AppService } from './app.service';
import { IsPublic } from './auth/decorators/is-public.decorator';

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @IsPublic()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): string {
    return 'test 👀';
  }

  @Get('tasks')
  findManyTasks() {
    return this.appService.findManyTasks();
  }
}
