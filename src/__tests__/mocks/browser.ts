import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar worker MSW para browser (desenvolvimento)
export const worker = setupWorker(...handlers);
