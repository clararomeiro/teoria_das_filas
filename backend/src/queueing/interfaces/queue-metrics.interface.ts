import { CalculateQueueDto } from '../dto/calculate-queue.dto';

export interface QueueMetrics {
  modelo: string;
  utilizacaoSistema: number | string;
  numeroMedioClientesSistema: number | string;
  numeroMedioClientesFila: number | string;
  tempoMedioSistema: number | string;
  tempoMedioFila: number | string;
  taxaDeSaida: number;
  probabilidadeSistemaVazio: number;
  probabilidadeDeEspera: number;
  capacidadeMaxima: number | string;
  taxaDeBloqueio: number;
  dadosDeEntrada: CalculateQueueDto;
  observacao?: string;
}
