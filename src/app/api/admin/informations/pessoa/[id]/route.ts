import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://abitus-api.geia.vip/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const personId = params.id;
    console.log('Buscando informações para pessoa ID:', personId);

    // Primeiro, buscar a pessoa para obter o ocoId
    const pessoaResponse = await fetch(`${EXTERNAL_API_URL}/pessoas/aberto/filtro?pagina=0&porPagina=1000`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });

    if (!pessoaResponse.ok) {
      throw new Error(`Erro ao buscar pessoa: ${pessoaResponse.status}`);
    }

    const pessoaData = await pessoaResponse.json();
    const pessoa = pessoaData.content?.find((p: any) => p.id === parseInt(personId));

    if (!pessoa) {
      return NextResponse.json({ 
        success: false, 
        message: 'Pessoa não encontrada',
        data: [] 
      });
    }

    const ocoId = pessoa.ultimaOcorrencia?.ocoId;
    
    if (!ocoId) {
      console.log('Pessoa encontrada mas sem ocoId:', pessoa.nome);
      return NextResponse.json({ 
        success: true, 
        message: 'Pessoa encontrada mas sem ocorrência ativa',
        data: [] 
      });
    }

    console.log('Pessoa encontrada:', pessoa.nome, 'com ocoId:', ocoId);
    console.log('Buscando informações para ocoId:', ocoId);

    // Buscar informações específicas desta ocorrência
    const infoResponse = await fetch(`${EXTERNAL_API_URL}/ocorrencias/informacoes-desaparecido?ocorrenciaId=${ocoId}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });

    if (!infoResponse.ok) {
      console.log('Nenhuma informação encontrada para ocoId:', ocoId);
      return NextResponse.json({ 
        success: true, 
        message: 'Nenhuma informação encontrada para esta pessoa',
        data: [] 
      });
    }

    const infoData = await infoResponse.json();
    
    if (!infoData || !Array.isArray(infoData)) {
      return NextResponse.json({ 
        success: true, 
        message: 'Nenhuma informação encontrada',
        data: [] 
      });
    }

    // Adicionar o ocoId a cada informação
    const informationsWithOcoId = infoData.map((info: any) => ({ 
      ...info, 
      ocoId: ocoId,
      personId: personId 
    }));

    console.log('Informações encontradas:', informationsWithOcoId.length, 'para pessoa ID:', personId);

    return NextResponse.json({ 
      success: true, 
      data: informationsWithOcoId,
      message: `Informações encontradas para ${pessoa.nome} (${informationsWithOcoId.length} registros)`
    });

  } catch (error) {
    console.error('Erro ao buscar informações da pessoa:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
