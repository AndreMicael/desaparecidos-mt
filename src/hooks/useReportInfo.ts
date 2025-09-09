import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { sanitizeInput, isValidEmail, isValidPhone } from '@/lib/error-handler';

interface ReportInfoData {
  informantName: string;
  informantPhone: string;
  informantEmail: string;
  sightingDate: string;
  sightingLocation: string;
  description: string;
  isAnonymous: boolean;
  includePhone: boolean;
  includeEmail: boolean;
  photos?: File[];
}

interface UseReportInfoOptions {
  personId: string;
  personName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseReportInfoReturn {
  // Form data
  formData: ReportInfoData;
  setFormData: (data: Partial<ReportInfoData>) => void;
  
  // Loading states
  isSubmitting: boolean;
  isUploading: boolean;
  
  // Actions
  submitReport: () => Promise<void>;
  resetForm: () => void;
  validateForm: () => boolean;
  
  // File handling
  addPhoto: (file: File) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;
  
  // Validation
  errors: Record<string, string>;
  isValid: boolean;
}

export function useReportInfo(options: UseReportInfoOptions): UseReportInfoReturn {
  const { personId, personName, onSuccess, onError } = options;

  // Form state
  const [formData, setFormDataState] = useState<ReportInfoData>({
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

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set form data with validation
  const setFormData = useCallback((data: Partial<ReportInfoData>) => {
    setFormDataState(prev => {
      const newData = { ...prev, ...data };
      
      // Sanitize text inputs
      if (data.informantName) {
        newData.informantName = sanitizeInput(data.informantName);
      }
      if (data.sightingLocation) {
        newData.sightingLocation = sanitizeInput(data.sightingLocation);
      }
      if (data.description) {
        newData.description = sanitizeInput(data.description);
      }
      
      return newData;
    });
    
    // Clear errors when data changes
    setErrors({});
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.informantName.trim() && !formData.isAnonymous) {
      newErrors.informantName = 'Nome é obrigatório';
    }

    if (!formData.sightingDate) {
      newErrors.sightingDate = 'Data do avistamento é obrigatória';
    }

    if (!formData.sightingLocation.trim()) {
      newErrors.sightingLocation = 'Local do avistamento é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    // Validate email if provided
    if (formData.informantEmail && !isValidEmail(formData.informantEmail)) {
      newErrors.informantEmail = 'Email inválido';
    }

    // Validate phone if provided
    if (formData.informantPhone && !isValidPhone(formData.informantPhone)) {
      newErrors.informantPhone = 'Telefone inválido';
    }

    // Validate date
    if (formData.sightingDate) {
      const sightingDate = new Date(formData.sightingDate);
      const today = new Date();
      
      if (sightingDate > today) {
        newErrors.sightingDate = 'Data não pode ser futura';
      }
      
      // Check if date is too old (more than 1 year)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (sightingDate < oneYearAgo) {
        newErrors.sightingDate = 'Data muito antiga (máximo 1 ano)';
      }
    }

    // Validate description length
    if (formData.description.length > 1000) {
      newErrors.description = 'Descrição muito longa (máximo 1000 caracteres)';
    }

    // Validate photos
    if (formData.photos && formData.photos.length > 5) {
      newErrors.photos = 'Máximo 5 fotos permitidas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Add photo
  const addPhoto = useCallback((file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Arquivo muito grande (máximo 5MB)');
      return;
    }

    setFormDataState(prev => ({
      ...prev,
      photos: [...(prev.photos || []), file],
    }));
  }, []);

  // Remove photo
  const removePhoto = useCallback((index: number) => {
    setFormDataState(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  // Clear photos
  const clearPhotos = useCallback(() => {
    setFormDataState(prev => ({
      ...prev,
      photos: [],
    }));
  }, []);

  // Submit report
  const submitReport = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Upload photos first if any
      let photoUrls: string[] = [];
      
      if (formData.photos && formData.photos.length > 0) {
        const uploadPromises = formData.photos.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await apiClient.post<{ url: string }>('/upload', formData);
          
          return response.url;
        });

        photoUrls = await Promise.all(uploadPromises);
      }

      // Submit report data
      const reportData = {
        personId,
        informantName: formData.isAnonymous ? 'Anônimo' : formData.informantName,
        informantPhone: formData.includePhone ? formData.informantPhone : null,
        informantEmail: formData.includeEmail ? formData.informantEmail : null,
        sightingDate: formData.sightingDate,
        sightingLocation: formData.sightingLocation,
        description: formData.description,
        photos: photoUrls.join(','),
      };

      await apiClient.post('/informations', reportData);

      toast.success('Informação enviada com sucesso!');
      onSuccess?.();
      resetForm();

    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Erro ao enviar informação. Tente novamente.');
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  }, [formData, personId, validateForm, onSuccess, onError]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormDataState({
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
    setErrors({});
  }, []);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && validateForm();

  return {
    // Form data
    formData,
    setFormData,
    
    // Loading states
    isSubmitting,
    isUploading,
    
    // Actions
    submitReport,
    resetForm,
    validateForm,
    
    // File handling
    addPhoto,
    removePhoto,
    clearPhotos,
    
    // Validation
    errors,
    isValid,
  };
}
