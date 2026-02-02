import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter'; // 경로 확인 필요

async function bootstrap() {
  const logDir = 'logs';

  // 1. 로그 포맷 설정
  const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }: any) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  );

  const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }: any) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  );

  // 2. Nest 애플리케이션 생성
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.DailyRotateFile({
          level: 'info',
          dirname: logDir,
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: fileFormat,
        }),
        new winston.transports.DailyRotateFile({
          level: 'error',
          dirname: logDir,
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          format: fileFormat,
        }),
      ],
    }),
  });

  // 3. 전역 설정 (CORS, Pipe, Filter)
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      disableErrorMessages: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        console.log('Validation Errors:', JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // 4. Swagger 설정
  const config = new DocumentBuilder().setTitle('T_HR').setDescription('The T_HR API description').setVersion('1.0').addBearerAuth({ type: 'http', scheme: 'bearer', name: 'JWT', in: 'header' }, 'access-token').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 5. 포트 설정 및 실행
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;

  await app.listen(port);
  console.log(`🚀 서버가 ${port}번 포트에서 실행 중입니다. (환경: ${process.env.NODE_ENV || 'local'})`);
}

bootstrap();
