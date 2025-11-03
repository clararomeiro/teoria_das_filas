import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  InputAdornment,
  Tooltip,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import MetricsDialog from "./MetricsDialog";
import { useMetricsMock as useMetrics, type QueueParameters, type QueueMetric } from "./useMetricsMock";

function App() {
  const [arrivalRate, setArrivalRate] = useState<string>("");
  const [serviceRate, setServiceRate] = useState<string>("");
  const [servers, setServers] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [initialCustomers, setInitialCustomers] = useState<string>("");
  const [discipline, setDiscipline] = useState<string>("FIFO");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [metricsData, setMetricsData] = useState<QueueMetric[]>([]);

  const { mutate: calculateMetrics, isPending, error } = useMetrics();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const parameters: QueueParameters = {
      arrivalRate: parseFloat(arrivalRate),
      serviceRate: parseFloat(serviceRate),
      servers: parseInt(servers),
      capacity: capacity ? parseInt(capacity) : undefined,
      initialCustomers: initialCustomers ? parseInt(initialCustomers) : undefined,
      discipline,
    };

    calculateMetrics(parameters, {
      onSuccess: (data) => {
        console.log('Métricas calculadas:', data);
        setMetricsData(data);
        setDialogOpen(true);
      },
      onError: (error) => {
        console.error('Erro ao calcular métricas:', error);
      }
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleClear = () => {
    setArrivalRate("");
    setServiceRate("");
    setServers("");
    setCapacity("");
    setInitialCustomers("");
    setDiscipline("FIFO");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Container
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          alignItems: "start",
          justifyContent: "center",
          width: "45%",
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          color="black"
          sx={{ gridColumn: "1 / -1", textAlign: "center", mb: 3 }}
        >
          Simulador de Filas
        </Typography>

        <TextField
          label="Taxa de chegada (λ)"
          variant="outlined"
          type="number"
          value={arrivalRate}
          onChange={(e) => setArrivalRate(e.target.value)}
          disabled={isPending}
          inputProps={{
            step: "any",
            min: "0",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Taxa média de chegada de clientes por unidade de tempo. Por exemplo: 5 clientes por hora."
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
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Taxa de serviço (μ)"
          variant="outlined"
          type="number"
          value={serviceRate}
          onChange={(e) => setServiceRate(e.target.value)}
          disabled={isPending}
          inputProps={{
            step: "any",
            min: "0",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Taxa média de atendimento de clientes por unidade de tempo. Deve ser maior que λ para garantir estabilidade da fila."
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
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Número de servidores (c)"
          variant="outlined"
          type="number"
          value={servers}
          onChange={(e) => setServers(e.target.value)}
          disabled={isPending}
          inputProps={{
            step: "1",
            min: "1",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Quantos atendentes, processadores ou máquinas há no sistema. Exemplo: 1 servidor → modelo M/M/1; 3 servidores → M/M/3."
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
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Capacidade máxima do sistema (K)*"
          variant="outlined"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          disabled={isPending}
          inputProps={{
            step: "1",
            min: "1",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Número máximo de clientes (na fila + sendo atendidos). Usado em modelos finitos como M/M/1/K. Deixe vazio para capacidade infinita."
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
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Número inicial de clientes (n₀)*"
          variant="outlined"
          type="number"
          value={initialCustomers}
          onChange={(e) => setInitialCustomers(e.target.value)}
          inputProps={{
            step: "1",
            min: "0",
          }}
          disabled={isPending}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Número de clientes já no sistema no início da simulação. Útil em simulações ou cálculos temporais (não estacionários)."
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
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Disciplina de atendimento"
          variant="outlined"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          disabled={isPending}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Ordem em que os clientes são atendidos. FIFO (First In, First Out) é o mais comum, mas também há LIFO, Prioridades, etc."
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
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="FIFO">FIFO (First In, First Out)</MenuItem>
          <MenuItem value="LIFO">LIFO (Last In, First Out)</MenuItem>
          <MenuItem value="PRIORITY">Prioridades</MenuItem>
          <MenuItem value="RANDOM">Aleatório</MenuItem>
        </TextField>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            gridColumn: "1 / -1",
            // textAlign: "center",
            mt: 1,
            mb: 1,
            fontStyle: "italic",
          }}
        >
          * Campos opcionais
        </Typography>

        {error && (
          <Alert severity="error" sx={{ gridColumn: "1 / -1", mb: 2 }}>
            Erro ao calcular métricas: {error.message}
          </Alert>
        )}

        <Box
          sx={{
            textAlign: "center",
            width: "100%",
            gridColumn: "1 / -1",
            mt: 2,
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            sx={{ width: "40%" }}
            onClick={handleClear}
            disabled={
              !arrivalRate &&
              !serviceRate &&
              !servers &&
              !capacity &&
              !initialCustomers &&
              discipline === "FIFO"
            }
          >
            Limpar
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "40%" }}
            onClick={handleSubmit}
            disabled={!arrivalRate || !serviceRate || !servers || isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {isPending ? "Calculando..." : "Calcular"}
          </Button>
        </Box>

        <MetricsDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          metrics={metricsData}
        />
      </Container>
    </Box>
  );
}

export default App;
