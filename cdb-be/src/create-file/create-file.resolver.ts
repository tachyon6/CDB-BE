import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateFileService } from './create-file.service';
import { CreateFileInput } from './dto/create-file.dto';

@Resolver()
export class CreateFileResolver {
    constructor(private createFileService: CreateFileService) { }

    @Query(() => String)
    async hello(): Promise<string> {
        return await this.createFileService.hello();
    }

    @Mutation(() => String)
    async createFile(
        @Args('create_file_input') createFileInput: CreateFileInput, 
    ): Promise<string> {
        return await this.createFileService.createFile(createFileInput);
    }
}
