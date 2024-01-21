import { Module } from '@nestjs/common';
import { CreateFileService } from './create-file.service';
import { CreateFileResolver } from './create-file.resolver';

@Module({
  providers: [CreateFileService, CreateFileResolver]
})
export class CreateFileModule {}
