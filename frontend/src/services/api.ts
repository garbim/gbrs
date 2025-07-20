import axios from 'axios';
import { Tijolo } from '../types/tijolo';
import { RelatorioTijolo } from '../types/relatorioTijolo';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// GET /tijolos
export async function listarTijolos(): Promise<Tijolo[]> {
  const { data } = await api.get('/tijolos');
  return data;
}

// GET /tijolos/relatorio
export async function obterRelatorio(): Promise<RelatorioTijolo> {
  const { data } = await api.get('/tijolos/relatorio');
  return data;
}

// GET /tijolos/:id
export async function buscarTijoloPorId(id: number): Promise<Tijolo> {
  const { data } = await api.get(`/tijolos/${id}`);
  return data;
}

// POST /tijolos
export async function criarTijolo(tijolo: Partial<Tijolo>): Promise<Tijolo> {
  const { data } = await api.post('/tijolos', tijolo);
  return data;
}

// POST /tijolos/aleatorio
export async function criarTijoloAleatorio(): Promise<Tijolo> {
  const { data } = await api.post('/tijolos/aleatorio');
  return data;
}

// PUT /tijolos/:id/status?status=APROVADO
export async function atualizarStatus(id: number, status: string): Promise<Tijolo> {
  const { data } = await api.put(`/tijolos/${id}/status`, null, {
    params: { status },
  });
  return data;
}

// DELETE /tijolos/:id
export async function deletarTijolo(id: number): Promise<void> {
  await api.delete(`/tijolos/${id}`);
}
