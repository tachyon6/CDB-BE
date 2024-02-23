import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { Codes, CompleteFileInput, DownloadLogDto } from './dto/create-file.dto';
import { Between, DataSource, In, Repository } from 'typeorm';
import { QuestionMath } from 'src/entities/question-math.entity';
import { createHash } from 'crypto';
import { CompleteMath } from 'src/entities/complete-math.entity';
import { DownloadLog } from 'src/entities/download-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-timezone';


@Injectable()
export class CombinatorService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(DownloadLog)
        private downloadLogRepository: Repository<DownloadLog>,
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

    async createDownloadLog(title: string, input: string): Promise<string> {
        const newDownloadLog = this.dataSource.getRepository(DownloadLog).create({
            title,
            input,
        });

        await this.dataSource.getRepository(DownloadLog).save(newDownloadLog);
        return 'Success';
    }

    async getDownloadLogByDay(date: string): Promise<DownloadLogDto[]> {
        //date 형식: 'YYYYMMDD'
        const year = parseInt(date.substring(0, 4), 10);
        const month = parseInt(date.substring(4, 6), 10) - 1; // JS에서 월은 0부터 시작합니다.
        const day = parseInt(date.substring(6, 8), 10);

        // 시작 날짜와 종료 날짜 생성
        const startDate = new Date(year, month, day);
        const endDate = new Date(year, month, day + 1);


        const logs = await this.downloadLogRepository.find({
            where: {
                created_at: Between(startDate, endDate),
            },
        });

        return logs.map(log => ({
            id: log.id,
            title: log.title,
            input: log.input,
            created_at: moment(log.created_at).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
        }));

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
                        resolve(fileName);
                    } else {
                        console.error(`Error: Python script exited with code ${code}`);
                        reject(`Python script exited with code ${code}`);
                    }
                });

            } catch (error) {
                console.error(`Error: ${error}`);
                reject(error);
            }
        });
    }

    async pythonTest(completeFileInput: CompleteFileInput): Promise<string> {
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
                    return reject(`문항번호 ${notExistCodes.join(', ') + '가 존재하지 않는 문항 번호입니다.'}`);
                }

                const python = spawn('python', ['./python/test.py', fileName, title, ...inputArgs]);
                let dataToSend = '';

                python.stdout.on('data', (data) => {
                    const output = data.toString().trim();
                    if (output.startsWith('Done')) {
                        dataToSend = output.replace('Done', '').trim();
                    }
                });

                python.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });

                python.on('close', async (code) => {
                    if (code === 0) {
                        console.log(`File Created Complete ${code}`);

                        // const existingMath = await this.dataSource.getRepository(CompleteMath).findOne({ where: { code: fileName } });

                        // if (existingMath) {
                        //     resolve(fileName);
                        // } else {
                        //     const completeMath = this.dataSource.getRepository(CompleteMath).create({
                        //         code: fileName,
                        //         download_url: `https://cdb-math.s3.ap-northeast-2.amazonaws.com/uploads/results/${fileName}.pdf`
                        //     });
                        //     await this.dataSource.getRepository(CompleteMath).save(completeMath);
                        //     resolve(fileName);
                        // }
                        resolve(fileName);
                    } else {
                        console.error(`Error: Python script exited with code ${code}`);
                        reject(`Python script exited with code ${code}`);
                    }
                });
            } catch (error) {
                console.error(`Error: ${error}`);
                reject(error);
            }
        });
    }
}
