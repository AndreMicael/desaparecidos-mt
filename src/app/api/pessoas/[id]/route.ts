import { NextRequest, NextResponse } from 'next/server';
import { AbitusResponse, mapAbitusPersonToPerson } from '../../utils/abitus';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Buscando pessoa com ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'ID da pessoa é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar todas as pessoas da API externa para encontrar a pessoa específica
    const url = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=0&porPagina=1000';
    console.log('Fazendo request para:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erro na API externa:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Erro ao buscar dados da API externa' },
        { status: 500 }
      );
    }

    const data: AbitusResponse = await response.json();
    console.log('Dados recebidos da API externa:', data.content?.length || 0, 'pessoas');
    
    if (!data.content || data.content.length === 0) {
      console.log('Nenhum dado recebido da API externa');
      return NextResponse.json(
        { error: 'Nenhum dado disponível' },
        { status: 404 }
      );
    }
    
    // Mapear os dados da API para o formato da aplicação
    const mappedData = data.content.map(mapAbitusPersonToPerson);
    console.log('Dados mapeados:', mappedData.length, 'pessoas');
    
    // Encontrar a pessoa pelo ID
    const personId = parseInt(id);
    console.log('Procurando pessoa com ID:', personId);
    const person = mappedData.find((p: any) => p.id === personId);

    if (!person) {
      console.log('Pessoa não encontrada com ID:', personId);
      return NextResponse.json(
        { error: 'Pessoa não encontrada' },
        { status: 404 }
      );
    }

    console.log('Pessoa encontrada:', person.nome, 'Localizada:', person.localizado);
    return NextResponse.json({
      data: person
    });

  } catch (error) {
    console.error('Erro ao buscar pessoa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
