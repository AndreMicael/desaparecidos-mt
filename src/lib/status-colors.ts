/**
 * Constantes para cores de status de pessoas desaparecidas/localizadas
 * Garante consistência visual em todo o projeto
 */

export const STATUS_COLORS = {
  // Cores para pessoas DESAPARECIDAS
  DESAPARECIDO: {
    primary: 'bg-red-800',
    hover: 'hover:bg-red-700',
    text: 'text-white',
    border: 'border-red-800',
    variant: 'destructive' as const,
    label: 'Desaparecido'
  },
  
  // Cores para pessoas LOCALIZADAS
  LOCALIZADO: {
    primary: 'bg-emerald-700',
    hover: 'hover:bg-emerald-600', 
    text: 'text-white',
    border: 'border-emerald-700',
    variant: 'default' as const,
    label: 'Localizado'
  }
} as const;

/**
 * Função utilitária para obter as cores corretas baseadas no status
 */
export function getStatusColors(isLocalizado: boolean) {
  return isLocalizado ? STATUS_COLORS.LOCALIZADO : STATUS_COLORS.DESAPARECIDO;
}

/**
 * Classes CSS completas para badges de status
 */
export function getStatusBadgeClasses(isLocalizado: boolean): string {
  const colors = getStatusColors(isLocalizado);
  return `${colors.primary} ${colors.text} ${colors.hover} border-none font-medium text-xs rounded-sm`;
}

/**
 * Classes CSS para badges simples (sem hover)
 */
export function getSimpleStatusBadgeClasses(isLocalizado: boolean): string {
  const colors = getStatusColors(isLocalizado);
  return `${colors.primary} ${colors.text} px-3 py-1 text-xs sm:text-sm font-medium rounded-sm uppercase tracking-wide`;
}
