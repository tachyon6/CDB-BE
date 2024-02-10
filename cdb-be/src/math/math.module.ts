import { Module } from '@nestjs/common';
import { MathService } from './math.service';
import { MathResolver } from './math.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectMath } from 'src/entities/subject-math.entity';
import { MonthMath } from 'src/entities/month-math.entity';
import { DiffMath } from 'src/entities/diff-math.entity';
import { QuestionMath } from 'src/entities/question-math.entity';
import { TagMath } from 'src/entities/tag-math.entity';
import { CompleteMath } from 'src/entities/complete-math.entity';
import { SectionMath } from 'src/entities/section-math.entity';
import { CurationList } from 'src/entities/curation_list.entity';
import { YearMath } from 'src/entities/year-math.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubjectMath,
      MonthMath,
      DiffMath,
      QuestionMath,
      TagMath,
      CompleteMath,
      SectionMath,
      CurationList,
      YearMath,
    ]),
  ],
  exports: [MathService, MathResolver],
  providers: [MathService, MathResolver]
})
export class MathModule {}
