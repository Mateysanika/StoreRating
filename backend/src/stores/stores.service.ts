import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { User } from '../users/user.entity';

@Injectable()

export class StoresService {

  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,

  ) {}

  async findByOwner(ownerId: string): Promise<Store[]> {

    return this.storesRepository.find({ where: { owner: { id: parseInt(ownerId, 10) } }, relations: ['owner'] });

  }

  async count(): Promise<number> {

    return this.storesRepository.count();

  }

  async findAll(): Promise<Store[]> {

    return this.storesRepository.find({ relations: ['owner'] });

  }

  async findOne(id: string): Promise<Store | undefined> {

    const store = await this.storesRepository.findOne({ where: { id: parseInt(id, 10) } });
    return store || undefined;

  }

  async create(data: { name: string; address: string; description?: string; ownerId: number }): Promise<Store> {

    const owner = await this.storesRepository.manager.getRepository(User).findOne({ where: { id: data.ownerId } });

    if (!owner) throw new Error('Owner not found');
    const store = this.storesRepository.create({

      name: data.name,
      address: data.address,
      description: data.description,
      owner,

    });

    return this.storesRepository.save(store);

  }

  async update(id: string, data: { name?: string; address?: string }): Promise<Store | undefined> {
    const store = await this.storesRepository.findOne({ where: { id: parseInt(id, 10) } });
    if (!store) return undefined;
    if (data.name !== undefined) store.name = data.name;
    if (data.address !== undefined) store.address = data.address;
    return this.storesRepository.save(store);

  }

  async delete(id: string): Promise<{ deleted: boolean }> {

    const result = await this.storesRepository.delete({ id: parseInt(id, 10) });
    return { deleted: !!result.affected };
    
  }
}
