import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WsAdapter } from 'nestjs-ws-binary-adapter';
import * as fs from 'fs';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const httpsOptions = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined ? {
    key: fs.readFileSync(`${process.cwd()}/tools/mkcert/key.pem`),
    cert: fs.readFileSync(`${process.cwd()}/tools/mkcert/cert.pem`),
  } : undefined;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      https: httpsOptions,
    }),
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(3000);
}

// eslint-disable-next-line no-void
void bootstrap();
