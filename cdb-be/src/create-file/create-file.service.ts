import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { CreateFileInput } from './dto/create-file.dto';



@Injectable()
export class CreateFileService {

    async hello(): Promise<string> {
        return 'Hello World!';
    }

    async createFile(createFileInput: CreateFileInput): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const inputArgs = createFileInput.numberInput.map(String);
            const python = spawn('python', ['./python/combinator.py', ...inputArgs]);
            let dataToSend = '';

            python.stdout.on('data', (data) => {
                dataToSend += data.toString();
            });

            python.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            python.on('close', (code) => {
                if (code === 0) {
                    console.log(`File Created Complete ${code}`);
                    resolve(dataToSend);
                } else {
                    console.error(`Error: Python script exited with code ${code}`);
                    reject(`Python script exited with code ${code}`);
                }
            });
        });
    }
}
