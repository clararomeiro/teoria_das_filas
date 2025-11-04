import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import { type QueueMetricsResponse } from "./useMetrics";
import { InfoOutlined } from "@mui/icons-material";

interface MetricsDialogProps {
  open: boolean;
  onClose: () => void;
  metrics: QueueMetricsResponse | null;
}

interface MetricConfig {
  title: string;
  key: Exclude<keyof QueueMetricsResponse, "dadosDeEntrada" | "observacao">;
  decimals?: number;
  info?: string;
}

const metricsConfig: MetricConfig[] = [
  { 
    title: "Capacidade Máxima do Sistema", 
    key: "capacidadeMaxima",
    info: "Número máximo de clientes que podem estar no sistema simultaneamente (na fila + sendo atendidos). Se não especificado, o sistema tem capacidade infinita."
  },
  { 
    title: "Número Médio de Clientes na Fila", 
    key: "numeroMedioClientesFila",
    info: "Lq - Número esperado de clientes aguardando atendimento na fila (não inclui os que estão sendo atendidos). Indica o congestionamento da fila."
  },
  {
    title: "Número Médio de Clientes no Sistema",
    key: "numeroMedioClientesSistema",
    info: "L - Número esperado de clientes no sistema total (na fila + sendo atendidos). É igual a Lq + número médio sendo atendido."
  },
  { 
    title: "Probabilidade de Espera", 
    key: "probabilidadeDeEspera",
    info: "Probabilidade de um cliente ter que aguardar na fila (não ser atendido imediatamente). Indica a chance de encontrar o sistema ocupado."
  },
  { 
    title: "Probabilidade do Sistema Vazio", 
    key: "probabilidadeSistemaVazio",
    info: "P₀ - Probabilidade de não haver nenhum cliente no sistema. Indica a frequência com que o sistema fica ocioso."
  },
  { 
    title: "Taxa de Bloqueio", 
    key: "taxaDeBloqueio",
    info: "Probabilidade de um cliente ser rejeitado devido à capacidade máxima do sistema estar ocupada. Só se aplica a sistemas com capacidade finita."
  },
  { 
    title: "Taxa de Saída", 
    key: "taxaDeSaida",
    info: "Taxa efetiva de clientes que saem do sistema após serem atendidos. Pode ser menor que a taxa de chegada em sistemas com bloqueio."
  },
  { 
    title: "Tempo Médio na Fila", 
    key: "tempoMedioFila",
    info: "Wq - Tempo esperado que um cliente aguarda na fila antes de começar a ser atendido. Não inclui o tempo de atendimento."
  },
  { 
    title: "Tempo Médio no Sistema", 
    key: "tempoMedioSistema",
    info: "W - Tempo total esperado que um cliente permanece no sistema (tempo na fila + tempo de atendimento). Relacionado a Wq pela Lei de Little."
  },
  { 
    title: "Utilização do Sistema", 
    key: "utilizacaoSistema",
    info: "ρ - Fração do tempo que o sistema está ocupado. Valores próximos a 1 indicam alta utilização e possível congestionamento. Deve ser < 1 para estabilidade."
  },
];

const styles = {
  card: {
    p: 2,
    border: "1px solid #e0e0e0",
    borderRadius: 1,
    minHeight: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modelCard: {
    p: 3,
    border: "2px solid #1976d2",
    borderRadius: 2,
    minHeight: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(25, 118, 210, 0.04)",
    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.15)",
    textAlign: "center",
  },
  title: {
    width: "100%",
    fontWeight: "bold",
    fontSize: "0.9rem",
    lineHeight: 1.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modelTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    lineHeight: 1.2,
    color: "#1976d2",
    mb: 1,
  },
  value: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "primary.main",
    mt: 1,
  },
  modelValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1976d2",
    letterSpacing: "0.5px",
  },
};

function MetricsDialog({ open, onClose, metrics }: MetricsDialogProps) {
  const formatValue = (
    value: string | number | undefined | null,
    decimals: number = 4
  ): string => {
    if (value === null || value === undefined) return "0";
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toFixed(decimals);
    return String(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h4" sx={{ textAlign: "center" }}>
        Métricas
      </DialogTitle>
      <DialogContent>
        {metrics ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                alignItems: "start",
                mb: 3,
              }}
            >
              <Typography
                variant="body1"
                sx={[styles.modelCard, { gridColumn: "span 2" }]}
              >
                <Box component="span" sx={styles.modelTitle}>
                  Modelo do Sistema
                </Box>
                <Box component="span" sx={styles.modelValue}>
                  {metrics.modelo}
                </Box>
              </Typography>
              {metricsConfig.map((metric) => {
                const value = metrics[metric.key];
                // Pular métricas que são undefined ou null e não têm valor padrão
                if (value === undefined || value === null) return null;

                return (
                  <Typography key={metric.key} variant="body1" sx={styles.card}>
                    <Box component="span" sx={styles.title}>
                      {metric.title}
                      {metric.info && (
                        <Tooltip
                          title={metric.info}
                          componentsProps={{
                            tooltip: {
                              sx: {
                                fontSize: "14px",
                                maxWidth: 300,
                              },
                            },
                          }}
                        >
                          <IconButton edge="end">
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    <Box component="span" sx={styles.value}>
                      {formatValue(value, metric.decimals)}
                    </Box>
                  </Typography>
                );
              })}
              <Typography
                variant="body1"
                sx={[styles.card, { gridColumn: "span 2" }]}
              >
                <Box component="span" sx={styles.title}>
                  Dados de Entrada
                </Box>
                <Box 
                  component="pre" 
                  sx={{
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    color: "#1976d2",
                    // backgroundColor: "rgba(25, 118, 210, 0.08)",
                    padding: 2,
                    borderRadius: 1,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxWidth: "100%",
                    overflow: "auto"
                  }}
                >
                  {JSON.stringify(metrics.dadosDeEntrada, null, 2)}
                </Box>
              </Typography>
            </Box>

            {/* Observação, se existir */}
            {metrics.observacao && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                  Observação:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {metrics.observacao}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Nenhuma métrica disponível
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MetricsDialog;
