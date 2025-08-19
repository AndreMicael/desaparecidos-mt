import { NextRequest, NextResponse } from 'next/server';
import { Person, AbitusResponse, mapAbitusPersonToPerson } from '../utils/abitus';

interface SearchResult {
  data: Person[];
  total: number;
  page: number;
  pageSize: number;
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
      } else if (status.length === 1 && status[0] === 'desaparecido') {
        // Para desaparecidos, não aplicar filtro na API externa (mostrar todos exceto localizados)
        // Vamos aplicar o filtro localmente após receber os dados
      } else {
        // Se ambos os status estiverem selecionados, não aplicar filtro
        // Vamos aplicar o filtro localmente após receber os dados
      }
    }

    const url = `https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?${urlParams.toString()}`;
    
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
    
    // Mapear os dados da API para o formato da aplicação
    let mappedData = data.content.map(mapAbitusPersonToPerson);

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
    }

    const result: SearchResult = {
      data: mappedData,
      total: data.totalElements,
      page: page, // Manter a página original do frontend (1-based)
      pageSize: pageSize
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
