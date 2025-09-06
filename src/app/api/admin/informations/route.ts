import { NextRequest, NextResponse } from 'next/server';

// URL da API externa
const EXTERNAL_API_URL = 'https://abitus-api.geia.vip/v1';

export async function GET(request: NextRequest) {
  try {
    console.log('Buscando informações da API externa...');
    
    // Primeiro, buscar todas as pessoas para obter os ocoIds
    const pessoasResponse = await fetch(`${EXTERNAL_API_URL}/pessoas/aberto/filtro?pagina=0&porPagina=1000`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!pessoasResponse.ok) {
      throw new Error(`Erro ao buscar pessoas: ${pessoasResponse.status}`);
    }

    const pessoasData = await pessoasResponse.json();
    console.log('Pessoas encontradas:', pessoasData.content?.length || 0);

    // Coletar todos os ocoIds únicos
    const ocoIds = new Set<number>();
    pessoasData.content?.forEach((pessoa: any) => {
      if (pessoa.ultimaOcorrencia?.ocoId) {
        ocoIds.add(pessoa.ultimaOcorrencia.ocoId);
      }
    });

    console.log('ocoIds únicos encontrados:', ocoIds.size);

    // Buscar informações para cada ocoId
    const allInformations: any[] = [];
    
    for (const ocoId of Array.from(ocoIds)) {
      try {
        console.log(`Buscando informações para ocoId: ${ocoId}`);
        
        const infoResponse = await fetch(`${EXTERNAL_API_URL}/ocorrencias/informacoes-desaparecido?ocold=${ocoId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (infoResponse.ok) {
          const infoData = await infoResponse.json();
          if (infoData && Array.isArray(infoData)) {
            // Adicionar ocoId a cada informação
            const infoWithOcoId = infoData.map((info: any) => ({
              ...info,
              ocoId: ocoId
            }));
            allInformations.push(...infoWithOcoId);
          }
        } else {
          console.log(`Nenhuma informação encontrada para ocoId: ${ocoId}`);
        }
      } catch (error) {
        console.log(`Erro ao buscar informações para ocoId ${ocoId}:`, error);
      }
    }

    console.log('Total de informações coletadas:', allInformations.length);

    return NextResponse.json({
      success: true,
      data: allInformations,
      message: `Informações buscadas com sucesso da API externa (${allInformations.length} registros)`
    });

  } catch (error) {
    console.error('Erro ao buscar informações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
