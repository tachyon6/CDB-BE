import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
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
import { SubjectMath } from 'src/entities/subject-math.entity';
import { SectionMath } from 'src/entities/section-math.entity';
import { DiffMath } from 'src/entities/diff-math.entity';
import { MonthMath } from 'src/entities/month-math.entity';
import { TagMath } from 'src/entities/tag-math.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionMath } from 'src/entities/question-math.entity';
import { CurationList } from 'src/entities/curation_list.entity';
import { YearMath } from 'src/entities/year-math.entity';

@Injectable()
export class MathService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(QuestionMath)
    private questionMathRepository: Repository<QuestionMath>,
    @InjectRepository(SectionMath)
    private sectionMathRepository: Repository<SectionMath>,
    @InjectRepository(TagMath)
    private tagMathRepository: Repository<TagMath>,
    @InjectRepository(DiffMath)
    private diffMathRepository: Repository<DiffMath>,
    @InjectRepository(MonthMath)
    private monthMathRepository: Repository<MonthMath>,
    @InjectRepository(YearMath)
    private yearMathRepository: Repository<YearMath>,
  ) {}

  async hello(): Promise<string> {
    return 'Hello World!';
  }

  ////대단원 생성하기

  async createSubjectMath(unit: string): Promise<SubjectMathDto> {
    const existingSubject = await this.dataSource
      .getRepository(SubjectMath)
      .findOne({ where: { unit: unit } });

    if (existingSubject) {
      return {
        id: existingSubject.id,
        name: existingSubject.unit,
        bot: existingSubject.sections.map((section) => {
          return {
            id: section.id,
            name: section.section,
          };
        }),
      };
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(SubjectMath)
      .values({ unit: unit })
      .execute();

    const newSubjectId = result.identifiers[0].id;

    const newSubject = await this.dataSource
      .getRepository(SubjectMath)
      .findOne({
        where: { id: newSubjectId },
      });

    if (!newSubject) {
      throw new Error('없는 과목입니다.');
    }
    return {
      id: newSubject.id,
      name: newSubject.unit,
      bot: newSubject.sections.map((section) => {
        return {
          id: section.id,
          name: section.section,
        };
      }),
    };
  }

  ////대단원 목록 가져오기

  async getAllSubjectMath(): Promise<SubjectMathDto[]> {
    const subjects = await this.dataSource
      .getRepository(SubjectMath)
      .find({
        relations: ['sections'],
      });

    return subjects.map((subject) => {
      return {
        id: subject.id,
        name: subject.unit,
        bot: subject.sections.map((section) => {
          return {
            id: section.id,
            name: section.section,
          };
        }),
      };
    });
  }

  ///대단원 하위항목(소단원) 가져오기

  async getAllSectionMath(): Promise<SectionMathDto[]> {
    const sections = await this.dataSource
      .getRepository(SectionMath)
      .find({
        relations: ['subject'],
      });

    return sections.map((section) => {
      return {
        id: section.id,
        name: section.section,
      };
    });
  }

  //// 난이도 목록 가져오기

  async getAllDiffMath(): Promise<DiffMathDto[]> {
    const diffs = await this.dataSource
      .getRepository(DiffMath)
      .find();

    return diffs.map((diff) => {
      return {
        id: diff.id,
        name: diff.name,
      };
    });
  }

  //// 월 목록 가져오기

  async getAllMonthMath(): Promise<MonthMathDto[]> {
    const months = await this.dataSource
      .getRepository(MonthMath)
      .find();

    return months.map((month) => {
      return {
        id: month.id,
        name: month.month,
      };
    });
  }

  //// 태그 목록 가져오기

  async getAllTagMath(): Promise<TagMathDto[]> {
    const tags = await this.dataSource.getRepository(TagMath).find();

    return tags.map((tag) => {
      return {
        id: tag.tag_id,
        name: tag.name,
      };
    });
  }

  //// 시행연도 목록 가져오기

  async getAllYearMath(): Promise<YearMathDto[]> {
    const years = await this.dataSource
      .getRepository(YearMath)
      .find();

    return years.map((year) => {
      return {
        id: year.id,
        year: year.year,
      };
    });
  }

  ////소단원 생성하기

  async createSectionMath(
    section: string,
    unitName: string,
  ): Promise<SectionMathDto> {
    let existingSection = await this.dataSource
      .getRepository(SectionMath)
      .findOne({
        where: { section },
        relations: ['subject'],
      });

    if (existingSection) {
      return {
        id: existingSection.id,
        name: existingSection.section,
      };
    }

    const subject = await this.dataSource
      .getRepository(SubjectMath)
      .findOne({
        where: { unit: unitName },
      });

    if (!subject) {
      throw new Error('SubjectMath not found');
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(SectionMath)
      .values({
        section: section,
        subject: { id: subject.id },
      })
      .execute();

    const newSectionId = result.identifiers[0].id;

    const newSection = await this.dataSource
      .getRepository(SectionMath)
      .findOne({
        where: { id: newSectionId },
        relations: ['subject'],
      });

    return {
      id: newSection.id,
      name: newSection.section,
    };
  }

  ////난이도 생성하기

  async createDiffMath(name: string): Promise<DiffMathDto> {
    const existingDiff = await this.dataSource
      .getRepository(DiffMath)
      .findOne({ where: { name: name } });

    if (existingDiff) {
      return {
        id: existingDiff.id,
        name: existingDiff.name,
      };
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(DiffMath)
      .values({ name: name })
      .execute();

    const newDiffId = result.identifiers[0].id;

    const newDiff = await this.dataSource
      .getRepository(DiffMath)
      .findOne({
        where: { id: newDiffId },
      });

    if (!newDiff) {
      throw new Error('없는 난이도입니다.');
    }
    return {
      id: newDiff.id,
      name: newDiff.name,
    };
  }

  ////시행월 생성하기

  async createMonthMath(month: string): Promise<MonthMathDto> {
    const existingMonth = await this.dataSource
      .getRepository(MonthMath)
      .findOne({ where: { month: month } });

    if (existingMonth) {
      return {
        id: existingMonth.id,
        name: existingMonth.month,
      };
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(MonthMath)
      .values({ month: month })
      .execute();

    const newMonthId = result.identifiers[0].id;

    const newMonth = await this.dataSource
      .getRepository(MonthMath)
      .findOne({
        where: { id: newMonthId },
      });

    if (!newMonth) {
      throw new Error('없는 시행월입니다.');
    }
    return {
      id: newMonth.id,
      name: newMonth.month,
    };
  }

  ////시행연도 생성하기

  async createYearMath(year: string): Promise<YearMathDto> {
    const existingYear = await this.dataSource
      .getRepository(YearMath)
      .findOne({ where: { year: year } });

    if (existingYear) {
      return {
        id: existingYear.id,
        year: existingYear.year,
      };
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(YearMath)
      .values({ year: year })
      .execute();

    const newYearId = result.identifiers[0].id;

    const newYear = await this.dataSource
      .getRepository(YearMath)
      .findOne({
        where: { id: newYearId },
      });

    if (!newYear) {
      throw new Error('없는 시행연도입니다.');
    }
    return {
      id: newYear.id,
      year: newYear.year,
    };
  }

  //// 태그 생성하기
  async createTagMath(name: string): Promise<TagMathDto> {
    const existingTag = await this.dataSource
      .getRepository(TagMath)
      .findOne({ where: { name: name } });

    if (existingTag) {
      return {
        id: existingTag.tag_id,
        name: existingTag.name,
      };
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(TagMath)
      .values({ name: name })
      .execute();

    const newTagId = result.identifiers[0].tag_id;

    const newTag = await this.dataSource
      .getRepository(TagMath)
      .findOne({
        where: { tag_id: newTagId },
      });

    if (!newTag) {
      throw new Error('없는 태그입니다.');
    }
    return {
      id: newTag.tag_id,
      name: newTag.name,
    };
  }

  ////문제 생성하기

  async createQuestionMath(
    createQuestionMathDto: CreateQuestionMathDto,
  ): Promise<QuestionMathDto> {
    const {
      section_math_ids,
      tag_ids,
      diff_math_id,
      month_math_id,
      year_math_id,
      ...questionDetails
    } = createQuestionMathDto;

    //이미 존재하는 code 가 있을 경우 에러
    const existingQuestion = await this.dataSource
      .getRepository(QuestionMath)
      .findOne({
        where: { code: questionDetails.code },
      });

    if (existingQuestion) {
      throw new Error('이미 존재하는 문제 코드입니다.');
    }

    const yearMath = await this.yearMathRepository.findOneBy({
      id: year_math_id,
    });

    const diffMath = await this.diffMathRepository.findOneBy({
      id: diff_math_id,
    });
    const monthMath = await this.monthMathRepository.findOneBy({
      id: month_math_id,
    });
    if (!diffMath || !monthMath || !yearMath) {
      throw new Error('DiffMath or MonthMath entity not found.');
    }

    // QuestionMath 엔티티 생성
    const question = this.questionMathRepository.create({
      ...questionDetails,
      year_math: yearMath,
      diff_math: diffMath,
      month_math: monthMath,
    });

    // SectionMath 엔티티들 조회 및 연결
    if (section_math_ids?.length) {
      const sections = await this.sectionMathRepository.findBy({
        id: In(section_math_ids),
      });
      question.sections = sections;
    }

    // TagMath 엔티티들 조회 및 연결
    if (tag_ids?.length) {
      const tags = await this.tagMathRepository.findBy({
        tag_id: In(tag_ids),
      });
      question.tags = tags;
    }

    // 생성된 QuestionMath 엔티티 저장
    const savedQuestion =
      await this.questionMathRepository.save(question);

    // QuestionMath 엔티티를 QuestionMathDto로 변환
    return {
      code: savedQuestion.code,
      download_url: savedQuestion.download_url,
      year_math_id: savedQuestion.year_math.id,
      section_math_ids:
        savedQuestion.sections?.map((section) => section.id) || [],
      diff_math_id: savedQuestion.diff_math.id,
      month_math_id: savedQuestion.month_math.id,
      tag_ids: savedQuestion.tags?.map((tag) => tag.tag_id) || [],
    };
  }

  ////문제 조회하기

  async getFilterQuestionMath(
    filterQuestionDto: FilterQuestionMathDto,
  ): Promise<String[]> {
    const { year_ids, section_ids, diff_ids, month_ids, tag_ids } =
      filterQuestionDto;

    const queryBuilder =
      this.questionMathRepository.createQueryBuilder('question');

    if (year_ids && year_ids.length > 0) {
      queryBuilder.andWhere(
        'question.year_math_id IN (:...year_ids)',
        { year_ids },
      );
    }

    if (section_ids && section_ids.length > 0) {
      queryBuilder.innerJoin(
        'question.sections',
        'section',
        'section.id IN (:...section_ids)',
        { section_ids },
      );
    }

    if (diff_ids && diff_ids.length > 0) {
      queryBuilder.andWhere(
        'question.diff_math_id IN (:...diff_ids)',
        { diff_ids },
      );
    }

    if (month_ids && month_ids.length > 0) {
      queryBuilder.andWhere(
        'question.month_math_id IN (:...month_ids)',
        { month_ids },
      );
    }

    if (tag_ids && tag_ids.length > 0) {
      queryBuilder.innerJoin(
        'question.tags',
        'tag',
        'tag.tag_id IN (:...tag_ids)',
        { tag_ids },
      );
    }

    const questions = await queryBuilder.getMany();

    return questions.map((question) => question.code);
  }

  ////문제 수정하기

  async updateQuestionMath(
    code: string,
    createQuestionMathDto: CreateQuestionMathDto,
  ): Promise<QuestionMathDto> {
    const {
      section_math_ids,
      tag_ids,
      diff_math_id,
      month_math_id,
      year_math_id,
      ...questionDetails
    } = createQuestionMathDto;

    // code에 해당하는 QuestionMath 엔티티 조회
    const question = await this.questionMathRepository.findOneBy({
      code,
    });
    if (!question) {
      throw new Error('QuestionMath entity not found.');
    }

    const yearMath = await this.yearMathRepository.findOneBy({
      id: year_math_id,
    });
    const diffMath = await this.diffMathRepository.findOneBy({
      id: diff_math_id,
    });
    const monthMath = await this.monthMathRepository.findOneBy({
      id: month_math_id,
    });
    if (!diffMath || !monthMath || !yearMath) {
      throw new Error('DiffMath or MonthMath entity not found.');
    }

    // QuestionMath 엔티티 수정
    question.year_math = yearMath;
    question.code = questionDetails.code;
    question.download_url = questionDetails.download_url;
    question.diff_math = diffMath;
    question.month_math = monthMath;

    // SectionMath 엔티티들 조회 및 연결
    if (section_math_ids?.length) {
      const sections = await this.sectionMathRepository.findBy({
        id: In(section_math_ids),
      });
      question.sections = sections;
    } else {
      question.sections = [];
    }

    // TagMath 엔티티들 조회 및 연결
    if (tag_ids?.length) {
      const tags = await this.tagMathRepository.findBy({
        tag_id: In(tag_ids),
      });
      question.tags = tags;
    } else {
      question.tags = [];
    }

    // 수정된 QuestionMath 엔티티 저장
    const savedQuestion =
      await this.questionMathRepository.save(question);

    // QuestionMath 엔티티를 QuestionMathDto로 변환
    return {
      code: savedQuestion.code,
      download_url: savedQuestion.download_url,
      year_math_id: savedQuestion.year_math.id,
      section_math_ids:
        savedQuestion.sections?.map((section) => section.id) || [],
      diff_math_id: savedQuestion.diff_math.id,
      month_math_id: savedQuestion.month_math.id,
      tag_ids: savedQuestion.tags?.map((tag) => tag.tag_id) || [],
    };
  }

  ////문제 삭제하기

  async deleteQuestionMath(code: string): Promise<String> {
    const question = await this.questionMathRepository.findOneBy({
      code,
    });
    if (!question) {
      throw new Error('QuestionMath entity not found.');
    }

    await this.questionMathRepository.remove(question);

    return '문제가 삭제되었습니다.';
  }

  ////선별 리스트 생성하기

  async createCurationList(
    createCurationListDto: CreateCurationListDto,
  ): Promise<String> {
    const { name, list, subject } = createCurationListDto;

    await this.dataSource
      .getRepository(CurationList)
      .createQueryBuilder()
      .insert()
      .into(CurationList)
      .values({
        name: name,
        subject: subject ,
        list: list,
      })
      .execute();

    return '선별 리스트가 생성되었습니다.';
  }

  ////선별 리스트 조회하기

  async getCurationList(): Promise<CurationListDto[]> {
    const curationLists = await this.dataSource
      .getRepository(CurationList)
      .createQueryBuilder('curation_list')
      .getMany();

    return curationLists.map((curationList) => ({
      id: curationList.id,
      subject: curationList.subject,
      name: curationList.name,
      list: curationList.list,
    }));
  }
}
