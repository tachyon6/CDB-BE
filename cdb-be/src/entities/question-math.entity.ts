import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiffMath } from "./diff-math.entity";
import { MonthMath } from "./month-math.entity";
import { SubjectMath } from "./subject-math.entity";
import { TagMath } from "./tag-math.entity";

@Entity('question_math')
@ObjectType()
export class QuestionMath{
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @ManyToOne(() => SubjectMath, subject => subject.questions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'subject_math_id'})
    math_subject: SubjectMath;

    @ManyToOne(() => DiffMath, diff => diff.questions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'diff_math_id'})
    math_diff: DiffMath;

    @ManyToOne(() => MonthMath, month => month.questions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'month_math_id'})
    math_month: MonthMath;

    @Column()
    code: string;

    @Column()
    download_url: string;

    @Column()
    year: number;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Field(() => [TagMath])
    @ManyToMany(() => TagMath)
    @JoinTable({
        name: "mathq_tag", // This specifies the join table name
        joinColumn: {
            name: "question_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "tag_id",
            referencedColumnName: "tag_id",
        },
    })
    tags: TagMath[];
}