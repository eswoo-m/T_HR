import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BaseException } from '../exceptions/base.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 1. 기본 에러 코드 설정
    let errorCode = 'COMMON_ERROR';

    // 2. 에러 객체에서 정보 추출 (타입 안전성 확보)
    if (exception instanceof BaseException) {
      // 우리가 만든 BaseException인 경우 안전하게 접근 가능
      errorCode = exception.errorCode;
    } else {
      // NestJS 기본 예외나 다른 예외인 경우
      const res = exception.getResponse();

      // 'res'가 객체이고 그 안에 'errorCode' 속성이 있는지 체크 (타입 가드)
      if (typeof res === 'object' && res !== null && 'errorCode' in res) {
        errorCode = (res as { errorCode: string }).errorCode;
      }
    }

    // 3. 최종 응답 구조 생성
    const errorResponse = {
      success: false,
      statusCode: status,
      errorCode: errorCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
