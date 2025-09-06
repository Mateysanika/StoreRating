import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard, Roles } from './auth/roles.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin-only')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAdminData(): string {
    return 'This is only for admins!';
  }
}
