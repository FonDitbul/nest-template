import { Module } from '@nestjs/common';
import { PasswordBcryptEncrypt } from './infrastructure/password.bcrypt.encrypt';
import { LoginTokenValidatorJsonwebtoken } from './infrastructure/login.token.validator.jsonwebtoken';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PasswordBcryptEncrypt,
    {
      provide: 'ILoginTokenValidator',
      useClass: LoginTokenValidatorJsonwebtoken,
    },
  ],
  exports: [
    PasswordBcryptEncrypt,
    {
      provide: 'ILoginTokenValidator',
      useClass: LoginTokenValidatorJsonwebtoken,
    },
  ],
})
export class AuthModule {}
