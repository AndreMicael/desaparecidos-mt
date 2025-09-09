#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Executando testes com cobertura...\n');

try {
  // Executar testes com cobertura
  execSync('npm test -- --coverage --watchAll=false', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Verificar se o arquivo de cobertura foi gerado
  const coveragePath = path.join(process.cwd(), 'coverage', 'lcov-report', 'index.html');
  
  if (fs.existsSync(coveragePath)) {
    console.log('\n✅ Relatório de cobertura gerado em:', coveragePath);
    console.log('📊 Abra o arquivo no navegador para ver os detalhes da cobertura.');
  } else {
    console.log('\n⚠️  Relatório de cobertura não encontrado.');
  }

  // Verificar se a cobertura mínima foi atingida
  const coverageSummaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  
  if (fs.existsSync(coverageSummaryPath)) {
    const coverage = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
    const global = coverage.total;
    
    console.log('\n📈 Cobertura Global:');
    console.log(`  Branches: ${global.branches.pct}% (mínimo: 70%)`);
    console.log(`  Functions: ${global.functions.pct}% (mínimo: 70%)`);
    console.log(`  Lines: ${global.lines.pct}% (mínimo: 70%)`);
    console.log(`  Statements: ${global.statements.pct}% (mínimo: 70%)`);
    
    const thresholds = {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    };
    
    const passed = Object.keys(thresholds).every(key => 
      global[key].pct >= thresholds[key]
    );
    
    if (passed) {
      console.log('\n🎉 Parabéns! Cobertura mínima de 70% atingida em todas as métricas!');
    } else {
      console.log('\n❌ Cobertura mínima não atingida. Verifique os arquivos com baixa cobertura.');
      process.exit(1);
    }
  }

} catch (error) {
  console.error('\n❌ Erro ao executar testes:', error.message);
  process.exit(1);
}
