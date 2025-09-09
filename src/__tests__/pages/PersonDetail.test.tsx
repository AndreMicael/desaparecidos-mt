import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import PersonDetailPage from '@/app/desaparecidos/pessoa/[id]/page';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Mock do Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock dos componentes
jest.mock('@/components/UsefulActions', () => {
  return function MockUsefulActions({ person }: { person: any }) {
    return (
      <div data-testid="useful-actions">
        <button data-testid="share-button">Compartilhar</button>
        <button data-testid="copy-link-button">Copiar Link</button>
        <button data-testid="print-button">Imprimir</button>
      </div>
    );
  };
});

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockSearchParams = new URLSearchParams();

beforeEach(() => {
  jest.clearAllMocks();
  
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    back: mockBack,
  });
  
  (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
});

describe('PersonDetailPage', () => {
  it('should render loading state initially', () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    expect(screen.getByTestId('person-detail-skeleton')).toBeInTheDocument();
  });

  it('should render person details after loading', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('person-detail-skeleton')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('25 anos')).toBeInTheDocument();
    expect(screen.getByText('Masculino')).toBeInTheDocument();
  });

  it('should render correct status badge for missing person', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Desaparecido')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge')).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should render correct status badge for found person', async () => {
    render(<PersonDetailPage params={{ id: '2' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Localizado')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge')).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should render useful actions', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('useful-actions')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('share-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-link-button')).toBeInTheDocument();
    expect(screen.getByTestId('print-button')).toBeInTheDocument();
  });

  it('should handle back button click', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });
    
    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should preserve filters when going back', async () => {
    // Simular parâmetros de busca na URL
    mockSearchParams.set('nome', 'João');
    mockSearchParams.set('status', 'desaparecido');
    
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });
    
    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    
    // Verificar se os filtros foram preservados
    expect(mockPush).toHaveBeenCalledWith('/?nome=João&status=desaparecido');
  });

  it('should render error state on API error', async () => {
    server.use(
      http.get('http://localhost:3000/api/pessoas/1', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('person-error-state')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Erro ao carregar pessoa')).toBeInTheDocument();
  });

  it('should retry on error', async () => {
    server.use(
      http.get('http://localhost:3000/api/pessoas/1', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('person-error-state')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByText('Tentar Novamente');
    fireEvent.click(retryButton);
    
    expect(screen.getByTestId('person-detail-skeleton')).toBeInTheDocument();
  });

  it('should render empty state when person not found', async () => {
    server.use(
      http.get('http://localhost:3000/api/pessoas/999', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    render(<PersonDetailPage params={{ id: '999' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('person-empty-state')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Pessoa não encontrada')).toBeInTheDocument();
  });

  it('should render person photo with fallback', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('person-photo')).toBeInTheDocument();
    });
    
    const photo = screen.getByTestId('person-photo');
    expect(photo).toHaveAttribute('src', '/sem-foto.svg');
    expect(photo).toHaveAttribute('alt', 'Foto de João Silva');
  });

  it('should render contact information', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Contato')).toBeInTheDocument();
    });
    
    expect(screen.getByText('(65) 99999-9999')).toBeInTheDocument();
  });

  it('should render description', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Descrição')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Desaparecido desde 15/01/2024')).toBeInTheDocument();
  });

  it('should render location information', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Local de Desaparecimento')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Cuiabá, MT')).toBeInTheDocument();
  });

  it('should render date information', async () => {
    render(<PersonDetailPage params={{ id: '1' }} />);
    
    await waitFor(() => {
      expect(screen.getByText('Data de Desaparecimento')).toBeInTheDocument();
    });
    
    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
  });
});
