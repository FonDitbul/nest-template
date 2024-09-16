import { Module } from '@nestjs/common';
import { MailSendService } from './application/mail-send.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MailSendService],
  exports: [MailSendService],
})
export class MailModule {}
