import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'], // Minimal logging for performance
    });

    // Enable CORS for browser DoH clients
    app.enableCors({
        origin: '*',
        methods: 'GET,POST',
        allowedHeaders: 'Content-Type,Accept',
    });

    // Enable compression for responses
    app.use(compression());

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`DoH Proxy server running on port ${port}`);
    console.log(`Process ID: ${process.pid}`);
}

bootstrap();
