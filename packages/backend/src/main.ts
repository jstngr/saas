import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureSession } from './modules/auth/session.config';
import * as passport from 'passport';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ErrorInterceptor(),
    new LoggingInterceptor(),
  );

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that don't have decorators
      transform: true, // transform payloads to DTO instances
      forbidNonWhitelisted: true, // throw errors if non-whitelisted values are provided
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Saas API')
    .setDescription('The Saas API documentation')
    .setVersion('1.0')
    .addTag('Authentication')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configure CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  // Configure Sessions
  const sessionMiddleware = await configureSession(configService);
  app.use(sessionMiddleware);

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
