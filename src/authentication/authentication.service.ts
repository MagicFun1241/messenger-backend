import {
  HttpException, HttpStatus, Injectable, Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';

import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserDocument } from '@/users/schemas/user.schema';
import { WsService } from '@/ws/ws.service';
import { WebSocketEntity } from '@/ws/entities/ws.web-socket.entity';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';

import { TokenExternal, TokenExternalDocument } from './schemas/token-external.schema';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateTokenExternalDto } from './dto/create-token-external.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @InjectModel(TokenExternal.name) private readonly TokenExternalModel: Model<TokenExternalDocument>,
    @InjectModel(Session.name) private readonly SessionModel: Model<SessionDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly wsService: WsService,
  ) {}

  async findTokenExternalModelByPayload(tokenExternal: string, ip: string): Promise<TokenExternalDocument | null> {
    const tokenExternalModel = await this.TokenExternalModel.findOne({ token: tokenExternal, ip }).exec();
    return tokenExternalModel;
  }

  decodeJwt(token: string) {
    return this.jwtService.decode(token);
  }

  verifyJwt(token: string, secret: string) {
    return this.jwtService.verify(token, { secret });
  }

  private async createOrFindNewUserByToken(tokenExternal: string): Promise<UserDocument> {
    if (await this.jwtService.verifyAsync(
      tokenExternal,
      { secret: this.configService.get<string>('TOKEN_EXTERNAL_SECRET') },
    )) {
      const tokenExternalDecoded = (
        this.jwtService.decode(tokenExternal) as Record<string, unknown>
      ).data as CreateUserDto;

      const user = await this.userService.findByExternalIdOrCreate(tokenExternalDecoded);
      return user;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async createTokenExternal(createTokenExternalDto: CreateTokenExternalDto): Promise<string> {
    const user = await this.createOrFindNewUserByToken(createTokenExternalDto.token);

    const newTokenExternal = await this.TokenExternalModel.create({
      userId: user._id,
      token: createTokenExternalDto.token,
      service: createTokenExternalDto.service,
      ip: createTokenExternalDto.ip,
    });

    return newTokenExternal.token;
  }

  async createTokenExternalForTestAccount(requestIp: string): Promise<string> {
    const user = await this.userService.findByExternalIdOrCreate({
      firstName: 'Test',
      lastName: 'Test',
      middleName: 'Test',
      email: 'test@test.com',
      dateOfBirth: new Date(),
      externalAccounts: [{ service: 'volsu', id: '1' }],
    });

    const newTokenExternal = await this.TokenExternalModel.create({
      userId: user._id,
      token: await this.jwtService.signAsync({ userId: user._id }, {
        secret: this.configService.get<string>('TOKEN_EXTERNAL_SECRET'),
        expiresIn: '5m',
      }),
      service: 'volsu',
      ip: requestIp,
    });

    return newTokenExternal.token;
  }

  private async validatingTokenExternal(
    tokenExternal: string,
    ip: string,
    event: string,
  ): Promise<TokenExternalDocument> {
    if (await this.jwtService.verifyAsync(
      tokenExternal,
      { secret: this.configService.get<string>('TOKEN_EXTERNAL_SECRET') },
    )) {
      const externalTokenModel = await this.findTokenExternalModelByPayload(tokenExternal, ip);
      if (!externalTokenModel) {
        throw new WsFormatException({
          event,
          code: 3401,
          message: 'External token not found in database',
          isCloseWs: true,
        });
      }

      return externalTokenModel;
    }

    throw new WsFormatException({
      event,
      code: 3401,
      message: 'External verify failed',
      isCloseWs: true,
    });
  }

  async createSession(tokenExternal: string, ip: string, event: string): Promise<string> {
    const externalTokenModel = await this.validatingTokenExternal(tokenExternal, ip, event);

    const payload = { userId: externalTokenModel.userId };
    const tokenAccess = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('TOKEN_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('TOKEN_ACCESS_EXPIRATION'),
    });

    await this.SessionModel.create({
      userId: externalTokenModel.userId,
      token: tokenAccess,
      lastIp: ip,
      lastActivityDateTime: new Date(),
    });

    await externalTokenModel.delete();

    return tokenAccess;
  }

  public async setTokenAccessToConnection(client: WebSocketEntity, tokenAccess: string): Promise<boolean> {
    if (await this.jwtService.verifyAsync(
      tokenAccess,
      { secret: this.configService.get<string>('TOKEN_ACCESS_SECRET') },
    )) {
      const tokenAccessDecoded = this.jwtService.decode(tokenAccess) as { userId: string };
      const socketId = this.wsService.setConnectedWebSocketByUserId(tokenAccessDecoded.userId, client);
      client.tokenAccess = tokenAccess;
      client.userId = tokenAccessDecoded.userId;
      client.socketId = socketId;
      return true;
    }

    return false;
  }

  public deleteConnectionFromState(client: WebSocketEntity): boolean {
    if (client.socketId && client.tokenAccess) {
      return this.wsService.deleteConnectedWebSocketByUserIdAndClientId(client.userId, client.socketId);
    }

    return false;
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // private async removeExpiredTokensTask() {
  //   for (const name of this.extensionsService.list()) {
  //     const expiration = this.extensionsService.getTokenExpiration(name);
  //     if (expiration === 0) {
  //       continue;
  //     }
  //
  //     await this.TokenExternalModel.deleteMany({
  //       service: name,
  //       createdAt: { $lt: dayjs().subtract(expiration, 'seconds').toDate() },
  //     });
  //   }
  // }
}
