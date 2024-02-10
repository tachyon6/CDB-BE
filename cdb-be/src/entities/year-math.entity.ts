import { Field, ID } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionMath } from './question-math.entity';

@Entity('year_math')
export class YearMath {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => String)
  @Column()
  year: string;

  @OneToMany(() => QuestionMath, (question) => question.year_math, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    questions: QuestionMath[];
}
