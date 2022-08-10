import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import { TokenExternal, TokenExternalDocument } from './schemas/token-external.schema';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(TokenExternal.name) private TokenExternalModel: Model<TokenExternalDocument>,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  // findOneTokenExternal(tokenId: number): Promise<TokenExternal | undefined> {
  //   return new Promise((resolve) => {
  //     resolve(this.tokensExternal.find((token) => token.id === tokenId));
  //   });
  // }

  // TODO: 2 Secrets key in JwtModule, decode
  private createOrFindNewUserByToken(token: string) {
    const decodedToken = this.jwtService.decode(token) as CreateUserDto;
    const user = this.userService.findByExternalId(decodedToken.externalId);
    this.logger.log(user);
  }

  create(ip: string, createTokenExternalDto: CreateTokenExternalDto): Promise<TokenExternal> {
    const newTokenExternal = new this.TokenExternalModel({ token: createTokenExternalDto.token, ip });
    // newTokenExternal.user = mongoose.Types.ObjectId('1234');
    return newTokenExternal.save();
  }
}
