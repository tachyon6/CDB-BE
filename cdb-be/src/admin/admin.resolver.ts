import { Resolver, Query, Context, Args } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gaurd/gql-auth.gaurd';
import { ContextDto, JwtToken } from './admin.dto';
import { access } from 'fs';

@Resolver()
export class AdminResolver {
    constructor(
        private readonly adminService: AdminService,
    ) { }

    @Query(() => JwtToken)
    async adminCodeToJwt(
        @Args('code') code: String): Promise<JwtToken> {
        return this.adminService.adminCodeToJwt(code);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => Boolean)
    async adminCheck(@Context() context: ContextDto): Promise<boolean> {
        return await this.adminService.adminCheck(context);
    }
}
