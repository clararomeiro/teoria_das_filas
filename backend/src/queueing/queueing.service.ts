import { Injectable } from '@nestjs/common';
import { CalculateQueueDto } from './dto/calculate-queue.dto';
import { QueueMetrics } from './interfaces/queue-metrics.interface';

const DISCIPLINA_OBSERVACAO =
  'Para modelos M/M/c e M/M/c/K, as métricas de média (L, Lq, W, Wq) são idênticas para as disciplinas FIFO, LIFO e SIRO (Ordem Aleatória), pois as probabilidades de estado estacionário não dependem da disciplina da fila.';

@Injectable()
export class QueueingService {
  calculateMetrics(dto: CalculateQueueDto): QueueMetrics {
    const {
      taxaDeChegada,
      taxaDeServico,
      numeroDeServidores,
      capacidadeMaximaSistema,
    } = dto;

    if (capacidadeMaximaSistema) {
      return this.calculateMMcK(
        taxaDeChegada,
        taxaDeServico,
        numeroDeServidores,
        capacidadeMaximaSistema,
        dto,
      );
    } else {
      return this.calculateMMc(
        taxaDeChegada,
        taxaDeServico,
        numeroDeServidores,
        dto,
      );
    }
  }

  private calculateMMc(
    lambda: number,
    mu: number,
    c: number,
    dto: CalculateQueueDto,
  ): QueueMetrics {
    const a = lambda / mu;
    const rho = a / c;

    if (rho >= 1) {
      return {
        modelo: 'M/M/c (Instável)',
        utilizacaoSistema: rho,
        numeroMedioClientesSistema: 'Infinito',
        numeroMedioClientesFila: 'Infinito',
        tempoMedioSistema: 'Infinito',
        tempoMedioFila: 'Infinito',
        taxaDeSaida: c * mu,
        probabilidadeSistemaVazio: 0,
        probabilidadeDeEspera: 1,
        capacidadeMaxima: 'Infinita',
        taxaDeBloqueio: 0,
        dadosDeEntrada: dto,
        observacao:
          'O sistema é instável ($\rho ge 1$). A fila crescerá indefinidamente.',
      };
    }

    let sumP0Term1 = 0;
    let term = 1;
    for (let n = 0; n < c; n++) {
      if (n > 0) {
        term = (term * a) / n;
      }
      sumP0Term1 += term;
    }
    const cTerm = (term * a) / c;
    const sumP0Term2 = cTerm / (1 - rho);
    const p0 = 1 / (sumP0Term1 + sumP0Term2);
    const pWaiting = sumP0Term2 * p0;
    const lq = pWaiting * (rho / (1 - rho));
    const lambdaEff = lambda;
    const wq = lq / lambdaEff;
    const w = wq + 1 / mu;
    const l = lambdaEff * w;

    return {
      modelo: 'M/M/c',
      utilizacaoSistema: rho,
      numeroMedioClientesSistema: l,
      numeroMedioClientesFila: lq,
      tempoMedioSistema: w,
      tempoMedioFila: wq,
      taxaDeSaida: lambdaEff,
      probabilidadeSistemaVazio: p0,
      probabilidadeDeEspera: pWaiting,
      capacidadeMaxima: 'Infinita',
      taxaDeBloqueio: 0,
      dadosDeEntrada: dto,
      observacao: DISCIPLINA_OBSERVACAO,
    };
  }

  private calculateMMcK(
    lambda: number,
    mu: number,
    c: number,
    K: number,
    dto: CalculateQueueDto,
  ): QueueMetrics {
    const a = lambda / mu;
    const rho = a / c;
    let sumP0Term1 = 0;
    let term = 1;
    for (let n = 0; n < c; n++) {
      if (n > 0) {
        term = (term * a) / n;
      }
      sumP0Term1 += term;
    }
    const cTerm = (term * a) / c;
    let sumP0Term2 = 0;
    if (rho === 1) {
      sumP0Term2 = cTerm * (K - c + 1);
    } else {
      sumP0Term2 = cTerm * ((1 - Math.pow(rho, K - c + 1)) / (1 - rho));
    }
    const p0 = 1 / (sumP0Term1 + sumP0Term2);
    const pk = p0 * cTerm * Math.pow(rho, K - c);
    const lambdaEff = lambda * (1 - pk);
    let lq = 0;
    const m = K - c;
    if (rho === 1) {
      lq = p0 * cTerm * ((m * (m + 1)) / 2);
    } else {
      const rho_m = Math.pow(rho, m);
      const sum_j_rho_j =
        (rho * (1 - (m + 1) * rho_m + m * Math.pow(rho, m + 1))) /
        Math.pow(1 - rho, 2);
      lq = p0 * cTerm * sum_j_rho_j;
    }
    const l = lq + lambdaEff / mu;
    const w = l / lambdaEff;
    const wq = lq / lambdaEff;
    const utilizacaoEfetiva = lambdaEff / (c * mu);
    let pWaiting = 0;
    let pn = p0 * cTerm;
    for (let n = c; n < K; n++) {
      if (n > c) {
        pn = pn * rho;
      }
      pWaiting += pn;
    }

    return {
      modelo: 'M/M/c/K',
      utilizacaoSistema: utilizacaoEfetiva,
      numeroMedioClientesSistema: l,
      numeroMedioClientesFila: lq,
      tempoMedioSistema: w,
      tempoMedioFila: wq,
      taxaDeSaida: lambdaEff,
      probabilidadeSistemaVazio: p0,
      probabilidadeDeEspera: pWaiting,
      capacidadeMaxima: K,
      taxaDeBloqueio: pk,
      dadosDeEntrada: dto,
      observacao: DISCIPLINA_OBSERVACAO,
    };
  }
}
