import { Model, Types } from 'mongoose';
import {
  HttpException, HttpStatus, Injectable, Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WebSocket } from 'ws';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserDocument } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/users.service';
import { TokenExternal, TokenExternalDocument } from './schemas/token-external.schema';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';
import { WebSocketAuthEntity } from './entities/web-socket-auth.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(TokenExternal.name) private TokenExternalModel: Model<TokenExternalDocument>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  private async createOrFindNewUserByToken(token: string): Promise<UserDocument & { _id: Types.ObjectId }> {
    if (this.jwtService.verify(token, { secret: this.configService.get<string>('TOKEN_EXTERNAL_SECRET') })) {
      const decodedToken = this.jwtService.decode(token) as CreateUserDto;
      const user = await this.userService.findByExternalIdOrCreate(decodedToken);
      return user;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async create(createTokenExternalDto: CreateTokenExternalDto): Promise<TokenExternal> {
    const user = await this.createOrFindNewUserByToken(createTokenExternalDto.token);
    const newTokenExternal = new this.TokenExternalModel(
      { token: createTokenExternalDto.token, ip: createTokenExternalDto.ip },
    );
    newTokenExternal.user = user._id;
    await newTokenExternal.save();
    return newTokenExternal;
  }

  static setAuthTokenToConnection(client: WebSocketAuthEntity, jwtToken: string) {
    client.auth = jwtToken;
  }
}
