import { User } from '../../schemas/user.schema';

export const userStub = (): User & { _id: string } => ({
  _id: '507f191e810c19729de860ea',
  firstName: 'Николай',
  lastName: 'Федотов',
  middleName: null,
  userName: 'nphedotov',

  photo: null,
  tags: [],

  email: 'mail@example.com',
  dateOfBirth: new Date(),
  externalAccounts: [{ service: 'volsu', id: '000131678' }],
});

export const externalUsersStub = (): any => ({
  volsu: [
    {
      id: '000131678',
      firstName: 'Николай',
      lastName: 'Федотов',
      middleName: null,
      linked: true,
    },
  ],
});
