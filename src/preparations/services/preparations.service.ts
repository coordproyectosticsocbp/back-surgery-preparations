import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CirugiaPreparations } from '../entities/preparation.entity';
import { CreatePreparationDto } from '../dto/create-preparation.dto';
import { UpdatePreparationDto } from '../dto/update-preparation.dto';
import { SurgeryPreparationStatus } from '../enums/surgery_preparation_status.enum';
import { TypesOfSurgeryPreparations } from '../enums/types_of_surgery_preparations.enum';

@Injectable()
export class PreparationsService {
  constructor(
    @InjectRepository(CirugiaPreparations)
    private preparationRepository: Repository<CirugiaPreparations>,
  ) {}

  // GET FUNTIONS //

  async getAllPreparations() {
    const allPreparations = await this.preparationRepository.find({
      where: {
        status: SurgeryPreparationStatus.OCUPADO,
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    if (!allPreparations.length) {
      return new HttpException(
        `No hay registros en la base de datos`,
        HttpStatus.NO_CONTENT,
      );
    } else {
      return allPreparations;
    }
  }

  // PATH FUNTIONS //

  async releaseQuota(idQuota: string) {
    const quotaToReleased = await this.preparationRepository.find({
      where: {
        id: idQuota,
        status: SurgeryPreparationStatus.OCUPADO,
        type: TypesOfSurgeryPreparations.TRANSFERENCIA_A_PISO || TypesOfSurgeryPreparations.SALIDA        
      },
    });

    if (!quotaToReleased) {
      return new HttpException(
        `No hay cupos seleccionados`,
        HttpStatus.NO_CONTENT,
      );
    } 

    await  this.preparationRepository.update({id: idQuota},
      {
      status: SurgeryPreparationStatus.DISPONIBLE,
      patient_document_type: null,
      patient_document_number: null
    })
  }
}
