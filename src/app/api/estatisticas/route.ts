import { NextResponse } from 'next/server';
import { AbitusResponse, mapAbitusPersonToPerson } from '../utils/abitus';

interface Statistics {
  total: number;
  localizadas: number;
}

export async function GET() {
  try {
    // Fazer uma requisição para obter estatísticas (primeira página com tamanho grande)
    const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=1&porPagina=1000&faixaIdadeInicial=0&faixaIdadeFinal=120';
    
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
    
    // Mapear os dados para calcular estatísticas
    const allPersons = data.content.map(mapAbitusPersonToPerson);
    
    const total = data.totalElements;
    const localizadas = allPersons.filter(person => person.localizado).length;
    
    const statistics: Statistics = {
      total,
      localizadas
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
