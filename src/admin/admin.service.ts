import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContextDto, JwtToken } from './admin.dto';

@Injectable()
export class AdminService {
    constructor(
        private jwtService: JwtService
    ) { }

    async hello(): Promise<string> {
        return 'Hello World!';
    }

    async adminCodeToJwt(code: String): Promise<JwtToken> {
        if(code !== process.env.ADMIN_CODE)
            throw new NotFoundException('not correct code');

            return {
                accessToken: this.jwtService.sign({
                    admin: process.env.ADMIN_PAYLOAD
                }, {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '1d'
                })
            }
    }

    async adminCheck(context: ContextDto): Promise<boolean> {
        if(context.req.user.admin === process.env.ADMIN_PAYLOAD)
            return true;
        else
            return false;
    }
}
