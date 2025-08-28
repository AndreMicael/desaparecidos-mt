import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

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

    const information = await prisma.information.update({
      where: {
        id: informationId
      },
      data: {
        archived,
        archivedAt: archived ? new Date() : null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: information,
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
