const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tamanhos de ícones necessários
const sizes = [
  { name: 'icon-16x16.png', size: 16 },
  { name: 'icon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 }
];

async function generateFavicons() {
  const publicDir = path.join(__dirname, '../public');
  const faviconPath = path.join(publicDir, 'favicon.ico');

  // Verificar se o favicon.ico existe
  if (!fs.existsSync(faviconPath)) {
    console.error('❌ favicon.ico não encontrado em public/');
    return;
  }

  console.log('🔄 Gerando favicons...');

  try {
    for (const { name, size } of sizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(faviconPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${name} (${size}x${size}) gerado`);
    }

    console.log('🎉 Todos os favicons foram gerados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar favicons:', error);
  }
}

generateFavicons();
