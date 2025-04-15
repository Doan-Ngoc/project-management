import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './services/mail.service';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          // configService.get('MAIL_HOST')
          //configService.get('MAIL_SECURE') === 'true'
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'minhngocdoan3112@gmail.com',
            pass: 'REDACTED',
          },
        },
        defaults: {
          from: `"Project Management System" <${configService.get('MAIL_FROM')}>`,
        },
        template: {
          // dir: __dirname + '/templates',
          dir: path.join(process.cwd(), 'src/modules/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
