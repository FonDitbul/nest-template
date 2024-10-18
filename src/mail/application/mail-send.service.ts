import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { createTransport, Transporter } from 'nodemailer';
import { IMailSendOption } from '../interface/mail.send.option';

@Injectable()
export class MailSendService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: +this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_AUTH_ID'),
        pass: this.configService.get('MAIL_AUTH_PASSWORD'),
      },
    });
  }

  async sendMail(mailOption: IMailSendOption) {
    const { to, from, subject, html, cc, bcc } = mailOption;
    try {
      await this.transporter.sendMail({
        from,
        to, //string or Array
        subject,
        html,
        cc,
        bcc,

        // html: "<html><p>hi hello it's me</p></html>",
        /*
        from: ex1@kigo.com // 발신자
        to:   ex2@kigo.com // 수신자
        html: htmlData, //내용이 html이라면 text 대신 사용
        text: text, // text 만 사용할시
        cc: [ex1@kigo.com, ex2@kigo.com] //참조
        bcc: [ex1@kigo.com, ex2@kigo.com] //숨은 참조
        */
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
