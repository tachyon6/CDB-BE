import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SectionMath } from './section-math.entity';

@Entity('subject_math')
@ObjectType()
export class SubjectMath {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  unit: string;

  @OneToMany(() => SectionMath, (section) => section.subject, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  sections: SectionMath[];

}
