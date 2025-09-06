
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StoresService } from './stores.service';



@Controller('stores')

export class StoresController {

  constructor(private readonly storesService: StoresService) {}

  @Get('owner/:ownerId')
  getStoresByOwner(@Param('ownerId') ownerId: string) {

    return this.storesService.findByOwner(ownerId);

  }

  @Get('count')
  getStoreCount() {

    return this.storesService.count();
  }

  @Get()
  getStores() {

    return this.storesService.findAll();
  }

  @Get(':id')
  getStore(@Param('id') id: string) {

    return this.storesService.findOne(id);

  }

  @Post('admin-create')
  createStore(@Body() body: any) {

    return this.storesService.create({

      name: body.name,
      address: body.address,
      description: body.description,
      ownerId: body.ownerId,


    });
  }

  @Put(':id')
  updateStore(@Param('id') id: string, @Body() body: any) {

  
    return this.storesService.update(id, body);

  }

  @Delete(':id')
  deleteStore(@Param('id') id: string) {

    return this.storesService.delete(id);

    
  }
}
