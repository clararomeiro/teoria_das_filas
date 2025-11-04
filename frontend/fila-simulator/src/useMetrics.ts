import { useMutation } from '@tanstack/react-query';
import { api } from './api';

export interface QueueParameters {
  arrivalRate: number;
  serviceRate: number;
  servers: number;
  capacity?: number;
  initialCustomers?: number;
  discipline: 'FIFO' | 'LIFO';
}

interface QueueParametersAPI {
  taxaDeChegada: number;
  taxaDeServico: number;
  numeroDeServidores: number;
  capacidadeMaximaSistema?: number;
  numeroInicialDeClientes?: number;
  disciplinaDeAtendimento: 'FIFO' | 'LIFO';
}

export interface QueueInputData {
  taxaDeChegada: number;
  taxaDeServico: number;
  numeroDeServidores: number;
  disciplinaDeAtendimento: 'FIFO' | 'LIFO';
  capacidadeMaximaSistema?: number;
  numeroInicialDeClientes?: number;
}

export interface QueueMetricsResponse {
  modelo: string;
  utilizacaoSistema: number;
  numeroMedioClientesSistema: number;
  numeroMedioClientesFila: number;
  tempoMedioSistema: number;
  tempoMedioFila: number;
  taxaDeSaida: number;
  probabilidadeSistemaVazio: number;
  probabilidadeDeEspera: number;
  capacidadeMaxima?: number;
  taxaDeBloqueio?: number;
  dadosDeEntrada: QueueInputData;
  observacao?: string;
}

const calculateMetrics = async (parameters: QueueParameters): Promise<QueueMetricsResponse> => {
  // Converter para os nomes esperados pelo DTO do backend
  const apiParameters: QueueParametersAPI = {
    taxaDeChegada: parameters.arrivalRate,
    taxaDeServico: parameters.serviceRate,
    numeroDeServidores: parameters.servers,
    disciplinaDeAtendimento: parameters.discipline,
  };

  // Adicionar parâmetros opcionais apenas se fornecidos
  if (parameters.capacity !== undefined) {
    apiParameters.capacidadeMaximaSistema = parameters.capacity;
  }
  
  if (parameters.initialCustomers !== undefined) {
    apiParameters.numeroInicialDeClientes = parameters.initialCustomers;
  }

  const response = await api.post('/queue/calculate', apiParameters);
  return response.data;
};

export const useMetrics = () => {
  return useMutation({
    mutationFn: calculateMetrics,
    onError: (error) => {
      console.error('Erro ao calcular métricas:', error);
    },
  });
};
