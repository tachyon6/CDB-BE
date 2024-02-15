import { Module } from '@nestjs/common';
import { CombinatorResolver } from './combinator.resolver';
import { CombinatorService } from './combinator.service';
import { QuestionMath } from 'src/entities/question-math.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompleteMath } from 'src/entities/complete-math.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionMath,
      CompleteMath,
    ])],
  providers: [CombinatorService, CombinatorResolver],
})
export class CombinatorModule { }
