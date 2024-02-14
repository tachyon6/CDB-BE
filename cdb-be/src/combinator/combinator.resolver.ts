import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CombinatorService } from './combinator.service';
import { CompleteFileInput } from './dto/create-file.dto';

@Resolver()
export class CombinatorResolver {
    constructor(private combinatorService: CombinatorService) { }

    @Query(() => String)
    async hello(): Promise<string> {
        return await this.combinatorService.hello();
    }

    @Mutation(() => String)
    async combine(
        @Args('complete_file_input') completeFileInput: CompleteFileInput,
    ): Promise<string> {
        return await this.combinatorService.combine(completeFileInput);
    }
}
