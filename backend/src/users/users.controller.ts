import { Controller, Get, Post, Body, Query, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}
  @Delete(':id')
  deleteUser(@Param('id') id: string) {

    return this.usersService.delete(id);

  }

  @Get('count')
  getUserCount() {

    return this.usersService.count();
  }

  @Get()
  getUsers(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }

  @Get(':id')

  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('admin-create')
  createUser(@Body() body: any) {

    return this.usersService.create(
      body.email,
      body.password,
      body.role,
      body.name,
      body.address
    );
  }
}


