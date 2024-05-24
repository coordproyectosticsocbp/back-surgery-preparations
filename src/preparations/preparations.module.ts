import { Module } from '@nestjs/common';
import { PreparationsService } from './services/preparations.service';
import { PreparationsController } from './controllers/preparations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CirugiaPreparations } from './entities/preparation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CirugiaPreparations])],
  controllers: [PreparationsController],
  providers: [PreparationsService],
})
export class PreparationsModule {}
