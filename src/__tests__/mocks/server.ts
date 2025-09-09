import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configurar servidor MSW para Node.js (testes)
export const server = setupServer(...handlers);
