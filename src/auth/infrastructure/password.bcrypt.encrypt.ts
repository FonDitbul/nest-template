import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordBcryptEncrypt {
  async encrypt(rawPassword: string): Promise<string> {
    const salt = await PasswordBcryptEncrypt.generateSalt();
    return await bcrypt.hash(rawPassword, salt);
  }

  async compare(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }

  private static async generateSalt(): Promise<string> {
    const saltRound = 10;
    return await bcrypt.genSalt(saltRound);
  }
}
