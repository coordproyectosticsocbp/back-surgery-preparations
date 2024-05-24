import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypesOfSurgeryPreparations } from '../enums/types_of_surgery_preparations.enum';
import { IdType } from 'src/utils/enums/id_type.enum';
import { SurgeryPreparationStatus } from '../enums/surgery_preparation_status.enum';

@Entity()
export class CirugiaPreparations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number_room: number;

  @Column({ nullable: true })
  type: TypesOfSurgeryPreparations;

  @Column({ nullable: true })
  patient_document_type: IdType;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  patient_document_number: number;

  @Column({ nullable: true })
  status: SurgeryPreparationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
