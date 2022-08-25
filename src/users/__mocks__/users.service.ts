import { externalUsersStub, userStub } from '../tests/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  findById: jest.fn().mockResolvedValue(userStub()),
  create: jest.fn().mockResolvedValue(userStub()),
  findByExternalId: jest.fn().mockResolvedValue(userStub()),
  findByExternalIdOrCreate: jest.fn().mockResolvedValue(userStub()),
  search: jest.fn().mockResolvedValue([userStub()]),
  searchByExternalService: jest.fn().mockResolvedValue(externalUsersStub()),
  delete: jest.fn().mockResolvedValue(() => Promise.resolve()),
});
