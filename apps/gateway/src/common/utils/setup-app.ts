import { GrpcExceptionFilter } from '../filters/grpc-exception.filter';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export default function setupApp(app: INestApplication): void {
  app.enableCors();

  app.useGlobalFilters(new GrpcExceptionFilter(), new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
}
