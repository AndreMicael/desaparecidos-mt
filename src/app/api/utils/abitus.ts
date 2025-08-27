// Interface para a resposta da API do Abitus baseada na estrutura real
export interface AbitusPerson {
  id: number;
  nome: string;
  idade: number;
  sexo: 'MASCULINO' | 'FEMININO';
  vivo: boolean;
  urlFoto: string | null;
  ultimaOcorrencia: {
    dtDesaparecimento: string;
    dataLocalizacao: string | null;
    encontradoVivo: boolean;
    localDesaparecimentoConcat: string;
    ocorrenciaEntrevDesapDTO: {
      informacao: string | null;
      vestimentasDesaparecido: string;
    };
    listaCartaz: any;
    ocoId: number;
  };
}

export interface AbitusResponse {
  content: AbitusPerson[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

// Interface para os dados retornados pela nossa API
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

// Função para mapear dados da API do Abitus para o formato da aplicação
export function mapAbitusPersonToPerson(abitusPerson: AbitusPerson): Person {
  return {
    id: abitusPerson.id,
    nome: abitusPerson.nome,
    idade: abitusPerson.idade,
    dtNascimento: undefined, // A API não fornece data de nascimento, apenas idade
    dtDesaparecimento: abitusPerson.ultimaOcorrencia?.dtDesaparecimento,
    localDesaparecimentoConcat: abitusPerson.ultimaOcorrencia?.localDesaparecimentoConcat,
    ultimaOcorrencia: abitusPerson.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.informacao || '',
    foto: abitusPerson.urlFoto || '',
    sexo: abitusPerson.sexo === 'MASCULINO' ? 'masculino' : 'feminino',
    // Considera localizado quando há data de localização ou quando encontradoVivo é true
    localizado: Boolean(abitusPerson.ultimaOcorrencia?.dataLocalizacao || abitusPerson.ultimaOcorrencia?.encontradoVivo)
  };
}

// Cache global para armazenar todos os dados carregados
let allPersonsCache: Person[] | null = null;

// Função para carregar todos os dados da API do Abitus
export async function loadAllPersons(): Promise<Person[]> {
  if (allPersonsCache) {
    return allPersonsCache;
  }

  try {
    // Primeiro request para descobrir total de páginas
    const firstUrl = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=1&porPagina=50&faixaIdadeInicial=0&faixaIdadeFinal=120';
    const firstResponse = await fetch(firstUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!firstResponse.ok) {
      throw new Error(`Erro na API: ${firstResponse.status} ${firstResponse.statusText}`);
    }

    const firstData: AbitusResponse = await firstResponse.json();

    const totalPages = Math.max(1, firstData.totalPages || 1);
    const aggregated: AbitusPerson[] = [...(firstData.content || [])];

    // Buscar as demais páginas (2..totalPages)
    for (let page = 2; page <= totalPages; page++) {
      const pageUrl = `https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=${page}&porPagina=50&faixaIdadeInicial=0&faixaIdadeFinal=120`;
      const resp = await fetch(pageUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!resp.ok) {
        throw new Error(`Erro na API (página ${page}): ${resp.status} ${resp.statusText}`);
      }
      const data: AbitusResponse = await resp.json();
      if (Array.isArray(data.content) && data.content.length > 0) {
        aggregated.push(...data.content);
      }
    }

    // Mapear e deduplicar por id
    const mapped = aggregated.map(mapAbitusPersonToPerson);
    const byId = new Map<number, Person>();
    for (const p of mapped) {
      byId.set(p.id, p);
    }
    allPersonsCache = Array.from(byId.values());

    console.log(`Carregadas ${allPersonsCache.length} pessoas da API (todas as páginas)`);
    return allPersonsCache;
  } catch (error) {
    console.error('Erro ao carregar pessoas:', error);
    throw error;
  }
}

// Função para limpar o cache (útil para forçar recarregamento)
export function clearCache(): void {
  allPersonsCache = null;
  console.log('Cache limpo');
}
