import { UserEntity } from '../src/entity/user.entity';

export const UserEntityTest = (): UserEntity => {
  return {
    id: 1,
    provider: null,
    email: '',
    password: null,
    name: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
};
