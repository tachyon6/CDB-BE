import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateFileInput {
    @Field(() => [Int])
    numberInput: number[];
}