import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('math_complete')
@ObjectType()
export class CompleteMath {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field(() => String)
    code: string;

    @Column()
    @Field(() => String)
    download_url: string;

}