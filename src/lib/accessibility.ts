// Utilitários de acessibilidade

// Cores com contraste adequado (WCAG AA)
export const accessibleColors = {
  // Texto escuro em fundo claro
  text: {
    primary: 'text-gray-900', // #111827 - contraste 16.74:1
    secondary: 'text-gray-700', // #374151 - contraste 7.13:1
    muted: 'text-gray-600', // #4B5563 - contraste 4.52:1
  },
  
  // Texto claro em fundo escuro
  textDark: {
    primary: 'text-white', // #FFFFFF - contraste 21:1
    secondary: 'text-gray-200', // #E5E7EB - contraste 12.63:1
    muted: 'text-gray-300', // #D1D5DB - contraste 9.05:1
  },
  
  // Fundos
  background: {
    primary: 'bg-white', // #FFFFFF
    secondary: 'bg-gray-50', // #F9FAFB
    accent: 'bg-yellow-50', // #FEFCE8
    dark: 'bg-gray-900', // #111827
  },
  
  // Bordas com contraste adequado
  border: {
    primary: 'border-gray-300', // #D1D5DB - contraste 3.02:1
    secondary: 'border-gray-200', // #E5E7EB - contraste 1.42:1
    accent: 'border-yellow-400', // #FACC15 - contraste 3.02:1
    focus: 'border-blue-500', // #3B82F6 - contraste 4.52:1
  },
  
  // Estados de foco
  focus: {
    ring: 'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    outline: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    border: 'focus:border-blue-500',
  },
  
  // Estados de hover
  hover: {
    primary: 'hover:bg-gray-100',
    secondary: 'hover:bg-gray-200',
    accent: 'hover:bg-yellow-100',
  },
}

// Verificar contraste de cores
export function getContrastRatio(color1: string, color2: string): number {
  // Implementação simplificada - em produção, use uma biblioteca como color-contrast
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Verificar se o contraste atende aos padrões WCAG
export function isAccessibleContrast(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

// Classes CSS para diferentes níveis de contraste
export const contrastLevels = {
  // WCAG AA - Contraste normal
  normal: {
    large: 3, // Texto grande (18pt+ ou 14pt+ bold)
    regular: 4.5, // Texto normal
  },
  // WCAG AAA - Contraste aprimorado
  enhanced: {
    large: 4.5, // Texto grande
    regular: 7, // Texto normal
  }
};

// Utilitários para navegação por teclado
export const keyboardNavigation = {
  // Tab order
  tabIndex: {
    focusable: 'tabindex="0"',
    notFocusable: 'tabindex="-1"',
    first: 'tabindex="0"',
    last: 'tabindex="0"',
  },
  
  // ARIA labels
  aria: {
    hidden: 'aria-hidden="true"',
    expanded: (expanded: boolean) => `aria-expanded="${expanded}"`,
    selected: (selected: boolean) => `aria-selected="${selected}"`,
    checked: (checked: boolean) => `aria-checked="${checked}"`,
    disabled: (disabled: boolean) => `aria-disabled="${disabled}"`,
  },
  
  // Roles
  roles: {
    button: 'role="button"',
    link: 'role="link"',
    navigation: 'role="navigation"',
    main: 'role="main"',
    banner: 'role="banner"',
    contentinfo: 'role="contentinfo"',
    complementary: 'role="complementary"',
    search: 'role="search"',
    form: 'role="form"',
    dialog: 'role="dialog"',
    alert: 'role="alert"',
    status: 'role="status"',
  }
};

// Utilitários para screen readers
export const screenReader = {
  // Texto apenas para screen readers
  only: 'sr-only',
  
  // Texto que deve ser lido por screen readers
  announce: 'aria-live="polite"',
  announceUrgent: 'aria-live="assertive"',
  
  // Descrever elementos
  describe: (id: string) => `aria-describedby="${id}"`,
  label: (id: string) => `aria-labelledby="${id}"`,
  
  // Ocultar elementos decorativos
  hide: 'aria-hidden="true"',
  
  // Indicar estado
  busy: 'aria-busy="true"',
  atomic: 'aria-atomic="true"',
};

// Utilitários para formulários acessíveis
export const formAccessibility = {
  // Labels obrigatórios
  required: 'aria-required="true"',
  
  // Validação
  invalid: 'aria-invalid="true"',
  valid: 'aria-invalid="false"',
  
  // Descrever campos
  describe: (id: string) => `aria-describedby="${id}"`,
  
  // Agrupar campos relacionados
  group: (id: string) => `role="group" aria-labelledby="${id}"`,
  
  // Indicar erros
  error: (id: string) => `aria-describedby="${id}" aria-invalid="true"`,
};

// Utilitários para navegação
export const navigation = {
  // Skip links
  skipToContent: 'Pular para o conteúdo principal',
  skipToNavigation: 'Pular para a navegação',
  skipToSearch: 'Pular para a busca',
  
  // Navegação
  main: 'Navegação principal',
  breadcrumb: 'Navegação estrutural',
  pagination: 'Navegação de páginas',
  
  // Ações
  search: 'Buscar',
  filter: 'Filtrar',
  sort: 'Ordenar',
  clear: 'Limpar',
  close: 'Fechar',
  open: 'Abrir',
  expand: 'Expandir',
  collapse: 'Recolher',
};
