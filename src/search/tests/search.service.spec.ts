import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { SearchService } from '../search.service';

import { ExternalSearchItem } from '../@types/search.types';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/configs/.env.development`,
          isGlobal: true,
        }),
      ],
      providers: [
        SearchService,
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchByExternalService', () => {
    describe('When searchByExternalService is called', () => {
      let searchedUsers: Array<ExternalSearchItem>;
      const searchFullName = 'Мостовой Максим Сергеевич';

      beforeEach(async () => {
        searchedUsers = await service.searchByExternalService(searchFullName);
      });

      test('external search result should contain search request', () => {
        expect(searchedUsers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ title: searchFullName }),
          ]),
        );
      });
    });
  });
});
