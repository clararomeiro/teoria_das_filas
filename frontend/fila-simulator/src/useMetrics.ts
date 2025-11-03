import { useMutation } from '@tanstack/react-query';
import { api } from './api';

export interface QueueParameters {
  arrivalRate: number;
  serviceRate: number;
  servers: number;
  capacity?: number;
  initialCustomers?: number;
  discipline: string;
}

interface QueueParametersAPI {
  arrival_rate: number;
  service_rate: number;
  servers: number;
  capacity?: number;
  initial_customers?: number;
  discipline: string;
}

export interface QueueMetric {
  metric: string;
  value: number;
  info?: string;
}

const calculateMetrics = async (parameters: QueueParameters): Promise<QueueMetric[]> => {
  // Converter para snake_case para a API
  const apiParameters: QueueParametersAPI = {
    arrival_rate: parameters.arrivalRate,
    service_rate: parameters.serviceRate,
    servers: parameters.servers,
    capacity: parameters.capacity,
    initial_customers: parameters.initialCustomers,
    discipline: parameters.discipline,
  };

  const response = await api.post('/calculate-metrics', apiParameters);
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
