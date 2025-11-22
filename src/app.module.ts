import { Module } from '@nestjs/common';
import { DohModule } from './doh/doh.module';

@Module({
    imports: [DohModule],
})
export class AppModule { }
