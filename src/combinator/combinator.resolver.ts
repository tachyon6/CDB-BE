import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CombinatorService } from './combinator.service';
import { CompleteFileInput, DownloadLogDto } from './dto/create-file.dto';
import { DownloadLog } from 'src/entities/download-log.entity';

@Resolver()
export class CombinatorResolver {
    constructor(private combinatorService: CombinatorService) { }

    @Query(() => String)
    async hello(): Promise<string> {
        return await this.combinatorService.hello();
    }

    @Mutation(() => String)
    async createDownloadLog(
        @Args('title') title: string,
        @Args('input') input: string,
    ): Promise<string> {
        return await this.combinatorService.createDownloadLog(title, input);
    }

    @Query(() => [DownloadLogDto], { nullable: true })
    async getDownloadLogByDay(
        @Args('date') date: string,
    ): Promise<DownloadLogDto[]> {
        return await this.combinatorService.getDownloadLogByDay(date);
    }


    @Mutation(() => String)
    async combine(
        @Args('complete_file_input') completeFileInput: CompleteFileInput,
    ): Promise<string> {
        return await this.combinatorService.combine(completeFileInput);
    }
}
