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
      // Se a API externa falhar, retornar dados mockados como fallback
      const mockPerson = {
        id: parseInt(id),
        nome: `Pessoa ${id}`,
        idade: 25,
        sexo: 'masculino' as const,
        localizado: false,
        foto: '',
        dtDesaparecimento: '2024-01-01',
        localDesaparecimentoConcat: 'Cuiabá, MT',
        ultimaOcorrencia: 'Informação adicional',
        dtNascimento: '1999-01-01'
      };
      
      console.log('API externa falhou, retornando dados mockados');
      return NextResponse.json({
        data: mockPerson
      });
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

    console.log('Pessoa encontrada:', person.nome);
    return NextResponse.json({
      data: person
    });

  } catch (error) {
    console.error('Erro ao buscar pessoa:', error);
    // Em caso de erro, retornar dados mockados como fallback
    const { id: errorId } = await params;
    const mockPerson = {
      id: parseInt(errorId || '1'),
      nome: `Pessoa ${errorId || '1'}`,
      idade: 25,
      sexo: 'masculino' as const,
      localizado: false,
      foto: '',
      dtDesaparecimento: '2024-01-01',
      localDesaparecimentoConcat: 'Cuiabá, MT',
      ultimaOcorrencia: 'Informação adicional',
      dtNascimento: '1999-01-01'
    };
    
    return NextResponse.json({
      data: mockPerson
    });
  }
}
