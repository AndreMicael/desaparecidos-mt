import { NextRequest, NextResponse } from 'next/server';
import { Person, loadAllPersons } from '../../utils/abitus';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    // Carregar todos os dados
    const allPersons = await loadAllPersons();
    
    // Buscar pessoa por ID
    const person = allPersons.find(p => p.id.toString() === id);
    
    if (!person) {
      return NextResponse.json(
        { error: 'Pessoa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(person);
  } catch (error) {
    console.error('Erro ao buscar pessoa por ID:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
