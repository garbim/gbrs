export enum TijoloStatus {
  EM_INSPECAO = 'EM_INSPECAO',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
}

export interface Tijolo {
  id: number;
  cor: string;
  furos: string;
  status: TijoloStatus;
  defeituoso?: boolean;
}
