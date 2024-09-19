import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const setupSwagger = (
  app: INestApplication,
  appName: string,
  swaggerCustomOptions?: SwaggerCustomOptions,
) => {
  const config = new DocumentBuilder()
    .setTitle(`${appName} example`)
    .setDescription(`The ${appName} API description`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('docs', app, document, {
    swaggerUiEnabled: false,
    customSiteTitle: `Diplomski ${appName} Docs`,
    jsonDocumentUrl: 'docs/json',
    yamlDocumentUrl: 'docs/yaml',
    ...swaggerCustomOptions,
  });
};
