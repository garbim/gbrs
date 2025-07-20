import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import {
  BlurCircular,
  ViewModule,
  Square,
  Visibility,
  CheckCircle,
  Cancel,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { obterRelatorio } from '../services/api';
import { RelatorioTijolo } from '../types/relatorioTijolo';

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: typeof BlurCircular;
  color?: string;
}) {
  return (
    <Card sx={{ minWidth: 180 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon sx={{ color: color || 'inherit' }} />
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
        <Typography variant="h5" fontWeight={600} mt={1}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function RelatorioEstatistico() {
  const [relatorio, setRelatorio] = useState<RelatorioTijolo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setError(null);
      try {
        const data = await obterRelatorio();
        setRelatorio(data);
      } catch {
        setError('Erro ao carregar relatório');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) return <p>Carregando relatório...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!relatorio) return null;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Relatório Estatístico de Tijolos
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Tijolos Brancos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Furos pares"
                value={relatorio.brancosFurosPares}
                icon={ViewModule}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Furos ímpares"
                value={relatorio.brancosFurosImpares}
                icon={BlurCircular}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12}>
              <StatCard
                title="Total de brancos"
                value={relatorio.totalBrancos}
                icon={Square}
                color="#1976d2"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Tijolos Pretos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Furos pares"
                value={relatorio.pretosFurosPares}
                icon={ViewModule}
                color="#000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Furos ímpares"
                value={relatorio.pretosFurosImpares}
                icon={BlurCircular}
                color="#000"
              />
            </Grid>
            <Grid item xs={12}>
              <StatCard
                title="Total de pretos"
                value={relatorio.totalPretos}
                icon={Square}
                color="#000"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Status Gerais
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <StatCard
                title="Em inspeção"
                value={relatorio.totalEmInspecao}
                icon={Visibility}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <StatCard
                title="Aprovados"
                value={relatorio.totalAprovados}
                icon={CheckCircle}
                color="#2e7d32"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <StatCard
                title="Reprovados"
                value={relatorio.totalReprovados}
                icon={Cancel}
                color="#d32f2f"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <StatCard
                title="Defeituosos"
                value={relatorio.totalDefeituosos}
                icon={ErrorIcon}
                color="#b71c1c"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
