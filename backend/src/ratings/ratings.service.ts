

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';




@Injectable()
export class RatingsService {

  constructor(

    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,

  ) {}

  async findByStore(storeId: string): Promise<Rating[]> {

    return this.ratingsRepository.find({ where: { store: { id: parseInt(storeId, 10) } }, relations: ['user', 'store'] });

  }

  async count(): Promise<number> {

    return this.ratingsRepository.count();

  }

  async findAll(): Promise<Rating[]> {

    return this.ratingsRepository.find({ relations: ['user', 'store'] });



  }

  async findOne(id: string): Promise<Rating | undefined> {

    const rating = await this.ratingsRepository.findOne({ where: { id: parseInt(id, 10) } });
    return rating || undefined;

  }
  async create(data: { stars: number; userId: number; storeId: number; comment?: string }): Promise<Rating> {

    const userRepo = this.ratingsRepository.manager.getRepository(User);

    const storeRepo = this.ratingsRepository.manager.getRepository(Store);
    const user = await userRepo.findOne({ where: { id: data.userId } });

    const store = await storeRepo.findOne({ where: { id: data.storeId } });

    if (!user || !store) throw new Error('User or Store not found');




    let rating = await this.ratingsRepository.findOne({ where: { user: { id: data.userId }, store: { id: data.storeId } }, relations: ['user', 'store'] });
    if (rating) {

      rating.stars = data.stars;
      if (data.comment !== undefined) rating.comment = data.comment;
    } else {

      rating = this.ratingsRepository.create({

        stars: data.stars,
        comment: data.comment,
        user,
        store,


      });
    }
    return this.ratingsRepository.save(rating);


  }

  async update(id: string, data: { stars: number; comment?: string }): Promise<Rating | undefined> {


    const rating = await this.ratingsRepository.findOne({ where: { id: parseInt(id, 10) } });
    if (!rating) return undefined;

    rating.stars = data.stars;
    if (data.comment !== undefined) rating.comment = data.comment;
    return this.ratingsRepository.save(rating);


  }



  async delete(id: string): Promise<{ deleted: boolean }> {

    const result = await this.ratingsRepository.delete({ id: parseInt(id, 10) });
    return { deleted: !!result.affected };
    
  }

}
