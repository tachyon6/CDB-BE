import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

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

@ObjectType()
export class DownloadLogDto {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    title: string;

    @Field(() => String)
    input: string;

    @Field(() => String)
    created_at: String
}