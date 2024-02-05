import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionMath } from './question-math.entity';

@Entity('month_math')
@ObjectType()
export class MonthMath {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => Number)
  month: number;

  @OneToMany(() => QuestionMath, (question) => question.math_month, { onDelete: 'CASCADE' })
  questions: QuestionMath[];
}
