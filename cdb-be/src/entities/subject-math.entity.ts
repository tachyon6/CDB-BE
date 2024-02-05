import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionMath } from './question-math.entity';

@Entity('subject_math')
@ObjectType()
export class SubjectMath {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  unit: string;

  @Column()
  @Field(() => String)
  section: string;

  @OneToMany(() => QuestionMath, (question) => question.math_subject, { onDelete: 'CASCADE' })
  questions: QuestionMath[];
}
