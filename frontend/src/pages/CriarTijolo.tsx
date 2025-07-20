import React, { useState } from 'react';
import { Tijolo } from '../types/tijolo';
import { criarTijolo, criarTijoloAleatorio } from '../services/api';

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';

const opcoesCores = ['branco', 'preto'];
const opcoesFuros = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

export default function CriarTijolo() {
  const [cor, setCor] = useState('branco');
  const [furos, setFuros] = useState('1');
  const [tijoloCriado, setTijoloCriado] = useState<Tijolo | null>(null);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTijoloCriado(null);

    try {
      const novoTijolo = await criarTijolo({ cor, furos });
      setTijoloCriado(novoTijolo);
      setSnackbarSeverity('success');
      setSnackbarMessage('Tijolo criado com sucesso!');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarSeverity('error');
      setSnackbarMessage(err.message || 'Erro ao criar tijolo');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const onCriarAleatorio = async () => {
    setLoading(true);
    setTijoloCriado(null);

    try {
      const tijolo = await criarTijoloAleatorio();
      setTijoloCriado(tijolo);
      setCor(tijolo.cor);
      setFuros(tijolo.furos);
      setSnackbarSeverity('success');
      setSnackbarMessage('Tijolo aleatório criado!');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarSeverity('error');
      setSnackbarMessage(err.message || 'Erro ao criar tijolo aleatório');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={2}>
      <Typography variant="h4" gutterBottom>
        Criar Tijolo
      </Typography>

      <form onSubmit={onSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="cor-label">Cor</InputLabel>
          <Select
            labelId="cor-label"
            value={cor}
            label="Cor"
            onChange={(e: SelectChangeEvent) => setCor(e.target.value)}
          >
            {opcoesCores.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="furos-label">Furos</InputLabel>
          <Select
            labelId="furos-label"
            value={furos}
            label="Furos"
            onChange={(e: SelectChangeEvent) => setFuros(e.target.value)}
          >
            {opcoesFuros.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            Criar Tijolo
          </Button>

          <Button
            variant="outlined"
            onClick={onCriarAleatorio}
            disabled={loading}
          >
            Gerar Tijolo Aleatório
          </Button>
        </Box>
      </form>

      {loading && (
        <Box mt={3} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {tijoloCriado && (
        <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tijolo Criado:
          </Typography>
          <Typography>ID: {tijoloCriado.id}</Typography>
          <Typography>Cor: {tijoloCriado.cor}</Typography>
          <Typography>Furos: {tijoloCriado.furos}</Typography>
          <Typography>Status: {tijoloCriado.status.replace('_', ' ')}</Typography>
          <Typography>Defeituoso: {tijoloCriado.defeituoso ? 'Sim' : 'Não'}</Typography>
        </Paper>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
