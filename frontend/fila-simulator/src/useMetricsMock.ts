import { useMutation } from "@tanstack/react-query";

export interface QueueParameters {
  arrivalRate: number;
  serviceRate: number;
  servers: number;
  capacity?: number;
  initialCustomers?: number;
  discipline: string;
}

export interface QueueMetric {
  metric: string;
  value: number;
  info?: string;
}

const calculateMetricsMock = async (
  parameters: QueueParameters
): Promise<QueueMetric[]> => {
  // Simular delay da API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simular algumas validações que podem gerar erro
  if (parameters.arrivalRate >= parameters.serviceRate * parameters.servers) {
    throw new Error(
      "Sistema instável: Taxa de chegada deve ser menor que taxa de serviço × número de servidores"
    );
  }

  // Gerar métricas mock baseadas nos parâmetros
  const utilization =
    parameters.arrivalRate / (parameters.serviceRate * parameters.servers);
  const rho = parameters.arrivalRate / parameters.serviceRate;

  const mockMetrics: QueueMetric[] = [
    {
      metric: "Utilização do Sistema (ρ)",
      value: utilization,
      info: "A utilização do sistema representa a fração do tempo que os servidores estão ocupados.",
    },
    {
      metric: "Número Médio de Clientes no Sistema (L)",
      value: rho / (1 - utilization),
      info: "O número médio de clientes no sistema inclui aqueles na fila e sendo atendidos.",
    },
    {
      metric: "Número Médio de Clientes na Fila (Lq)",
      value: (rho * rho) / (1 - utilization),
    },
    {
      metric: "Tempo Médio no Sistema (W)",
      value: 1 / (parameters.serviceRate - parameters.arrivalRate),
    },
    {
      metric: "Tempo Médio na Fila (Wq)",
      value:
        parameters.arrivalRate /
        (parameters.serviceRate *
          (parameters.serviceRate - parameters.arrivalRate)),
    },
    {
      metric: "Taxa de Saída (Throughput)",
      value: parameters.arrivalRate,
    },
    {
      metric: "Probabilidade do Sistema Vazio (P0)",
      value: 1 - utilization,
    },
    {
      metric: "Probabilidade de Espera",
      value: utilization,
    },
  ];

  // Se tiver capacidade limitada, adicionar métricas específicas
  if (parameters.capacity) {
    mockMetrics.push({
      metric: "Capacidade Máxima",
      value: parameters.capacity,
    });

    mockMetrics.push({
      metric: "Taxa de Bloqueio (%)",
      value: Math.random() * 10, // Valor aleatório para demonstração
    });
  }

  // Se tiver clientes iniciais, mostrar
  if (parameters.initialCustomers) {
    mockMetrics.push({
      metric: "Clientes Iniciais",
      value: parameters.initialCustomers,
    });
  }

  return mockMetrics;
};

export const useMetricsMock = () => {
  return useMutation({
    mutationFn: calculateMetricsMock,
    onError: (error) => {
      console.error("Erro ao calcular métricas (mock):", error);
    },
  });
};
