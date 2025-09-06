import { NextRequest, NextResponse } from 'next/server';

// URL da API externa
const EXTERNAL_API_URL = 'https://abitus-api.geia.vip/v1';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { archived } = await request.json();
    const informationId = params.id;

    if (typeof archived !== 'boolean') {
      return NextResponse.json(
        { error: 'Campo archived deve ser um boolean' },
        { status: 400 }
      );
    }

    // Preparar FormData para arquivar/desarquivar
    const formData = new FormData();
    formData.append('archived', archived.toString());

    // Fazer requisição para a API externa para arquivar/desarquivar
    const response = await fetch(`${EXTERNAL_API_URL}/ocorrencias/informacoes-desaparecido/${informationId}/archive`, {
      method: 'PATCH',
      headers: {
        // Headers de autenticação se necessário
        // 'Authorization': `Bearer SEU_TOKEN_AQUI`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API externa:', errorText);
      return NextResponse.json(
        { error: 'Erro ao arquivar informação na API externa' },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result,
      message: archived ? 'Informação arquivada' : 'Informação desarquivada'
    });

  } catch (error) {
    console.error('Erro ao arquivar informação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
