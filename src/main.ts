import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseFilter } from './common/filters/response.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Prefix all routes with /api to mirror competition server
  app.setGlobalPrefix('api');
  // Serve static files from the uploads folder.  The prefix here must match the path
  // returned to clients (e.g. /uploads/filename.jpg).
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  // Apply a global exception filter to wrap all error responses into the
  // standard competition format.
  app.useGlobalFilters(new ResponseFilter());
  await app.listen(3000);
}

bootstrap();