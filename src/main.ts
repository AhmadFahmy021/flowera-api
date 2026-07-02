import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app =
  await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  
  app.useStaticAssets(
  join(
    process.cwd(),
    'src',
    'uploads',
  ),
  {
    prefix: '/uploads/',
  },
);
  app.use(cookieParser())
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://flowera.my.id'
    ],
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
 