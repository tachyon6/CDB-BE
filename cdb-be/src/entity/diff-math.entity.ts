import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionMath } from './question-math.entity';

@Entity('diff_math')
@ObjectType()
export class DiffMath {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @OneToMany(() => QuestionMath, (question) => question.math_diff, { onDelete: 'CASCADE' })
  questions: QuestionMath[];
}
