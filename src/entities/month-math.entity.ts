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
  @Field(() => String)
  month: string;

  @OneToMany(() => QuestionMath, (question) => question.month_math, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  questions: QuestionMath[];
}
