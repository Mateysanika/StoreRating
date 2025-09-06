import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';



@Module({
  
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'pramay@123',
      database: process.env.POSTGRES_DB || 'postgres',
      autoLoadEntities: true,
      synchronize: true,

    }),

  UsersModule,
  AuthModule,
  StoresModule,
  RatingsModule,


  ],
  controllers: [AppController],
  providers: [AppService],

})


export class AppModule {}
