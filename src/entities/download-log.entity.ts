import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class DownloadLog {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field(() => String)
    title: string;

    @Column()
    @Field(() => String)
    input: string;

    @CreateDateColumn()
    @Field(() => Date)
    created_at: Date;
}
