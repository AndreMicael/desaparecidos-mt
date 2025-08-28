import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Aqui você pode adicionar verificação de autenticação se necessário
    // Por enquanto, vamos permitir acesso direto para fins didáticos

    const informations = await prisma.information.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: informations
    });

  } catch (error) {
    console.error('Erro ao buscar informações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
