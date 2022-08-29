import { User } from '../../schemas/user.schema';

export const userStub = (): User & { _id: string } => ({
  _id: '507f191e810c19729de860ea',
  firstName: 'Николай',
  lastName: 'Федотов',
  userName: 'nphedotov',
  // shortName: {
  //   value: 'nphedotov',
  //   user: { _id: '507f191e810c19729de860ea' },
  // } as any,
  email: 'mail@example.com',
  type: 'userTypeRegular',
  photos: undefined,
  isVerified: false,
  lastActivity: new Date(),
  tags: [],
  dateOfBirth: new Date(),
  externalAccounts: [{ service: 'volsu', id: '000131678' }],
});

export const externalUsersStub = (): any => ({
  volsu: [
    {
      id: '000131678',
      firstName: 'Николай Федотов',
    },
  ],
});
