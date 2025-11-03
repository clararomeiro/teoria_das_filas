import React from "react";
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
import { type QueueMetric } from "./useMetrics";
import { InfoOutlined } from "@mui/icons-material";

interface MetricsDialogProps {
  open: boolean;
  onClose: () => void;
  metrics?: QueueMetric[];
}

function MetricsDialog({ open, onClose, metrics }: MetricsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h4" sx={{ textAlign: "center" }}>
        Métricas
      </DialogTitle>
      <DialogContent>
        {metrics && metrics.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              alignItems: "start",
            }}
          >
            {metrics.map((metric, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    lineHeight: 1.2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {metric.metric}
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
                <Box
                  component="span"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "500",
                    color: "primary.main",
                    mt: 1,
                  }}
                >
                  {metric.value.toFixed(4)}
                </Box>
              </Typography>
            ))}
          </Box>
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
