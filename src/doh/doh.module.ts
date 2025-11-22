import { Module } from '@nestjs/common';
import { DohController } from './doh.controller';
import { DohService } from './doh.service';

@Module({
    controllers: [DohController],
    providers: [DohService],
})
export class DohModule { }
