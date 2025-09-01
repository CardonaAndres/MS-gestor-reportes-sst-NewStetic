import morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function main() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
   .setTitle('MS Reports Manager | New Stetic SST')
   .setDescription('El MS-Reports-Manager-SST es el núcleo de gestión y generación de reportes del ecosistema SST de New Stetic, desarrollado con NestJS y alineado a las buenas prácticas del proyecto. Centraliza la información, facilita el análisis histórico y en tiempo real, y garantiza la integridad de los datos. Soporta reportes de inspecciones, accidentalidad, vigilancia epidemiológica, EPP, higiene ocupacional y otros definidos por SST, con funciones de filtrado, exportación, categorización, consolidación histórica, integración con otros microservicios y notificaciones automáticas, además de contar con documentación interactiva mediante Swagger.')
   .setVersion('1.0.0')
   .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin : [process.env.SST_CLIENT],
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(morgan('dev'));

  app.setGlobalPrefix('API-SST/v1/reports');  

  app.useGlobalPipes(new ValidationPipe({
    whitelist : true,
    forbidNonWhitelisted: true, 
    transform: true             
  }));

  await app.listen(process.env.PORT || 3003, () => {
    console.log(`Server running on port ${process.env.PORT || 3003}`);
  });
}

main();