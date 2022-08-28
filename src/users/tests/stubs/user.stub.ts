import { User } from '../../schemas/user.schema';

export const userStub = (): User & { _id: string } => ({
  _id: '507f191e810c19729de860ea',
  firstName: 'Николай',
  lastName: 'Федотов',
  middleName: undefined,
  userName: 'nphedotov',
  email: 'mail@example.com',
  type: 'userTypeRegular',
  photos: undefined,
  isVerified: false,
  wasOnline: new Date(),
  tags: [],
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
