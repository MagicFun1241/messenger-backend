import { userStub } from '../tests/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(userStub()),
  create: jest.fn().mockResolvedValue(userStub()),
  findByExternalId: jest.fn().mockResolvedValue(userStub()),
  findByExternalIdOrCreate: jest.fn().mockResolvedValue(userStub()),
  search: jest.fn().mockResolvedValue([userStub()]),
  delete: jest.fn().mockResolvedValue(() => Promise.resolve()),
});
