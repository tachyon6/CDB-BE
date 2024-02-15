import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CompleteFileInput {
    
    @Field(() => [String])
    question_codes: string[];

    @Field(() => String)
    file_name: string;
}

@InputType()
export class Codes {
    @Field(() => [String])
    question_codes: string[];
}