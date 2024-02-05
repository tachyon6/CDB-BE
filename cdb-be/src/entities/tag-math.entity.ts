import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuestionMath } from "./question-math.entity";

@Entity('tag_math')
@ObjectType()
export class TagMath {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    tag_id: number;

    @Column()
    @Field(() => String)
    name: string;

    @Field(() => [QuestionMath])
    @ManyToMany(() => QuestionMath, question => question.tags)
    questions: QuestionMath[];
}
