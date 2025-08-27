import { NextResponse } from 'next/server';
import { AbitusResponse, mapAbitusPersonToPerson } from '../utils/abitus';

interface Statistics {
  total: number;
  localizadas: number;
}

export async function GET() {
  try {
    // Buscar total de pessoas (todas)
    const totalUrl = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=0&porPagina=1';
    const totalResponse = await fetch(totalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!totalResponse.ok) {
      throw new Error(`Erro na API externa: ${totalResponse.status} ${totalResponse.statusText}`);
    }

    const totalData: AbitusResponse = await totalResponse.json();
    const totalElements = totalData.totalElements;

    // Buscar pessoas localizadas usando o parâmetro status=LOCALIZADO
    const localizadasUrl = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=0&porPagina=1&status=LOCALIZADO';
    const localizadasResponse = await fetch(localizadasUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!localizadasResponse.ok) {
      throw new Error(`Erro na API externa (localizadas): ${localizadasResponse.status} ${localizadasResponse.statusText}`);
    }

    const localizadasData: AbitusResponse = await localizadasResponse.json();
    const localizadas = localizadasData.totalElements;
    
    const statistics: Statistics = {
      total: totalElements,
      localizadas
    };

    console.log(`Estatísticas calculadas: ${totalElements} total, ${localizadas} localizadas`);

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
