import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';

/**
 * ResponseFilter catches all uncaught exceptions thrown within controllers and
 * services and converts them into the common response format used by the
 * competition API.  Success responses should already be wrapped by the
 * controller itself.  Errors produce a 200 HTTP status code with
 * STATUS_CD beginning with 'E'.
 */
@Catch()
export class ResponseFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Default values for unknown errors
    let statusCode = 'E5000';
    let message = 'SERVER ERROR';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      statusCode = `E${status}`;
      const msg = exception.message;
      message = typeof msg === 'string' ? msg : 'ERROR';
    } else if (exception instanceof Error) {
      // Custom service errors may just be simple Error objects
      message = exception.message || message;
      // Provide a generic error code when not thrown by HttpException
      statusCode = 'E4000';
    }

    response.status(200).json({
      STATUS_CD: statusCode,
      STATUS_MSG: message,
      RESULT: null,
    });
  }
}