import { render, screen, fireEvent } from '@testing-library/react';
import { 
  LoadingState, 
  EmptyState, 
  ErrorState, 
  PeopleListSkeleton, 
  PeopleEmptyState, 
  PeopleErrorState,
  PersonDetailSkeleton 
} from '@/components/ui/network-states';

describe('LoadingState', () => {
  it('should render with default message', () => {
    render(<LoadingState />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingState message="Carregando pessoas..." />);
    
    expect(screen.getByText('Carregando pessoas...')).toBeInTheDocument();
  });

  it('should render without spinner when showSpinner is false', () => {
    render(<LoadingState showSpinner={false} />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('should render with default content', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
    expect(screen.getByText('Não há dados para exibir no momento.')).toBeInTheDocument();
  });

  it('should render with custom content', () => {
    render(
      <EmptyState 
        title="Nenhuma pessoa encontrada"
        message="Não há pessoas para exibir."
      />
    );
    
    expect(screen.getByText('Nenhuma pessoa encontrada')).toBeInTheDocument();
    expect(screen.getByText('Não há pessoas para exibir.')).toBeInTheDocument();
  });

  it('should render with action button', () => {
    const mockAction = jest.fn();
    render(
      <EmptyState 
        action={{ label: 'Tentar Novamente', onClick: mockAction }}
      />
    );
    
    const button = screen.getByText('Tentar Novamente');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorState', () => {
  it('should render with default content', () => {
    render(<ErrorState />);
    
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Não foi possível carregar os dados. Tente novamente.')).toBeInTheDocument();
  });

  it('should render with custom content', () => {
    render(
      <ErrorState 
        title="Erro ao carregar"
        message="Falha na requisição."
      />
    );
    
    expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
    expect(screen.getByText('Falha na requisição.')).toBeInTheDocument();
  });

  it('should render with retry button', () => {
    const mockRetry = jest.fn();
    render(<ErrorState onRetry={mockRetry} />);
    
    const button = screen.getByText('Tentar Novamente');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should show offline message when offline', () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<ErrorState />);
    
    expect(screen.getByText('Sem conexão com a internet')).toBeInTheDocument();
    expect(screen.getByText('Verifique sua conexão com a internet e tente novamente.')).toBeInTheDocument();
  });

  it('should show network error message for network errors', () => {
    const networkError = { code: 'NETWORK_ERROR' };
    render(<ErrorState error={networkError} />);
    
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
  });

  it('should not show retry button when showRetry is false', () => {
    render(<ErrorState showRetry={false} />);
    
    expect(screen.queryByText('Tentar Novamente')).not.toBeInTheDocument();
  });
});

describe('PeopleListSkeleton', () => {
  it('should render with default count', () => {
    render(<PeopleListSkeleton />);
    
    // Verificar se há 8 skeletons (padrão)
    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons).toHaveLength(8);
  });

  it('should render with custom count', () => {
    render(<PeopleListSkeleton count={4} />);
    
    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons).toHaveLength(4);
  });

  it('should render skeleton cards with correct structure', () => {
    render(<PeopleListSkeleton count={1} />);
    
    const skeleton = screen.getByTestId('skeleton-card');
    expect(skeleton).toBeInTheDocument();
    
    // Verificar se tem a estrutura correta
    expect(skeleton.querySelector('.h-48')).toBeInTheDocument(); // Foto
    expect(skeleton.querySelector('.p-4')).toBeInTheDocument(); // Conteúdo
  });
});

describe('PeopleEmptyState', () => {
  it('should render with default content', () => {
    render(<PeopleEmptyState />);
    
    expect(screen.getByText('Nenhuma pessoa encontrada')).toBeInTheDocument();
    expect(screen.getByText('Não há pessoas desaparecidas ou localizadas para exibir no momento.')).toBeInTheDocument();
  });

  it('should render with retry action', () => {
    const mockRetry = jest.fn();
    render(<PeopleEmptyState onRetry={mockRetry} />);
    
    const button = screen.getByText('Atualizar');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<PeopleEmptyState />);
    
    expect(screen.queryByText('Atualizar')).not.toBeInTheDocument();
  });
});

describe('PeopleErrorState', () => {
  it('should render with default content', () => {
    render(<PeopleErrorState />);
    
    expect(screen.getByText('Erro ao carregar pessoas')).toBeInTheDocument();
    expect(screen.getByText('Não foi possível carregar a lista de pessoas. Verifique sua conexão e tente novamente.')).toBeInTheDocument();
  });

  it('should render with custom error', () => {
    const customError = { message: 'Erro personalizado' };
    render(<PeopleErrorState error={customError} />);
    
    expect(screen.getByText('Erro ao carregar pessoas')).toBeInTheDocument();
    expect(screen.getByText('Erro personalizado')).toBeInTheDocument();
  });

  it('should render with retry action', () => {
    const mockRetry = jest.fn();
    render(<PeopleErrorState onRetry={mockRetry} />);
    
    const button = screen.getByText('Tentar Novamente');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should show network error icon for network errors', () => {
    const networkError = { code: 'NETWORK_ERROR' };
    render(<PeopleErrorState error={networkError} />);
    
    // Verificar se tem o ícone de rede
    expect(screen.getByTestId('network-error-icon')).toBeInTheDocument();
  });

  it('should show offline icon when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    render(<PeopleErrorState />);
    
    expect(screen.getByTestId('offline-icon')).toBeInTheDocument();
  });
});

describe('PersonDetailSkeleton', () => {
  it('should render skeleton for person details', () => {
    render(<PersonDetailSkeleton />);
    
    // Verificar se tem a estrutura do skeleton
    expect(screen.getByTestId('person-detail-skeleton')).toBeInTheDocument();
    
    // Verificar elementos específicos
    expect(screen.getByTestId('photo-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('title-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('info-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('actions-skeleton')).toBeInTheDocument();
  });
});
