import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CirugiaPreparations } from '../entities/preparation.entity';
import { SurgeryPreparationStatus } from '../enums/surgery_preparation_status.enum';
import { TypesOfSurgeryPreparations } from '../enums/types_of_surgery_preparations.enum';
import axios from 'axios';

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
    }

    // Itera sobre las preparaciones y obtiene la propiedad `procedure` para cada una
    // Devuelve la lista de preparaciones con la nueva propiedad `procedure`
    return await Promise.all(
      allPreparations.map(async (preparation) => {
        try {
          const { patient_document_number, patient_document_type } =
            preparation;

            //console.log(patient_document_number + ' ---' + patient_document_type)

          const url = process.env.API_URL;
          const token = process.env.API_TOKEN;
          //console.log(url + `/v1/cirugia/get/patient-procedures/${patient_document_number}/${patient_document_type}`)

          const response = await axios.get(
            url +
              `/cirugia/patient-procedures/path/${patient_document_number}/${patient_document_type}`,
            {
              headers: {
                'X-Authorization': token,
              },
            },
          );

          //console.log(response.data?.data[0]?.procedures[0].procedureName || []);

          // Asigna la propiedad `procedure` a la preparación actual
          return {
            ...preparation,
            procedure: response.data?.data[0]?.procedures[0].procedureName || null,
          };
        } catch (error) {
          console.error(
            `Error fetching procedure for document ${preparation.patient_document_number}:`,
            error,
          );
          return {
            ...preparation,
            procedure: null, // Manejo de errores, puede personalizar según sea necesario
          };
        }
      }),
    );
  }

  // PATH FUNTIONS //

  async releaseQuota(idQuota: string) {
    const quotaToReleased = await this.preparationRepository.find({
      where: {
        id: idQuota,
        status: SurgeryPreparationStatus.OCUPADO,
        type:
          TypesOfSurgeryPreparations.TRANSFERENCIA_A_PISO ||
          TypesOfSurgeryPreparations.SALIDA,
      },
    });

    if (!quotaToReleased) {
      return new HttpException(
        `No hay cupos seleccionados`,
        HttpStatus.NO_CONTENT,
      );
    }

    await this.preparationRepository.update(
      { id: idQuota },
      {
        status: SurgeryPreparationStatus.DISPONIBLE,
        patient_document_type: null,
        patient_document_number: null,
      },
    );
  }
}
