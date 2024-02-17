import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuestionMath } from "./question-math.entity";
import { SubjectMath } from "./subject-math.entity";

@Entity('section_math')
@ObjectType()
export class SectionMath{
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field(() => String)
    section: string;

    @ManyToOne(() => SubjectMath, subject => subject.sections, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'unit_id'})
    subject: SubjectMath;

    @ManyToMany(() => QuestionMath, question => question.sections)
    questions: QuestionMath[];
}