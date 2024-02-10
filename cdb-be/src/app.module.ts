import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CreateFileModule } from './create-file/create-file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DiffMath } from './entities/diff-math.entity';
import { MonthMath } from './entities/month-math.entity';
import { QuestionMath } from './entities/question-math.entity';
import { SubjectMath } from './entities/subject-math.entity';
import { TagMath } from './entities/tag-math.entity';
import { MathModule } from './math/math.module';
import { SectionMath } from './entities/section-math.entity';
import { CompleteMath } from './entities/complete-math.entity';
import { CurationList } from './entities/curation_list.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_SECRET,
      database: process.env.MYSQL_DATABASE,
      entities: [DiffMath, MonthMath, QuestionMath, SubjectMath, TagMath, SectionMath, CompleteMath, CurationList],
      synchronize: false,
      timezone: 'Z',
    }),
    //CreateFileModule,
    MathModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
