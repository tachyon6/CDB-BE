import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { YearMath } from 'src/entities/year-math.entity';
import {
  CreateCurationListDto,
  CreateQuestionMathDto,
  CurationListDto,
  DiffMathDto,
  FilterQuestionMathDto,
  MonthMathDto,
  QuestionMathDto,
  SectionMathDto,
  SubjectMathDto,
  TagMathDto,
  YearMathDto,
} from './dto/math.dto';
import { MathService } from './math.service';

@Resolver()
export class MathResolver {
  constructor(private readonly mathService: MathService) { }

  ////테스트용

  @Query(() => String)
  async hello(): Promise<string> {
    return await this.mathService.hello();
  }

  ////대단원 가져오기

  @Query(() => [SubjectMathDto], { nullable: true })
  async getAllSubjectMath(): Promise<SubjectMathDto[]> {
    return this.mathService.getAllSubjectMath();
  }

  ////중단원 가져오기

  @Query(() => [SectionMathDto], { nullable: true })
  async getAllSectionMath(
  ): Promise<SectionMathDto[]> {
    return this.mathService.getAllSectionMath();
  }

  ////난이도 가져오기

  @Query(() => [DiffMathDto], { nullable: true })
  async getAllDiffMath(): Promise<DiffMathDto[]> {
    return this.mathService.getAllDiffMath();
  }

  ////시행월 가져오기

  @Query(() => [MonthMathDto], { nullable: true })
  async getAllMonthMath(): Promise<MonthMathDto[]> {
    return this.mathService.getAllMonthMath();
  }

  ////태그 가져오기

  @Query(() => [TagMathDto], { nullable: true })
  async getAllTagMath(): Promise<TagMathDto[]> {
    return this.mathService.getAllTagMath();
  }

  @Query(() => [YearMathDto], { nullable: true })
  async getAllYearMath(): Promise<YearMathDto[]> {
    return this.mathService.getAllYearMath();
  }

  ////대단원 생성하기

  @Mutation(() => SubjectMathDto)
  async createSubjectMath(
    @Args('unit') unit: string,
  ): Promise<SubjectMathDto> {
    return this.mathService.createSubjectMath(unit);
  }

  ////중단원 생성하기

  @Mutation(() => SectionMathDto)
  async createSectionMath(
    @Args('section') section: string,
    @Args('unit_name') unitName: string,
  ): Promise<SectionMathDto> {
    return this.mathService.createSectionMath(section, unitName);
  }

  ////난이도 생성하기

  @Mutation(() => DiffMathDto)
  async createDiffMath(
    @Args('name') name: string,
  ): Promise<DiffMathDto> {
    return this.mathService.createDiffMath(name);
  }

  //시행월 생성하기

  @Mutation(() => MonthMathDto)
  async createMonthMath(
    @Args('month') month: string,
  ): Promise<MonthMathDto> {
    return this.mathService.createMonthMath(month);
  }

  //시행년도 생성하기

  @Mutation(() => YearMathDto)
  async createYearMath(
    @Args('year') year: string,
  ): Promise<YearMathDto> {
    return this.mathService.createYearMath(year);
  }


  //태그 생성하기

  @Mutation(() => TagMathDto)
  async createTagMath(
    @Args('name') name: string,
  ): Promise<TagMathDto> {
    return this.mathService.createTagMath(name);
  }

  //// 문항 생성하기
  @Mutation(() => QuestionMathDto)
  async createQuestionMath(
    @Args('create_question_math')
    createQuestionMathDto: CreateQuestionMathDto,
  ): Promise<QuestionMathDto> {
    return this.mathService.createQuestionMath(createQuestionMathDto);
  }

  ////문항 조회
  @Query(() => [String], { nullable: true })
  async getFilterQuestionMath(
    @Args('filter_question_math')
    filterQuestionMathDto: FilterQuestionMathDto,
  ): Promise<String[]> {
    return this.mathService.getFilterQuestionMath(
      filterQuestionMathDto,
    );
  }

  ////문항 수정
  @Mutation(() => QuestionMathDto)
  async updateQuestionMath(
    @Args('create_question_math')
    createQuestionMathDto: CreateQuestionMathDto,
    @Args('code') code: string,
  ): Promise<QuestionMathDto> {
    return this.mathService.updateQuestionMath(code, createQuestionMathDto);
  }

  ////문항 삭제
  @Mutation(() => String)
  async deleteQuestionMath(
    @Args('code') code: string,
  ): Promise<String> {
    return this.mathService.deleteQuestionMath(code);
  }

  ////선별 리스트 생성하기
  @Mutation(() => String)
  async createCurationList(
    @Args('create_curation_list') createCurationList: CreateCurationListDto
  ): Promise<String> {
    return this.mathService.createCurationList(createCurationList);
  }

  @Query(() => [CurationListDto], { nullable: true })
  async getCurationList(): Promise<CurationListDto[]> {
    return this.mathService.getCurationList();
  }

  @Mutation(() => String)
  async deleteCurationList(
    @Args('curation_id') curationId: number 
  ): Promise<String> {
    return this.mathService.deleteCurationList(curationId);
  }

  @Mutation(() => String)
  async updateCurationList(
    @Args('curation_id') curationId: number,
    @Args('create_curation_list') createCurationList: CreateCurationListDto
  ): Promise<String> {
    return this.mathService.updateCurationList(curationId, createCurationList);
  }

  @Query(() => CurationListDto, { nullable: true })
  async getOneCurationList(
    @Args('curation_id') curationId: number
  ): Promise<CurationListDto> {
    return this.mathService.getOneCurationList(curationId);
  }



}
