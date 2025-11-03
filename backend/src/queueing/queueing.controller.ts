import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { QueueingService } from './queueing.service';
import { CalculateQueueDto } from './dto/calculate-queue.dto';
import * as queueMetricsInterface from './interfaces/queue-metrics.interface';

@Controller('queue')
export class QueueingController {
  constructor(private readonly queueingService: QueueingService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  calculateMetrics(
    @Body() dto: CalculateQueueDto,
  ): queueMetricsInterface.QueueMetrics {
    if (
      dto.capacidadeMaximaSistema &&
      dto.capacidadeMaximaSistema < dto.numeroDeServidores
    ) {
      throw new BadRequestException(
        'A capacidade máxima ($K$) não pode ser menor que o número de servidores ($c$).',
      );
    }

    return this.queueingService.calculateMetrics(dto);
  }
}
