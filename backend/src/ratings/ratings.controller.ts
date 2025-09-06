import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';




@Controller('ratings')
export class RatingsController {

  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  createRating(@Body() body: { stars: number; userId: number; storeId: number; comment?: string }) {
    return this.ratingsService.create(body);
    
  }

  @Put(':id')
  updateRating(
    @Param('id') id: string,
    @Body() body: { stars: number; comment?: string }
  ) {

    return this.ratingsService.update(id, body);

  }

  @Get('store/:storeId')
  getRatingsByStore(@Param('storeId') storeId: string) {

    return this.ratingsService.findByStore(storeId);

  }


  @Get('count')
  getRatingCount() {

    return this.ratingsService.count();

  }

  @Get()
  getRatings() {

    return this.ratingsService.findAll();

  }

  @Get(':id')
  getRating(@Param('id') id: string) {

    return this.ratingsService.findOne(id);

  }

  @Delete(':id')
  deleteRating(@Param('id') id: string) {


    return this.ratingsService.delete(id);
    
  }
}
