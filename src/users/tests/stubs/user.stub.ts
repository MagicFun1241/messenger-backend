import { User } from '../../schemas/user.schema';

export const userStub = (): User & { _id: string } => ({
  _id: '507f191e810c19729de860ea',
  firstName: 'Max',
  lastName: 'Mostovoy',
  photo: null,
  middleName: null,
  userName: 'int1m',
  email: 'mostovoy@volsu.ru',
  dateOfBirth: new Date(),
  externalAccounts: [{ service: 'volsu', id: '1' }],
});
