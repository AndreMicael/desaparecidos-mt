import { NextRequest, NextResponse } from 'next/server';
import { Person, AbitusResponse, mapAbitusPersonToPerson } from '../utils/abitus';

interface SearchResult {
  data: Person[];
  total: number;
  page: number;
  pageSize: number;
}

// Função para remover acentos
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Função para normalizar texto (sem acentos e lowercase)
function normalizeText(str: string): string {
  return removeAccents(str.toLowerCase().trim());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

    // Parâmetros de filtro
    const nome = searchParams.get('nome') || '';
    const idadeMinima = searchParams.get('idadeMinima') || '';
    const idadeMaxima = searchParams.get('idadeMaxima') || '';
    const sexos = searchParams.getAll('sexos');
    const status = searchParams.getAll('status');

    console.log('Filtros recebidos:', { status, nome, idadeMinima, idadeMaxima, sexos });

    // Converter página do frontend (1-based) para API externa (0-based)
    const externalPage = page - 1;

    // Construir URL da API externa com filtros
    const urlParams = new URLSearchParams({
      pagina: externalPage.toString(),
      porPagina: pageSize.toString()
    });

    // Adicionar filtros de idade se fornecidos
    if (idadeMinima || idadeMaxima) {
      urlParams.append('faixaIdadeInicial', idadeMinima || '0');
      urlParams.append('faixaIdadeFinal', idadeMaxima || '120');
    }

    // Adicionar filtro de nome se fornecido
    if (nome) {
      urlParams.append('nome', nome);
    }

    // Adicionar filtros de sexo se fornecidos
    if (sexos.length > 0) {
      const sexoParam = sexos.map(sexo => sexo.toUpperCase()).join(',');
      urlParams.append('sexo', sexoParam);
    }

    // Aplicar filtro de status localmente (desaparecido/localizado)
    if (status.length > 0) {
      // Se o filtro for apenas "localizado", usar o parâmetro da API externa
      if (status.length === 1 && status[0] === 'localizado') {
        urlParams.append('status', 'LOCALIZADO');
        console.log('Aplicando filtro LOCALIZADO na API externa');
      } else if (status.length === 1 && status[0] === 'desaparecido') {
        // Para desaparecidos, não aplicar filtro na API externa (mostrar todos exceto localizados)
        // Vamos aplicar o filtro localmente após receber os dados
        console.log('Aplicando filtro DESAPARECIDO localmente');
      } else {
        // Se ambos os status estiverem selecionados, não aplicar filtro
        // Vamos aplicar o filtro localmente após receber os dados
        console.log('Aplicando filtro MISTO localmente');
      }
    }

    const url = `${process.env.NEXT_PUBLIC_ABITUS_API_URL || 'https://abitus-api.geia.vip/v1'}/pessoas/aberto/filtro?${urlParams.toString()}`;
    console.log('URL da API externa:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API externa: ${response.status} ${response.statusText}`);
    }

    const data: AbitusResponse = await response.json();
    console.log('Dados brutos da API externa:', data.content?.length || 0, 'pessoas');
    
    // Mapear os dados da API para o formato da aplicação
    let mappedData = data.content.map(mapAbitusPersonToPerson);
    console.log('Dados mapeados:', mappedData.length, 'pessoas');

    // Contar pessoas localizadas para debug
    const localizadas = mappedData.filter(p => p.localizado);
    console.log('Pessoas localizadas encontradas:', localizadas.length);

    // Aplicar filtro de nome localmente para busca mais precisa
    if (nome) {
      const searchTerm = normalizeText(nome);
      console.log('Termo de busca normalizado:', `"${searchTerm}"`);
      
      mappedData = mappedData.filter(person => {
        const personName = normalizeText(person.nome);
        console.log(`Verificando normalizado: "${personName}" vs "${searchTerm}"`);
        
        // Busca exata
        if (personName === searchTerm) {
          console.log(`✓ Match exato: "${person.nome}"`);
          return true;
        }
        
        // Busca por palavras completas (não parciais)
        const searchWords = searchTerm.split(' ').filter((word: string) => word.length > 0);
        const personWords = personName.split(' ').filter((word: string) => word.length > 0);
        
        console.log(`Palavras de busca normalizadas: [${searchWords.join(', ')}]`);
        console.log(`Palavras da pessoa normalizadas: [${personWords.join(', ')}]`);
        
        // Verificar se pelo menos uma palavra do termo de busca é uma palavra completa no nome
        const hasExactWordMatch = searchWords.some((searchWord: string) => 
          personWords.some((personWord: string) => personWord === searchWord)
        );
        
        if (hasExactWordMatch) {
          console.log(`✓ Match por palavra exata: "${person.nome}"`);
        } else {
          console.log(`✗ Não match: "${person.nome}"`);
        }
        
        return hasExactWordMatch;
      });
      console.log('Após filtro de nome:', mappedData.length, 'pessoas');
    }

    // Aplicar filtro de status localmente apenas se necessário
    if (status.length > 0 && !(status.length === 1 && status[0] === 'localizado')) {
      mappedData = mappedData.filter(person => {
        if (status.includes('desaparecido') && status.includes('localizado')) {
          return true; // Mostrar todos
        } else if (status.includes('desaparecido')) {
          return !person.localizado;
        } else if (status.includes('localizado')) {
          return person.localizado;
        }
        return true;
      });
      console.log('Após filtro local:', mappedData.length, 'pessoas');
    }

    const result: SearchResult = {
      data: mappedData,
      total: data.totalElements,
      page: page, // Manter a página original do frontend (1-based)
      pageSize: pageSize
    };

    console.log('Resultado final:', result.data.length, 'pessoas');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
