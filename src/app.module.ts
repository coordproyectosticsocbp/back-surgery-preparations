import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CirugiaPreparations } from './preparations/entities/preparation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreparationsModule } from './preparations/preparations.module';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: false,
      logging: false,
    }),
    PreparationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
