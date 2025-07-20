import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tijolo, TijoloStatus } from '../types/tijolo';
import { buscarTijoloPorId, atualizarStatus, deletarTijolo } from '../services/api';

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

export default function TijoloDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tijolo, setTijolo] = useState<Tijolo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('ID do tijolo não informado');
      setLoading(false);
      return;
    }
    async function fetchTijolo() {
      try {
        setLoading(true);
        const data = await buscarTijoloPorId(Number(id));
        setTijolo(data);
      } catch {
        setError('Erro ao carregar tijolo');
      } finally {
        setLoading(false);
      }
    }
    fetchTijolo();
  }, [id]);

 

  async function handleAtualizarStatus(status: TijoloStatus) {
  if (!tijolo) return;
  try {
    // Aqui já recebe o tijolo atualizado, incluindo defeituoso
    const tijoloAtualizado = await atualizarStatus(tijolo.id, status);
    setTijolo(tijoloAtualizado);
  } catch {
    alert('Erro ao atualizar status');
  }
}

  async function handleDeletar() {
    if (!tijolo) return;
    try {
      await deletarTijolo(tijolo.id);
      setSnackbar({ open: true, message: 'Tijolo apagado com sucesso!', severity: 'success' });
      setConfirmDialogOpen(false);
      navigate('/'); // volta para lista após deletar
    } catch {
      setSnackbar({ open: true, message: 'Erro ao apagar tijolo', severity: 'error' });
    }
  }

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!tijolo)
    return (
      <Box mt={4}>
        <Alert severity="warning">Tijolo não encontrado.</Alert>
      </Box>
    );

  return (
    <Box p={3} maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Detalhes do Tijolo #{tijolo.id}
      </Typography>

      <Typography><strong>Cor:</strong> {tijolo.cor}</Typography>
      <Typography><strong>Furos:</strong> {tijolo.furos}</Typography>
      <Typography><strong>Status:</strong> {tijolo.status.replace('_', ' ')}</Typography>
      <Typography><strong>Defeituoso:</strong> {tijolo.defeituoso ? 'Sim' : 'Não'}</Typography>

      {tijolo.status === TijoloStatus.EM_INSPECAO && (
        <Box mt={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAtualizarStatus(TijoloStatus.APROVADO)}
            sx={{ mr: 1 }}
          >
            Aprovar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleAtualizarStatus(TijoloStatus.REPROVADO)}
          >
            Reprovar
          </Button>
        </Box>
      )}

      {tijolo.defeituoso && (
        <Box mt={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmDialogOpen(true)}
          >
            Apagar
          </Button>
        </Box>
      )}

      <Box mt={4}>
        <Button variant="text" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>

      {/* Dialog de confirmação para deletar */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja apagar este tijolo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDeletar}>Apagar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
