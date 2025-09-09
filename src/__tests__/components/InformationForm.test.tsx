import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InformationForm from '@/components/InformationForm';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Mock do toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock do navigator.geolocation
const mockGetCurrentPosition = jest.fn();
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: mockGetCurrentPosition,
  },
  writable: true,
});

// Mock do fetch para reverse geocoding
global.fetch = jest.fn();

describe('InformationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentPosition.mockClear();
  });

  it('should render form fields', () => {
    render(<InformationForm />);
    
    expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Idade')).toBeInTheDocument();
    expect(screen.getByLabelText('Sexo')).toBeInTheDocument();
    expect(screen.getByLabelText('Data de Desaparecimento')).toBeInTheDocument();
    expect(screen.getByLabelText('Local de Desaparecimento')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
    expect(screen.getByLabelText('Contato')).toBeInTheDocument();
  });

  it('should apply phone mask to contact field', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const contactInput = screen.getByLabelText('Contato');
    await user.type(contactInput, '65999999999');
    
    expect(contactInput).toHaveValue('(65) 99999-9999');
  });

  it('should apply date mask to date field', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const dateInput = screen.getByLabelText('Data de Desaparecimento');
    await user.type(dateInput, '15012024');
    
    expect(dateInput).toHaveValue('15/01/2024');
  });

  it('should handle geolocation button click', async () => {
    const user = userEvent.setup();
    
    // Mock successful geolocation
    mockGetCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -15.7801,
          longitude: -47.9292,
        },
      });
    });
    
    // Mock reverse geocoding response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        city: 'Cuiabá',
        principalSubdivision: 'MT',
        countryName: 'Brasil',
      }),
    });
    
    render(<InformationForm />);
    
    const geolocationButton = screen.getByText('Usar minha localização');
    await user.click(geolocationButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Local de Desaparecimento')).toHaveValue('Cuiabá, MT, Brasil');
    });
  });

  it('should handle geolocation error', async () => {
    const user = userEvent.setup();
    
    // Mock geolocation error
    mockGetCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1, // PERMISSION_DENIED
        message: 'Permission denied',
      });
    });
    
    render(<InformationForm />);
    
    const geolocationButton = screen.getByText('Usar minha localização');
    await user.click(geolocationButton);
    
    await waitFor(() => {
      expect(screen.getByText('Permissão de localização negada. Preencha manualmente.')).toBeInTheDocument();
    });
  });

  it('should handle geolocation timeout', async () => {
    const user = userEvent.setup();
    
    // Mock geolocation timeout
    mockGetCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 3, // TIMEOUT
        message: 'Timeout',
      });
    });
    
    render(<InformationForm />);
    
    const geolocationButton = screen.getByText('Usar minha localização');
    await user.click(geolocationButton);
    
    await waitFor(() => {
      expect(screen.getByText('Tempo limite excedido. Preencha manualmente.')).toBeInTheDocument();
    });
  });

  it('should handle file upload with valid image', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Adicionar Fotos');
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText('Foto adicionada com sucesso!')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('photo-preview')).toBeInTheDocument();
  });

  it('should reject invalid file type', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText('Adicionar Fotos');
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText('Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.')).toBeInTheDocument();
    });
  });

  it('should reject file that is too large', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    // Criar um arquivo maior que 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Adicionar Fotos');
    
    await user.upload(fileInput, largeFile);
    
    await waitFor(() => {
      expect(screen.getByText('Arquivo muito grande. Máximo 5MB por arquivo.')).toBeInTheDocument();
    });
  });

  it('should reject when maximum files exceeded', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const fileInput = screen.getByLabelText('Adicionar Fotos');
    
    // Adicionar 5 fotos
    for (let i = 0; i < 5; i++) {
      const file = new File(['test'], `test${i}.jpg`, { type: 'image/jpeg' });
      await user.upload(fileInput, file);
    }
    
    // Tentar adicionar mais uma
    const extraFile = new File(['test'], 'extra.jpg', { type: 'image/jpeg' });
    await user.upload(fileInput, extraFile);
    
    await waitFor(() => {
      expect(screen.getByText('Máximo 5 fotos permitidas.')).toBeInTheDocument();
    });
  });

  it('should remove photo when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Adicionar Fotos');
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByTestId('photo-preview')).toBeInTheDocument();
    });
    
    const removeButton = screen.getByTestId('remove-photo');
    await user.click(removeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Foto removida com sucesso!')).toBeInTheDocument();
    });
    
    expect(screen.queryByTestId('photo-preview')).not.toBeInTheDocument();
  });

  it('should submit form successfully', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    // Preencher formulário
    await user.type(screen.getByLabelText('Nome Completo'), 'João Silva');
    await user.type(screen.getByLabelText('Idade'), '25');
    await user.selectOptions(screen.getByLabelText('Sexo'), 'M');
    await user.type(screen.getByLabelText('Data de Desaparecimento'), '15/01/2024');
    await user.type(screen.getByLabelText('Local de Desaparecimento'), 'Cuiabá, MT');
    await user.type(screen.getByLabelText('Descrição'), 'Desaparecido desde 15/01/2024');
    await user.type(screen.getByLabelText('Contato'), '(65) 99999-9999');
    
    // Submeter formulário
    const submitButton = screen.getByText('Enviar Informação');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Informação enviada com sucesso!')).toBeInTheDocument();
    });
  });

  it('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const submitButton = screen.getByText('Enviar Informação');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Idade é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Sexo é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Data de desaparecimento é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Local de desaparecimento é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Contato é obrigatório')).toBeInTheDocument();
    });
  });

  it('should disable submit button during upload', async () => {
    const user = userEvent.setup();
    render(<InformationForm />);
    
    const submitButton = screen.getByText('Enviar Informação');
    
    // Preencher formulário
    await user.type(screen.getByLabelText('Nome Completo'), 'João Silva');
    await user.type(screen.getByLabelText('Idade'), '25');
    await user.selectOptions(screen.getByLabelText('Sexo'), 'M');
    await user.type(screen.getByLabelText('Data de Desaparecimento'), '15/01/2024');
    await user.type(screen.getByLabelText('Local de Desaparecimento'), 'Cuiabá, MT');
    await user.type(screen.getByLabelText('Descrição'), 'Desaparecido desde 15/01/2024');
    await user.type(screen.getByLabelText('Contato'), '(65) 99999-9999');
    
    // Simular upload em progresso
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Adicionar Fotos');
    
    await user.upload(fileInput, file);
    
    // Verificar se o botão está desabilitado durante o upload
    expect(submitButton).toBeDisabled();
  });

  it('should handle form submission error', async () => {
    const user = userEvent.setup();
    
    // Mock API error
    server.use(
      http.post('http://localhost:3000/api/informations', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<InformationForm />);
    
    // Preencher formulário
    await user.type(screen.getByLabelText('Nome Completo'), 'João Silva');
    await user.type(screen.getByLabelText('Idade'), '25');
    await user.selectOptions(screen.getByLabelText('Sexo'), 'M');
    await user.type(screen.getByLabelText('Data de Desaparecimento'), '15/01/2024');
    await user.type(screen.getByLabelText('Local de Desaparecimento'), 'Cuiabá, MT');
    await user.type(screen.getByLabelText('Descrição'), 'Desaparecido desde 15/01/2024');
    await user.type(screen.getByLabelText('Contato'), '(65) 99999-9999');
    
    // Submeter formulário
    const submitButton = screen.getByText('Enviar Informação');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao enviar informação. Tente novamente.')).toBeInTheDocument();
    });
  });
});
