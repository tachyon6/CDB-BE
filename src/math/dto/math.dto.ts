import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SubjectMathDto {
    @Field(() => Number)
    id: number;
    
    @Field(() => String)
    name: string;

    @Field(() => [SectionMathDto])
    bot: SectionMathDto[];
}

@ObjectType()
export class SectionMathDto {
    @Field(() => Number)
    id: number;

    @Field(() => String)
    name: string;
}

@ObjectType()
export class DiffMathDto {
    @Field(() => Number)
    id: number;

    @Field(() => String)
    name: string;
}

@ObjectType()
export class MonthMathDto {
    @Field(() => Number)
    id: number;

    @Field(() => String)
    name: string
}

@ObjectType()
export class YearMathDto {

    @Field(() => Number)
    id: number;

    @Field(() => String)
    year: string;
}

@ObjectType()
export class TagMathDto {
    @Field(() => Number)
    id: number;

    @Field(() => String)
    name: string;
}

@ObjectType()
export class QuestionMathDto {
    @Field(() => String)
    code: string;

    @Field(() => String)
    answer: string;

    @Field(() => String)
    download_url: string;
  
    @Field(() => Number)
    year_math_id: number;

    @Field(() => [Number])
    section_math_ids: number[];
  
    @Field(() => Number)
    diff_math_id: number;
  
    @Field(() => Number)
    month_math_id: number;
  
    @Field(() => [Number])
    tag_ids: number[];
}

@InputType()
export class CreateQuestionMathDto {
    @Field(() => String)
    code: string;

    @Field(() => String)
    answer: string;

    @Field(() => String)
    download_url: string;

    @Field(() => Number)
    year_math_id: number;

    @Field(() => Number)
    diff_math_id: number;

    @Field(() => Number)
    month_math_id: number;

    @Field(() => [Number])
    section_math_ids: number[];

    @Field(() => [Number])
    tag_ids: number[];
}

@InputType()
export class FilterQuestionMathDto {
    @Field(() => [Number], {nullable: true})
    year_ids: number[];

    @Field(() => [Number], {nullable: true})
    section_ids: number[];

    @Field(() => [Number], {nullable: true})
    diff_ids: number[];

    @Field(() => [Number], {nullable: true})
    month_ids: number[];

    @Field(() => [Number], {nullable: true})
    tag_ids: number[];
}

@InputType()
export class CreateCurationListDto {
    @Field(() => String)
    name: string;

    @Field(() => String)
    subject: string;

    @Field(() => String)
    list: string;
}

@ObjectType()
export class CurationListDto {
    @Field(() => Number)
    id: number;

    @Field(() => String)
    subject: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    list: string;
}

