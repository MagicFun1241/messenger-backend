import { Model, Types } from 'mongoose';
import {
  HttpException, HttpStatus, Injectable, Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserDocument } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/users.service';
import { TokenExternal, TokenExternalDocument } from './schemas/token-external.schema';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(TokenExternal.name) private TokenExternalModel: Model<TokenExternalDocument>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  // findOneTokenExternal(tokenId: number): Promise<TokenExternal | undefined> {
  //   return new Promise((resolve) => {
  //     resolve(this.tokensExternal.find((token) => token.id === tokenId));
  //   });
  // }

  private async createOrFindNewUserByToken(token: string): Promise<UserDocument & { _id: Types.ObjectId }> {
    if (this.jwtService.verify(token, { secret: this.configService.get<string>('TOKEN_EXTERNAL_SECRET') })) {
      const decodedToken = this.jwtService.decode(token) as CreateUserDto;
      const user = await this.userService.findByExternalIdOrCreate(decodedToken);
      return user;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async create(ip: string, createTokenExternalDto: CreateTokenExternalDto): Promise<TokenExternal> {
    const user = await this.createOrFindNewUserByToken(createTokenExternalDto.token);
    const newTokenExternal = new this.TokenExternalModel({ token: createTokenExternalDto.token, ip });
    newTokenExternal.user = user._id;
    await newTokenExternal.save();
    return newTokenExternal;
  }
}
