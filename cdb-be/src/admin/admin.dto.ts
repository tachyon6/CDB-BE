import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'express';


export class ContextDto {
    req: {
        user: {
            admin: string
        }
    };
    res: Response;
}

@ObjectType()
export class JwtToken {

    @Field(() => String)
    accessToken: string;

}