import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { Codes, CompleteFileInput } from './dto/create-file.dto';
import { DataSource, In } from 'typeorm';
import { QuestionMath } from 'src/entities/question-math.entity';
import { createHash } from 'crypto';
import { CompleteMath } from 'src/entities/complete-math.entity';


@Injectable()
export class CombinatorService {
    constructor(
        private readonly dataSource: DataSource,
    ) { }

    async isCodeExist(code: string): Promise<boolean> {
        const question = await this.dataSource
            .getRepository(QuestionMath)
            .findOne({ where: { code } });

        return !!question;
    }

    async hello(): Promise<string> {
        return 'Hello World!';
    }

    async getQuestionAnswers(codes: Codes): Promise<string[]> {
        const uniqueCodes = [...new Set(codes.question_codes)];
        const questions = await this.dataSource
            .getRepository(QuestionMath)
            .findBy({ code: In(uniqueCodes) });

        const questionsMap = new Map(questions.map(question => [question.code, question.answer]));

        return codes.question_codes.map(code => questionsMap.get(code) || '');
    }

    async combine(completeFileInput: CompleteFileInput): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const title = completeFileInput.file_name;
            const inputArgs = completeFileInput.question_codes;

            const inputString = inputArgs.join('_');
            const fileName = createHash('md5').update(inputString).digest('hex');


            try {
                const checks = await Promise.all(inputArgs.map(async (code) => {
                    const exists = await this.isCodeExist(code);
                    return { code, exists };
                }));

                const notExistCodes = checks.filter(check => !check.exists).map(check => check.code);
                if (notExistCodes.length > 0) {
                    // 존재하지 않는 코드가 있을 경우 에러 메시지 반환
                    return reject(`문항번호 ${notExistCodes.join(', ') + '가 존재하지 않는 문항 번호입니다.'}`);
                }

                const python = spawn('python', ['./python/combinator.py', fileName, title, ...inputArgs]);
                let dataToSend = '';

                python.stdout.on('data', (data) => {
                    const output = data.toString().trim();
                    if (output.startsWith('Done')) {
                        dataToSend = output.replace('Done', '').trim(); // 'Done' 이후의 문자열을 fileName으로 추정
                    }
                });

                python.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });

                python.on('close', async (code) => {
                    if (code === 0) {
                        console.log(`File Created Complete ${code}`);

                        const existingMath = await this.dataSource.getRepository(CompleteMath).findOne({ where: { code: fileName } });

                        if (existingMath) {
                            resolve(fileName);
                        } else {
                            const completeMath = this.dataSource.getRepository(CompleteMath).create({
                                code: fileName,
                                download_url: `https://cdb-math.s3.ap-northeast-2.amazonaws.com/uploads/results/${fileName}.pdf`
                            });
                            await this.dataSource.getRepository(CompleteMath).save(completeMath);
                            resolve(fileName);
                        }
                    } else {
                        console.error(`Error: Python script exited with code ${code}`);
                        reject(`Python script exited with code ${code}`);
                    }
                });

                const answers = await this.getQuestionAnswers({ question_codes: inputArgs });
                const python_answer = spawn('python', ['./python/fast-answer.py', fileName, ...answers]);
                python_answer.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                });

                python_answer.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });

                python_answer.on('close', (code) => {
                    if (code === 0) {
                        console.log(`Answer Complete ${code}`);
                    } else {
                        console.error(`Error: Python script exited with code ${code}`);
                    }
                });

            } catch (error) {
                console.error(`Error: ${error}`);
                reject(error);
            }
        });
    }
}
