import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'social 로그인 방식 ex) GOOGLE, APPLE',
  })
  provider: string | null;

  @Column({ unique: true, length: 100, comment: '이메일' })
  email: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 500,
    comment: '비밀번호 소셜일시 null',
  })
  password: string | null;

  @Column({ length: 100, comment: '유저 이름' })
  name: string;
}
