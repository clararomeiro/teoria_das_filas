import { Module } from '@nestjs/common';
import { QueueingController } from './queueing.controller';
import { QueueingService } from './queueing.service';

@Module({
  controllers: [QueueingController],
  providers: [QueueingService],
})
export class QueueingModule {}
