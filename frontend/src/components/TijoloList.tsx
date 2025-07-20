import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  CircularProgress, TextField, Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Box
} from '@mui/material';
import {
  Visibility, CheckCircle, Cancel, Delete, HourglassTop, HelpOutline, Warning
} from '@mui/icons-material';

import { Tijolo, TijoloStatus } from '../types/tijolo';
import { listarTijolos, buscarTijoloPorId, atualizarStatus, deletarTijolo } from '../services/api';

const corMap: Record<string, string> = {
  preto: '#000000',
  branco: '#FFFFFF',
};

function CorBadge({ cor }: { cor: string }) {
  const corLower = cor.toLowerCase();
  const colorHex = corMap[corLower] ?? '#999999';
  const borderColor = colorHex === '#FFFFFF' ? '#ccc' : 'transparent';

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: colorHex,
          border: `1px solid ${borderColor}`,
        }}
      />
      <Typography>{cor}</Typography>
    </Box>
  );
}

function StatusBadge({ status }: { status: TijoloStatus | string }) {
  let icon = <HelpOutline sx={{ color: 'gray', mr: 0.5 }} />;
  let color = 'gray';
  let label = status.replace('_', ' ');

  switch (status) {
    case TijoloStatus.APROVADO:
      icon = <CheckCircle sx={{ color: 'green', mr: 0.5 }} />;
      color = 'green';
      break;
    case TijoloStatus.EM_INSPECAO:
      icon = <HourglassTop sx={{ color: 'orange', mr: 0.5 }} />;
      color = 'orange';
      break;
    case TijoloStatus.REPROVADO:
      icon = <Cancel sx={{ color: 'red', mr: 0.5 }} />;
      color = 'red';
      break;
  }

  return (
    <Box display="flex" alignItems="center" color={color} fontWeight="bold">
      {icon}
      <Typography component="span">{label}</Typography>
    </Box>
  );
}

export function TijoloList() {
  const [tijolos, setTijolos] = useState<Tijolo[]>([]);
  const [statusFilter, setStatusFilter] = useState<TijoloStatus | ''>('');
  const [corFilter, setCorFilter] = useState('');
  const [idBusca, setIdBusca] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'success' }>({
    open: false, message: '', severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const navigate = useNavigate();

  const showSnackbar = (message: string, severity: 'error' | 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const coresDisponiveis = Object.keys(corMap);

  async function carregarTijolos() {
    setLoading(true);
    try {
      if (idBusca.trim()) {
        const id = Number(idBusca);
        if (isNaN(id)) {
          showSnackbar('ID inválido', 'error');
          setTijolos([]);
          return;
        }
        const tijolo = await buscarTijoloPorId(id);
        setTijolos([tijolo]);
      } else {
        const todos = await listarTijolos();
        let filtrados = todos;
        if (statusFilter) filtrados = filtrados.filter(t => t.status === statusFilter);
        if (corFilter.trim()) filtrados = filtrados.filter(t => t.cor.toLowerCase() === corFilter.toLowerCase());
        setTijolos(filtrados);
      }
    } catch (err: any) {
      showSnackbar(err.message || 'Erro ao carregar tijolos', 'error');
      setTijolos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTijolos();
  }, [statusFilter, corFilter]);

  async function handleAtualizarStatus(id: number, status: TijoloStatus) {
    try {
      await atualizarStatus(id, status);
      showSnackbar('Status atualizado com sucesso', 'success');

      setTijolos(current =>
        current.map(t => (t.id === id ? { ...t, status } : t))
      );
    } catch (err: any) {
      showSnackbar(err.message || 'Erro ao atualizar status', 'error');
    }
  }

  async function handleDeletarConfirmado() {
    if (deleteDialog.id === null) return;
    try {
      await deletarTijolo(deleteDialog.id);
      showSnackbar('Tijolo apagado com sucesso', 'success');

      setTijolos(current => current.filter(t => t.id !== deleteDialog.id));
    } catch (err: any) {
      showSnackbar(err.message || 'Erro ao apagar tijolo', 'error');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  }

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Listagem de Tijolos</Typography>

      {/* Filtros fixos */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
          p: 2,
          borderBottom: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Buscar por ID"
          variant="outlined"
          size="small"
          value={idBusca}
          onChange={e => setIdBusca(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && carregarTijolos()}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={e => setStatusFilter(e.target.value as TijoloStatus | '')}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.values(TijoloStatus).map(status => (
              <MenuItem key={status} value={status}>
                <StatusBadge status={status} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Cor</InputLabel>
          <Select
            value={corFilter}
            label="Cor"
            onChange={e => setCorFilter(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {coresDisponiveis.map(cor => (
              <MenuItem key={cor} value={cor}>
                <CorBadge cor={cor} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Listagem com scroll */}
      <Box
        sx={{
          maxHeight: '60vh',
          overflowY: 'auto',
          mt: 2,
          border: '1px solid #ddd',
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Cor</strong></TableCell>
                  <TableCell><strong>Furos</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Defeituoso</strong></TableCell>
                  <TableCell align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tijolos.map((t, index) => (
                  <TableRow
                    key={t.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      '&:hover': { backgroundColor: '#e3f2fd' },
                    }}
                  >
                    <TableCell>{t.id}</TableCell>
                    <TableCell><CorBadge cor={t.cor} /></TableCell>
                    <TableCell>{t.furos}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {t.defeituoso ? (
                          <>
                            <Warning color="error" />
                            <Typography>Sim</Typography>
                          </>
                        ) : (
                          <Typography>Não</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton title="Detalhes" onClick={() => navigate(`/tijolos/${t.id}`)}>
                        <Visibility />
                      </IconButton>

                      {t.status === TijoloStatus.EM_INSPECAO && (
                        <>
                          <IconButton
                            title="Aprovar"
                            color="success"
                            onClick={() => handleAtualizarStatus(t.id, TijoloStatus.APROVADO)}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            title="Reprovar"
                            color="warning"
                            onClick={() => handleAtualizarStatus(t.id, TijoloStatus.REPROVADO)}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}

                      {t.defeituoso && t.status !== TijoloStatus.REPROVADO && (
                        <IconButton
                          title="Apagar"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, id: t.id })}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {tijolos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum tijolo encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>Deseja realmente apagar este tijolo?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancelar</Button>
          <Button onClick={handleDeletarConfirmado} color="error">Apagar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
