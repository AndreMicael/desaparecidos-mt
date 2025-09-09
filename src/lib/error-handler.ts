/**
 * Utilitários para tratamento de erros seguros
 * Remove informações sensíveis e stack traces das mensagens de erro
 */

interface SafeError {
  message: string;
  code?: string;
  status?: number;
  timestamp: string;
}

/**
 * Remove informações sensíveis de mensagens de erro
 * @param error - Erro original
 * @returns Erro limpo sem informações sensíveis
 */
export function sanitizeError(error: unknown): SafeError {
  const timestamp = new Date().toISOString();
  
  // Se for um erro conhecido, retornar mensagem limpa
  if (error instanceof Error) {
    // Remover stack trace e URLs internas
    let cleanMessage = error.message;
    
    // Remover URLs internas
    cleanMessage = cleanMessage.replace(/https?:\/\/[^\s]+/g, '[URL_REMOVED]');
    
    // Remover caminhos de arquivo
    cleanMessage = cleanMessage.replace(/\/[^\s]*\.(js|ts|tsx|jsx)/g, '[FILE_PATH_REMOVED]');
    
    // Remover stack traces
    cleanMessage = cleanMessage.replace(/\s+at\s+.*/g, '');
    
    // Remover informações de linha/coluna
    cleanMessage = cleanMessage.replace(/:\d+:\d+/g, '');
    
    // Mensagens de erro comuns e suas versões limpas
    const errorMappings: Record<string, string> = {
      'Network Error': 'Erro de conexão. Verifique sua internet e tente novamente.',
      'Failed to fetch': 'Não foi possível conectar ao servidor. Tente novamente.',
      'Request timeout': 'A requisição demorou muito para responder. Tente novamente.',
      'Unauthorized': 'Você não tem permissão para realizar esta ação.',
      'Forbidden': 'Acesso negado.',
      'Not Found': 'Recurso não encontrado.',
      'Internal Server Error': 'Erro interno do servidor. Tente novamente mais tarde.',
      'Bad Request': 'Dados inválidos fornecidos.',
      'Validation Error': 'Dados fornecidos são inválidos.',
      'Database Error': 'Erro no banco de dados. Tente novamente.',
      'File Upload Error': 'Erro ao fazer upload do arquivo.',
      'Authentication Error': 'Erro de autenticação.',
      'Permission Denied': 'Permissão negada.',
    };
    
    // Aplicar mapeamento de erros
    for (const [key, value] of Object.entries(errorMappings)) {
      if (cleanMessage.includes(key)) {
        cleanMessage = value;
        break;
      }
    }
    
    return {
      message: cleanMessage,
      code: getErrorCode(error),
      status: getErrorStatus(error),
      timestamp,
    };
  }
  
  // Se for uma string, limpar e retornar
  if (typeof error === 'string') {
    return {
      message: sanitizeString(error),
      timestamp,
    };
  }
  
  // Erro desconhecido
  return {
    message: 'Ocorreu um erro inesperado. Tente novamente.',
    timestamp,
  };
}

/**
 * Extrai código de erro se disponível
 */
function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object') {
    const err = error as any;
    return err.code || err.errorCode || err.statusCode;
  }
  return undefined;
}

/**
 * Extrai status HTTP se disponível
 */
function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const err = error as any;
    return err.status || err.statusCode || err.httpStatus;
  }
  return undefined;
}

/**
 * Remove informações sensíveis de strings
 */
function sanitizeString(str: string): string {
  return str
    .replace(/https?:\/\/[^\s]+/g, '[URL_REMOVED]')
    .replace(/\/[^\s]*\.(js|ts|tsx|jsx)/g, '[FILE_PATH_REMOVED]')
    .replace(/\s+at\s+.*/g, '')
    .replace(/:\d+:\d+/g, '')
    .replace(/password[=:]\s*\S+/gi, 'password=[REMOVED]')
    .replace(/token[=:]\s*\S+/gi, 'token=[REMOVED]')
    .replace(/key[=:]\s*\S+/gi, 'key=[REMOVED]')
    .replace(/secret[=:]\s*\S+/gi, 'secret=[REMOVED]');
}

/**
 * Logs de erro seguros para desenvolvimento
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'ERROR'}]`, error);
  } else {
    // Em produção, log apenas informações seguras
    const safeError = sanitizeError(error);
    console.error(`[${context || 'ERROR'}]`, safeError);
  }
}

/**
 * Cria mensagens de erro amigáveis para o usuário
 */
export function createUserFriendlyError(error: unknown): string {
  const safeError = sanitizeError(error);
  
  // Mensagens específicas baseadas no código de erro
  switch (safeError.code) {
    case 'NETWORK_ERROR':
      return 'Problema de conexão. Verifique sua internet e tente novamente.';
    case 'TIMEOUT':
      return 'A operação demorou muito para responder. Tente novamente.';
    case 'UNAUTHORIZED':
      return 'Você precisa fazer login para continuar.';
    case 'FORBIDDEN':
      return 'Você não tem permissão para realizar esta ação.';
    case 'NOT_FOUND':
      return 'O recurso solicitado não foi encontrado.';
    case 'VALIDATION_ERROR':
      return 'Os dados fornecidos são inválidos. Verifique e tente novamente.';
    case 'FILE_TOO_LARGE':
      return 'O arquivo é muito grande. Tente um arquivo menor.';
    case 'INVALID_FILE_TYPE':
      return 'Tipo de arquivo não permitido.';
    default:
      return safeError.message;
  }
}

/**
 * Hook para tratamento de erros em componentes React
 */
export function useErrorHandler() {
  const handleError = (error: unknown, context?: string) => {
    logError(error, context);
    return createUserFriendlyError(error);
  };
  
  return { handleError };
}

/**
 * Wrapper para funções assíncronas com tratamento de erro
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> {
  try {
    return await asyncFn();
  } catch (error) {
    logError(error, context);
    return fallback;
  }
}

/**
 * Validação de entrada para prevenir ataques
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '');
}

/**
 * Validação de email segura
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validação de telefone segura
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\(\)\-\+]{10,15}$/;
  return phoneRegex.test(phone);
}
