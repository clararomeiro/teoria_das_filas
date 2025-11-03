import { Module } from '@nestjs/common';
import { QueueingModule } from './queueing/queueing.module';

@Module({
  imports: [QueueingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
