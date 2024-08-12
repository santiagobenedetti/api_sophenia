import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { NotificatorService } from 'src/notificator/notificator.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, NotificatorService],
  exports: [AuthService],
})
export class AuthModule {}
