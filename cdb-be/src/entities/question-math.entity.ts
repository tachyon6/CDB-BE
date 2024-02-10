import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DiffMath } from "./diff-math.entity";
import { MonthMath } from "./month-math.entity";
import { SectionMath } from "./section-math.entity";
import { TagMath } from "./tag-math.entity";
import { YearMath } from "./year-math.entity";

@Entity('question_math')
@ObjectType()
export class QuestionMath{
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    question_id: number;

    @ManyToMany(() => SectionMath, section => section.questions, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinTable({
        name: "mathq_sec",
        joinColumn: {
            name: "question_id",
            referencedColumnName: "question_id",
        },
        inverseJoinColumn: {
            name: "section_id",
            referencedColumnName: "id",
        },
    })
    sections: SectionMath[];

    @ManyToOne(() => DiffMath, diff => diff.questions, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'diff_math_id'})
    diff_math: DiffMath;

    @ManyToOne(() => MonthMath, month => month.questions, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'month_math_id'})
    month_math: MonthMath;

    @ManyToOne(() => YearMath , year => year.questions, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'year_math_id'})
    year_math: YearMath;

    @Column()
    @Field(() => String)
    code: string;

    @Column()
    @Field(() => String)
    download_url: string;

    @Column()
    @Field(() => Number)
    year: number;

    @CreateDateColumn()
    @Field(() => Date)
    created_at: Date;

    @UpdateDateColumn()
    @Field(() => Date)
    updated_at: Date;

    @Field(() => [TagMath])
    @ManyToMany(() => TagMath)
    @JoinTable({
        name: "mathq_tag",
        joinColumn: {
            name: "question_id",
            referencedColumnName: "question_id",
        },
        inverseJoinColumn: {
            name: "tag_id",
            referencedColumnName: "tag_id",
        },
    })
    tags: TagMath[];
}