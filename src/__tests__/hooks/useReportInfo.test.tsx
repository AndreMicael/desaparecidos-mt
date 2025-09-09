import { renderHook, act } from '@testing-library/react';
import { useReportInfo } from '@/hooks/useReportInfo';
import { toast } from 'sonner';

// Mock do toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock do apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const mockApiClient = require('@/lib/api-client').apiClient;

describe('useReportInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultOptions = {
    personId: '1',
    personName: 'João Silva',
  };

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    expect(result.current.formData).toEqual({
      informantName: '',
      informantPhone: '',
      informantEmail: '',
      sightingDate: '',
      sightingLocation: '',
      description: '',
      isAnonymous: false,
      includePhone: true,
      includeEmail: true,
      photos: [],
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(false);
  });

  it('should update form data correctly', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        informantName: 'Maria Santos',
        informantEmail: 'maria@example.com',
        description: 'Vi a pessoa na praça central',
      });
    });

    expect(result.current.formData.informantName).toBe('Maria Santos');
    expect(result.current.formData.informantEmail).toBe('maria@example.com');
    expect(result.current.formData.description).toBe('Vi a pessoa na praça central');
  });

  it('should sanitize input data', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        informantName: '<script>alert("xss")</script>João',
        description: 'Descrição com <iframe>malicious</iframe> conteúdo',
      });
    });

    expect(result.current.formData.informantName).toBe('João');
    expect(result.current.formData.description).toBe('Descrição com  conteúdo');
  });

  it('should validate form correctly', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    // Form should be invalid initially
    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.setFormData({
        informantName: 'João Silva',
        sightingDate: '2024-01-15',
        sightingLocation: 'Praça Central',
        description: 'Vi a pessoa na praça',
      });
    });

    expect(result.current.isValid).toBe(true);
  });

  it('should validate required fields', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toHaveProperty('sightingDate');
    expect(result.current.errors).toHaveProperty('sightingLocation');
    expect(result.current.errors).toHaveProperty('description');
  });

  it('should validate email format', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        informantEmail: 'invalid-email',
      });
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toHaveProperty('informantEmail');
  });

  it('should validate phone format', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        informantPhone: '123',
      });
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toHaveProperty('informantPhone');
  });

  it('should validate date not in future', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    act(() => {
      result.current.setFormData({
        sightingDate: futureDate.toISOString().split('T')[0],
      });
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toHaveProperty('sightingDate');
  });

  it('should validate description length', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        description: 'a'.repeat(1001),
      });
    });

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toHaveProperty('description');
  });

  it('should add photo correctly', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.addPhoto(mockFile);
    });

    expect(result.current.formData.photos).toHaveLength(1);
    expect(result.current.formData.photos?.[0]).toBe(mockFile);
  });

  it('should reject non-image files', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    act(() => {
      result.current.addPhoto(mockFile);
    });

    expect(result.current.formData.photos).toHaveLength(0);
    expect(toast.error).toHaveBeenCalledWith('Apenas imagens são permitidas');
  });

  it('should reject files too large', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB

    act(() => {
      result.current.addPhoto(mockFile);
    });

    expect(result.current.formData.photos).toHaveLength(0);
    expect(toast.error).toHaveBeenCalledWith('Arquivo muito grande (máximo 5MB)');
  });

  it('should remove photo correctly', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    const mockFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
    const mockFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.addPhoto(mockFile1);
      result.current.addPhoto(mockFile2);
    });

    expect(result.current.formData.photos).toHaveLength(2);

    act(() => {
      result.current.removePhoto(0);
    });

    expect(result.current.formData.photos).toHaveLength(1);
    expect(result.current.formData.photos?.[0]).toBe(mockFile2);
  });

  it('should clear photos correctly', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.addPhoto(mockFile);
    });

    expect(result.current.formData.photos).toHaveLength(1);

    act(() => {
      result.current.clearPhotos();
    });

    expect(result.current.formData.photos).toHaveLength(0);
  });

  it('should submit report successfully', async () => {
    mockApiClient.post.mockResolvedValue({});

    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        informantName: 'João Silva',
        sightingDate: '2024-01-15',
        sightingLocation: 'Praça Central',
        description: 'Vi a pessoa na praça',
      });
    });

    await act(async () => {
      await result.current.submitReport();
    });

    expect(mockApiClient.post).toHaveBeenCalledWith('/informations', {
      personId: '1',
      informantName: 'João Silva',
      informantPhone: null,
      informantEmail: null,
      sightingDate: '2024-01-15',
      sightingLocation: 'Praça Central',
      description: 'Vi a pessoa na praça',
      photos: '',
    });

    expect(toast.success).toHaveBeenCalledWith('Informação enviada com sucesso!');
  });

  it('should handle submit error', async () => {
    const mockError = new Error('API Error');
    mockApiClient.post.mockRejectedValue(mockError);

    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        informantName: 'João Silva',
        sightingDate: '2024-01-15',
        sightingLocation: 'Praça Central',
        description: 'Vi a pessoa na praça',
      });
    });

    await act(async () => {
      await result.current.submitReport();
    });

    expect(toast.error).toHaveBeenCalledWith('Erro ao enviar informação. Tente novamente.');
  });

  it('should reset form correctly', () => {
    const { result } = renderHook(() => useReportInfo(defaultOptions));

    act(() => {
      result.current.setFormData({
        informantName: 'João Silva',
        sightingDate: '2024-01-15',
        sightingLocation: 'Praça Central',
        description: 'Vi a pessoa na praça',
      });
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      informantName: '',
      informantPhone: '',
      informantEmail: '',
      sightingDate: '',
      sightingLocation: '',
      description: '',
      isAnonymous: false,
      includePhone: true,
      includeEmail: true,
      photos: [],
    });
    expect(result.current.errors).toEqual({});
  });
});
