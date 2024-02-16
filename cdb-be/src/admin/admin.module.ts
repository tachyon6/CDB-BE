import { Module } from '@nestjs/common';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';

@Module({
  imports: [
    JwtModule.register({}),
  ],
  providers: [AdminResolver, AdminService, JwtAccessStrategy],
})
export class AdminModule {}
