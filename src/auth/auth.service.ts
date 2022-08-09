import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

export type TokenExternal = {
  id: number,
  userId: number,
  token: string,
  ip: string,
  createAt: Date,
};

@Injectable()
export class AuthService {
  private tokensExternal: TokenExternal[] = [
    {
      id: 1,
      userId: 1,
      token: 'fDFSF9SF9SFMKbvbvdf242gxvvhhgfd',
      ip: '160.60.150.155',
      createAt: new Date(),
    },
    {
      id: 2,
      userId: 2,
      token: 'gfgfh9DMkkfkdf09dfdlo20ifg',
      ip: '124.210.44.150',
      createAt: new Date(),
    },
  ];

  findOneTokenExternal(tokenId: number): Promise<TokenExternal | undefined> {
    return new Promise((resolve) => {
      resolve(this.tokensExternal.find((token) => token.id === tokenId));
    });
  }
}
