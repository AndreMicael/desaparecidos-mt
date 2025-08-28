import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      personId,
      informantName,
      informantPhone,
      informantEmail,
      sightingDate,
      sightingLocation,
      description,
      photos
    } = body;

    // Validações básicas
    if (!personId || !informantName || !sightingLocation || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Converter data se fornecida
    let parsedSightingDate = null;
    if (sightingDate) {
      const [day, month, year] = sightingDate.split('/');
      if (day && month && year) {
        parsedSightingDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }

    // Salvar no banco de dados
    const information = await prisma.information.create({
      data: {
        personId,
        informantName,
        informantPhone: informantPhone || null,
        informantEmail: informantEmail || null,
        sightingDate: parsedSightingDate,
        sightingLocation,
        description,
        photos: photos || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: information,
      message: 'Informações registradas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao salvar informações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');

    if (!personId) {
      return NextResponse.json(
        { error: 'ID da pessoa é obrigatório' },
        { status: 400 }
      );
    }

    const informations = await prisma.information.findMany({
      where: {
        personId: personId
      },
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
