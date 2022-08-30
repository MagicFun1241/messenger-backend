import {
  Body, Controller, HttpException, HttpStatus, Post,
} from '@nestjs/common';
import { PrivateCreateUser } from '@/users/dto/privateCreateUser';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  // Приватный метод, аналогичный методу на сокет-сервере
  @Post('/')
  async createUser(@Body() body: PrivateCreateUser) {
    if (
      this.configService.get('PRIVATE_ROUTES_ENABLED') !== 'true'
      || body.secret !== this.configService.get('PRIVATE_ROUTES_SECRET')
    ) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    const item = await this.usersService.create(body);
    return { id: item._id.toString() };
  }
}
