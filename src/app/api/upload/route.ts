import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma foto enviada' },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];

    // Criar diretório se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'infos');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Diretório já existe, ignorar erro
    }

    for (const file of files) {
      if (file.size === 0) continue;

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = path.extname(file.name);
      const filename = `${timestamp}-${randomSuffix}${extension}`;

      // Converter para buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Salvar arquivo
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      // Adicionar URL público à lista
      uploadedFiles.push(`/infos/${filename}`);
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} foto(s) enviada(s) com sucesso`
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor durante upload' },
      { status: 500 }
    );
  }
}
