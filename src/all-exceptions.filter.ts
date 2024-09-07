import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Check for specific types of exceptions
    if (exception instanceof HttpException) {
      // Handle NestJS built-in HTTP exceptions
      status = exception.getStatus();
      const responseMessage = exception.getResponse();

      if (typeof responseMessage === 'string') {
        message = responseMessage;
      } else if (
        typeof responseMessage === 'object' &&
        responseMessage.hasOwnProperty('message')
      ) {
        message = (responseMessage as any).message;
      } else {
        message = JSON.stringify(responseMessage);
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle TypeORM QueryFailedError
      status = HttpStatus.BAD_REQUEST;
      message = 'Database error occurred.';

      if ((exception as any).code === '23505') {
        // PostgreSQL unique violation code
        message = 'Duplicate entry. This resource already exists.';

        // Extract and append constraint details if available
        const detail = (exception as any).detail;
        if (detail) {
          const regex = /\(([^)]+)\)=\(([^)]+)\)/;
          const match = detail.match(regex);
          if (match) {
            const column = match[1];
            message += ` Column: ${column}`;
          }
        }
      }
    } else if (exception instanceof Error) {
      // Handle other generic errors
      message = exception.message || message;
      status = HttpStatus.BAD_REQUEST; // Default to bad request for non-HTTP errors
    } else {
      // Handle unknown error types
      message = 'An unknown error occurred.';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
