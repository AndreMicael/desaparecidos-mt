/**
 * Cliente HTTP com interceptors, timeout e cancelamento de requests
 */

import { config } from './config';
import { sanitizeError, createUserFriendlyError } from './error-handler';

export class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions {
  timeout?: number;
  signal?: AbortSignal;
  retries?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.defaultTimeout = config.api.timeout;
  }

  /**
   * Mapeia códigos de erro HTTP para mensagens amigáveis
   */
  private mapErrorToMessage(status: number, error?: any): string {
    switch (status) {
      case 400:
        return 'Dados inválidos enviados. Verifique as informações e tente novamente.';
      case 401:
        return 'Não autorizado. Verifique suas credenciais.';
      case 403:
        return 'Acesso negado. Você não tem permissão para esta ação.';
      case 404:
        return 'Recurso não encontrado. Verifique se a URL está correta.';
      case 408:
        return 'Tempo limite excedido. Tente novamente em alguns instantes.';
      case 429:
        return 'Muitas requisições. Aguarde um momento antes de tentar novamente.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      case 502:
        return 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.';
      case 503:
        return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      case 504:
        return 'Tempo limite do servidor. Tente novamente em alguns instantes.';
      default:
        if (status >= 400 && status < 500) {
          return 'Erro na requisição. Verifique os dados enviados.';
        } else if (status >= 500) {
          return 'Erro no servidor. Tente novamente mais tarde.';
        }
        return 'Erro desconhecido. Tente novamente.';
    }
  }

  /**
   * Cria um AbortController com timeout
   */
  private createAbortController(timeout: number): AbortController {
    const controller = new AbortController();
    
    setTimeout(() => {
      controller.abort();
    }, timeout);

    return controller;
  }

  /**
   * Executa uma requisição com retry automático
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    retries: number = config.api.retryAttempts
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        // Não fazer retry para erros 4xx (exceto 408, 429)
        if (error instanceof ApiError && error.status) {
          if (error.status >= 400 && error.status < 500 && 
              error.status !== 408 && error.status !== 429) {
            throw error;
          }
        }

        // Não fazer retry na última tentativa
        if (attempt === retries) {
          const safeError = sanitizeError(error);
          throw new ApiError(
            createUserFriendlyError(error),
            safeError.status,
            safeError.code
          );
        }

        // Aguardar antes da próxima tentativa
        await new Promise(resolve => 
          setTimeout(resolve, config.api.retryDelay * (attempt + 1))
        );
      }
    }

    throw lastError!;
  }

  /**
   * Executa uma requisição GET
   */
  async get<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, signal, retries = config.api.retryAttempts } = options;
    
    return this.executeWithRetry(async () => {
      const controller = this.createAbortController(timeout);
      const finalSignal = signal || controller.signal;

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: finalSignal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            this.mapErrorToMessage(response.status, errorData),
            response.status,
            errorData.code || 'HTTP_ERROR',
            errorData
          );
        }

        return await response.json();
      } catch (error: any) {
        if (error instanceof ApiError) {
          throw error;  
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiError('Requisição cancelada ou tempo limite excedido.', undefined, 'TIMEOUT');
          }
          
          // Sanitizar erro antes de lançar
          const safeError = sanitizeError(error);
          throw new ApiError(
            createUserFriendlyError(error),
            safeError.status,
            safeError.code
          );
        }

        throw new ApiError('Erro inesperado. Tente novamente.', undefined, 'UNKNOWN_ERROR');
      }
    }, retries);
  }

  /**
   * Executa uma requisição POST
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, signal, retries = config.api.retryAttempts } = options;
    
    return this.executeWithRetry(async () => {
      const controller = this.createAbortController(timeout);
      const finalSignal = signal || controller.signal;

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: finalSignal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            this.mapErrorToMessage(response.status, errorData),
            response.status,
            errorData.code || 'HTTP_ERROR',
            errorData
          );
        }

        return await response.json();
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiError('Requisição cancelada ou tempo limite excedido.', undefined, 'TIMEOUT');
          }
          
          // Sanitizar erro antes de lançar
          const safeError = sanitizeError(error);
          throw new ApiError(
            createUserFriendlyError(error),
            safeError.status,
            safeError.code
          );
        }

        throw new ApiError('Erro inesperado. Tente novamente.', undefined, 'UNKNOWN_ERROR');
      }
    }, retries);
  }

  /**
   * Executa uma requisição POST com FormData
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, signal, retries = config.api.retryAttempts } = options;
    
    return this.executeWithRetry(async () => {
      const controller = this.createAbortController(timeout);
      const finalSignal = signal || controller.signal;

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          body: formData,
          signal: finalSignal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            this.mapErrorToMessage(response.status, errorData),
            response.status,
            errorData.code || 'HTTP_ERROR',
            errorData
          );
        }

        return await response.json();
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiError('Requisição cancelada ou tempo limite excedido.', undefined, 'TIMEOUT');
          }
          
          // Sanitizar erro antes de lançar
          const safeError = sanitizeError(error);
          throw new ApiError(
            createUserFriendlyError(error),
            safeError.status,
            safeError.code
          );
        }

        throw new ApiError('Erro inesperado. Tente novamente.', undefined, 'UNKNOWN_ERROR');
      }
    }, retries);
  }
}

// Instância singleton do cliente
export const apiClient = new ApiClient();

// Hook para criar AbortController
export function useAbortController() {
  return new AbortController();
}
