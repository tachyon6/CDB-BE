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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_SECRET,
      database: process.env.DB_DATABASE,
      entities: [DiffMath, MonthMath, QuestionMath, SubjectMath, TagMath],
      synchronize: false,
      timezone: 'Z',
    }),
    CreateFileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
