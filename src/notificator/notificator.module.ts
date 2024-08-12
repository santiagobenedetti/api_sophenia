import { Module } from '@nestjs/common';
import { NotificatorService } from './notificator.service';

@Module({
  providers: [NotificatorService],
})
export class NotificatorModule {}
