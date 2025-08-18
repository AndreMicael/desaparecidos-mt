export interface Person {
  id: number;
  nome: string;
  idade?: number;
  dtNascimento?: string;
  dtDesaparecimento?: string;
  localDesaparecimentoConcat?: string;
  ultimaOcorrencia?: string;
  foto?: string;
  sexo: 'masculino' | 'feminino';
  localizado: boolean;
}

export interface SearchFilters {
  nome: string;
  idadeMinima: string;
  idadeMaxima: string;
  sexos: ('masculino' | 'feminino')[];
  status: ('desaparecido' | 'localizado')[];
}

export interface SearchResult {
  data: Person[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Statistics {
  total: number;
  localizadas: number;
}
