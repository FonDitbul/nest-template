import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserLoginByEmailPasswordReqDto, UserSignUpReqDto } from '../api/user.req.dto';
import { PasswordBcryptEncrypt } from '../../auth/infrastructure/password.bcrypt.encrypt';
import { ILoginTokenValidator } from '../../auth/interface/login.token.validator';
import { UserEntity } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ILoginUserInfo } from '../../auth/interface/login.user';

@Injectable()
export class UserService {
  constructor(
    private passwordEncrypt: PasswordBcryptEncrypt,
    @Inject('ILoginTokenValidator')
    private loginTokenValidator: ILoginTokenValidator,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async isExistEmail(email: string) {
    const dupEmailUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    return !!dupEmailUser;
  }

  @Transactional()
  async signUp(signUpDto: UserSignUpReqDto) {
    // 1. 이미 동일한 이메일을 사용한 유저가 존재하는지 validation
    const dupEmail = await this.userRepository.count({
      where: {
        email: signUpDto.email,
      },
    });

    // 1.1 동일한 이메일 유저 계정이 존재할 경우 error
    if (dupEmail) {
      throw new BadRequestException('duplicate user email');
    }

    // 2. password encrypt (암호화)
    const passwordEncrypt = await this.passwordEncrypt.encrypt(signUpDto.password);

    // 3. 유저 계정 생성
    await this.userRepository.insert({
      email: signUpDto.email,
      password: passwordEncrypt,
      name: signUpDto.name,
    });
    return;
  }

  async loginByEmailPassword(loginDto: UserLoginByEmailPasswordReqDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }
    if (!user.password || user.provider) {
      throw new BadRequestException('USER_DOES_NOT_SIGN_UP_EMAIL');
    }
    const isPasswordMatch = await this.passwordEncrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('USER_DO_NOT_MATCH_PASSWORD');
    }

    const loginUserInfo: ILoginUserInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return { ...this.loginTokenValidator.issuance(loginUserInfo), name: user.name };
  }

  async getAccessByRefresh(token: string) {
    const userDecode = this.loginTokenValidator.validateByToken(token);

    const user = await this.userRepository.findOne({
      where: { id: userDecode.id },
    });

    if (!user) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }

    const loginToken = this.loginTokenValidator.issuance(userDecode);

    return {
      accessToken: loginToken.accessToken,
    };
  }

  async getLoginTokenByRefresh(token: string) {
    const userDecode = this.loginTokenValidator.validateByToken(token);

    const user = await this.userRepository.findOne({
      where: { id: userDecode.id },
    });

    if (!user) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }

    return this.loginTokenValidator.issuance(userDecode);
  }

  async delete(user: ILoginUserInfo) {
    const oneUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });

    if (!oneUser) {
      throw new BadRequestException('USER_DOES_NOT_EXIST');
    }

    await this.userRepository.delete(user.id);
  }
}
