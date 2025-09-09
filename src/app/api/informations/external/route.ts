import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const personId = formData.get('personId') as string;
    const informantName = formData.get('informantName') as string;
    const informantPhone = formData.get('informantPhone') as string;
    const informantEmail = formData.get('informantEmail') as string;
    const sightingDate = formData.get('sightingDate') as string;
    const sightingLocation = formData.get('sightingLocation') as string;
    const description = formData.get('description') as string;
    const photos = formData.getAll('photos') as File[];

    // Validações básicas
    if (!personId || !sightingLocation || !description) {
      console.error('Validação falhou:', { personId, sightingLocation, description });
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Validar se personId é um número válido
    if (isNaN(parseInt(personId))) {
      console.error('personId não é um número válido:', personId);
      return NextResponse.json(
        { error: 'ID da pessoa deve ser um número válido' },
        { status: 400 }
      );
    }

    // Converter data do formato DD/MM/AAAA para yyyy-MM-dd
    let formattedDate = '';
    if (sightingDate) {
      const [day, month, year] = sightingDate.split('/');
      if (day && month && year) {
        formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    console.log('Data original:', sightingDate);
    console.log('Data formatada:', formattedDate);

    // Preparar dados para a API externa
    const externalData = {
      informacao: description, // Descrição detalhada do avistamento
      descricao: `Informação sobre ${informantName || 'Anônimo'} - ${sightingLocation}`, // Descrição do anexo
      data: formattedDate, // Data no formato yyyy-MM-dd
      ocold: parseInt(personId), // ID da ocorrência (usando personId)
    };
    
    // Buscar o ocoId real da pessoa na API externa
    let realOcoId = externalData.ocold; // Fallback para o personId
    
    try {
      // Buscar dados da pessoa para obter o ocoId real
      const pessoaResponse = await fetch(`${config.api.baseUrl}/pessoas/aberto/filtro?pagina=0&porPagina=1000`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (pessoaResponse.ok) {
        const pessoaData = await pessoaResponse.json();
        const pessoa = pessoaData.content?.find((p: any) => p.id === parseInt(personId));
        
        if (pessoa?.ultimaOcorrencia?.ocoId) {
          realOcoId = pessoa.ultimaOcorrencia.ocoId;
          console.log('ocoId real encontrado:', realOcoId, 'para pessoa ID:', personId);
        } else {
          console.log('ocoId não encontrado para pessoa ID:', personId, 'usando fallback:', realOcoId);
        }
      }
    } catch (error) {
      console.log('Erro ao buscar ocoId real, usando fallback:', realOcoId, error);
    }

    console.log('Dados sendo enviados para API externa:', externalData);
    console.log('URL da API externa:', `${config.api.baseUrl}/ocorrencias/informacoes-desaparecido`);

    // Preparar query parameters para a URL
    const queryParams = new URLSearchParams({
      informacao: externalData.informacao,
      descricao: externalData.descricao,
      data: externalData.data,
      ocoId: realOcoId.toString() // Usar ocoId real da pessoa
    });

    // Preparar FormData para a API externa
    const externalFormData = new FormData();
    
    // Adicionar arquivos apenas se existirem (conforme Swagger)
    if (photos && photos.length > 0) {
      photos.forEach((file: File) => {
        externalFormData.append('files', file);
      });
    }
    // Se não há arquivos, não adicionar o campo 'files' (conforme Swagger)

    console.log('Query params:', queryParams.toString());
    console.log('FormData preparado:', Object.fromEntries(externalFormData.entries()));
    console.log('URL completa:', `${config.api.baseUrl}/ocorrencias/informacoes-desaparecido?${queryParams.toString()}`);
    console.log('Arquivos sendo enviados:', photos.length > 0 ? `${photos.length} arquivo(s)` : 'Nenhum arquivo');

    // Tentar fazer requisição para a API externa
    let response;
    let useExternalAPI = true;
    
    try {
      response = await fetch(`${config.api.baseUrl}/ocorrencias/informacoes-desaparecido?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          // Headers de autenticação se necessário
          // 'Authorization': `Bearer SEU_TOKEN_AQUI`,
        },
        body: externalFormData,
        // Timeout de 10 segundos
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API externa:', errorText);
        
        // Tratamento específico para erro 404
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Ocorrência não encontrada. Verifique se o ID da pessoa está correto.' },
            { status: 404 }
          );
        }
        
        // Se erro 500 ou outros, usar fallback local
        useExternalAPI = false;
      }
    } catch (error) {
      console.error('Erro de conectividade com API externa:', error);
      useExternalAPI = false;
    }

    // Se API externa não funcionou, retornar erro
    if (!useExternalAPI) {
      console.log('API externa indisponível - retornando erro');
      
      return NextResponse.json({
        success: false,
        message: 'API externa não está disponível no momento. Tente novamente mais tarde.',
        error: 'Serviço temporariamente indisponível'
      }, { status: 503 });
    }

    // Se chegou aqui, API externa funcionou
    const result = await response!.json();

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Informações enviadas com sucesso para a API externa'
    });

  } catch (error) {
    console.error('Erro ao enviar informações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ocold = searchParams.get('ocold'); // ID da ocorrência

    if (!ocold) {
      return NextResponse.json(
        { error: 'ID da ocorrência (ocold) é obrigatório' },
        { status: 400 }
      );
    }

    // Fazer requisição para a API externa para buscar informações
    const response = await fetch(`${config.api.baseUrl}/ocorrencias/informacoes-desaparecido?ocold=${ocold}`, {
      method: 'GET',
      headers: {
        // Headers de autenticação se necessário
        // 'Authorization': `Bearer SEU_TOKEN_AQUI`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API externa:', errorText);
      return NextResponse.json(
        { error: 'Erro ao buscar informações da API externa' },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Informações buscadas com sucesso da API externa'
    });

  } catch (error) {
    console.error('Erro ao buscar informações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}