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

    // Fazer requisição direta para a API externa com a página específica
    const url = `https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=${page}&porPagina=${pageSize}&faixaIdadeInicial=0&faixaIdadeFinal=120`;
    
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
    const mappedData = data.content.map(mapAbitusPersonToPerson);

    const result: SearchResult = {
      data: mappedData,
      total: data.totalElements,
      page: page,
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
