import { Field, InputType, Int } from "@nestjs/graphql";
import { In } from "typeorm";

@InputType()
export class CompleteFileInput {
    
    @Field(() => [Int])
    question_codes: number[];

    @Field(() => String)
    file_name: string;
}