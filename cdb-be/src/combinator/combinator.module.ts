import { Module } from '@nestjs/common';
import { CombinatorResolver } from './combinator.resolver';
import { CombinatorService } from './combinator.service';

@Module({
  providers: [CombinatorService, CombinatorResolver]
})
export class CombinatorModule {}
