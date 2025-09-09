import { 
  PersonSchema, 
  AbitusResponseSchema, 
  SearchFiltersSchema, 
  InformationFormSchema,
  ApiResponseSchema,
  StatisticsSchema,
  validatePerson,
  validateAbitusResponse,
  validateSearchFilters,
  validateInformationForm,
  validateApiResponse,
  validateStatistics,
  safeValidatePerson,
  safeValidateAbitusResponse,
  safeValidateSearchFilters,
  safeValidateInformationForm,
  safeValidateApiResponse,
  safeValidateStatistics
} from '@/lib/schemas';

describe('PersonSchema', () => {
  const validPerson = {
    id: 1,
    nome: 'João Silva',
    idade: 25,
    sexo: 'M',
    localizado: false,
    dataDesaparecimento: '2024-01-15',
    localDesaparecimento: 'Cuiabá, MT',
    descricao: 'Desaparecido desde 15/01/2024',
    foto: 'https://example.com/photo.jpg',
    contato: '(65) 99999-9999',
    ocoId: 'oco123',
  };

  it('should validate valid person data', () => {
    expect(() => PersonSchema.parse(validPerson)).not.toThrow();
  });

  it('should reject person with missing required fields', () => {
    const invalidPerson = { ...validPerson, nome: '' };
    expect(() => PersonSchema.parse(invalidPerson)).toThrow('Nome é obrigatório');
  });

  it('should reject person with invalid age', () => {
    const invalidPerson = { ...validPerson, idade: 150 };
    expect(() => PersonSchema.parse(invalidPerson)).toThrow('Idade deve estar entre 0 e 120 anos');
  });

  it('should reject person with invalid sex', () => {
    const invalidPerson = { ...validPerson, sexo: 'X' };
    expect(() => PersonSchema.parse(invalidPerson)).toThrow();
  });

  it('should reject person with invalid photo URL', () => {
    const invalidPerson = { ...validPerson, foto: 'not-a-url' };
    expect(() => PersonSchema.parse(invalidPerson)).toThrow();
  });

  it('should accept person with optional fields missing', () => {
    const minimalPerson = {
      id: 1,
      nome: 'João Silva',
      idade: 25,
      sexo: 'M',
      localizado: false,
    };
    expect(() => PersonSchema.parse(minimalPerson)).not.toThrow();
  });
});

describe('AbitusResponseSchema', () => {
  const validResponse = {
    content: [
      {
        id: 1,
        nome: 'João Silva',
        idade: 25,
        sexo: 'M',
        localizado: false,
      }
    ],
    totalPages: 1,
    totalElements: 1,
    size: 50,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 1,
    empty: false,
  };

  it('should validate valid Abitus response', () => {
    expect(() => AbitusResponseSchema.parse(validResponse)).not.toThrow();
  });

  it('should reject response with invalid content', () => {
    const invalidResponse = { ...validResponse, content: 'not-an-array' };
    expect(() => AbitusResponseSchema.parse(invalidResponse)).toThrow();
  });

  it('should reject response with missing required fields', () => {
    const invalidResponse = { ...validResponse, totalPages: undefined };
    expect(() => AbitusResponseSchema.parse(invalidResponse)).toThrow();
  });
});

describe('SearchFiltersSchema', () => {
  it('should validate valid search filters', () => {
    const validFilters = {
      nome: 'João',
      idadeMinima: '18',
      idadeMaxima: '65',
      sexos: ['M', 'F'],
      status: ['desaparecido', 'localizado'],
    };
    expect(() => SearchFiltersSchema.parse(validFilters)).not.toThrow();
  });

  it('should validate empty search filters', () => {
    expect(() => SearchFiltersSchema.parse({})).not.toThrow();
  });

  it('should reject filters with invalid sex values', () => {
    const invalidFilters = { sexos: ['X'] };
    expect(() => SearchFiltersSchema.parse(invalidFilters)).toThrow();
  });

  it('should reject filters with invalid status values', () => {
    const invalidFilters = { status: ['invalid'] };
    expect(() => SearchFiltersSchema.parse(invalidFilters)).toThrow();
  });
});

describe('InformationFormSchema', () => {
  const validForm = {
    nome: 'João Silva',
    idade: '25',
    sexo: 'M',
    dataDesaparecimento: '15/01/2024',
    localDesaparecimento: 'Cuiabá, MT',
    descricao: 'Desaparecido desde 15/01/2024',
    contato: '(65) 99999-9999',
    sightingLocation: 'Várzea Grande, MT',
    photos: ['photo1.jpg', 'photo2.jpg'],
  };

  it('should validate valid form data', () => {
    expect(() => InformationFormSchema.parse(validForm)).not.toThrow();
  });

  it('should reject form with missing required fields', () => {
    const invalidForm = { ...validForm, nome: '' };
    expect(() => InformationFormSchema.parse(invalidForm)).toThrow('Nome é obrigatório');
  });

  it('should reject form with invalid sex', () => {
    const invalidForm = { ...validForm, sexo: 'X' };
    expect(() => InformationFormSchema.parse(invalidForm)).toThrow();
  });

  it('should reject form with too many photos', () => {
    const invalidForm = { 
      ...validForm, 
      photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg']
    };
    expect(() => InformationFormSchema.parse(invalidForm)).toThrow('Máximo 5 fotos');
  });

  it('should accept form with optional fields missing', () => {
    const minimalForm = {
      nome: 'João Silva',
      idade: '25',
      sexo: 'M',
      dataDesaparecimento: '15/01/2024',
      localDesaparecimento: 'Cuiabá, MT',
      descricao: 'Desaparecido desde 15/01/2024',
      contato: '(65) 99999-9999',
    };
    expect(() => InformationFormSchema.parse(minimalForm)).not.toThrow();
  });
});

describe('ApiResponseSchema', () => {
  const validResponse = {
    data: [
      {
        id: 1,
        nome: 'João Silva',
        idade: 25,
        sexo: 'M',
        localizado: false,
      }
    ],
    total: 1,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  };

  it('should validate valid API response', () => {
    expect(() => ApiResponseSchema.parse(validResponse)).not.toThrow();
  });

  it('should reject response with invalid data array', () => {
    const invalidResponse = { ...validResponse, data: 'not-an-array' };
    expect(() => ApiResponseSchema.parse(invalidResponse)).toThrow();
  });

  it('should reject response with missing required fields', () => {
    const invalidResponse = { ...validResponse, total: undefined };
    expect(() => ApiResponseSchema.parse(invalidResponse)).toThrow();
  });
});

describe('StatisticsSchema', () => {
  const validStats = {
    totalPessoas: 449,
    pessoasLocalizadas: 23,
    pessoasDesaparecidas: 426,
  };

  it('should validate valid statistics', () => {
    expect(() => StatisticsSchema.parse(validStats)).not.toThrow();
  });

  it('should reject statistics with invalid data types', () => {
    const invalidStats = { ...validStats, totalPessoas: 'not-a-number' };
    expect(() => StatisticsSchema.parse(invalidStats)).toThrow();
  });

  it('should reject statistics with missing required fields', () => {
    const invalidStats = { ...validStats, totalPessoas: undefined };
    expect(() => StatisticsSchema.parse(invalidStats)).toThrow();
  });
});

describe('Validation functions', () => {
  const validPerson = {
    id: 1,
    nome: 'João Silva',
    idade: 25,
    sexo: 'M',
    localizado: false,
  };

  describe('validatePerson', () => {
    it('should validate and return person data', () => {
      const result = validatePerson(validPerson);
      expect(result).toEqual(validPerson);
    });

    it('should throw error for invalid data', () => {
      expect(() => validatePerson({ ...validPerson, nome: '' })).toThrow();
    });
  });

  describe('safeValidatePerson', () => {
    it('should return success for valid data', () => {
      const result = safeValidatePerson(validPerson);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPerson);
      }
    });

    it('should return error for invalid data', () => {
      const result = safeValidatePerson({ ...validPerson, nome: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('Other validation functions', () => {
    it('should validate Abitus response', () => {
      const validResponse = {
        content: [validPerson],
        totalPages: 1,
        totalElements: 1,
        size: 50,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 1,
        empty: false,
      };
      
      expect(() => validateAbitusResponse(validResponse)).not.toThrow();
    });

    it('should validate search filters', () => {
      const validFilters = { nome: 'João' };
      expect(() => validateSearchFilters(validFilters)).not.toThrow();
    });

    it('should validate information form', () => {
      const validForm = {
        nome: 'João Silva',
        idade: '25',
        sexo: 'M',
        dataDesaparecimento: '15/01/2024',
        localDesaparecimento: 'Cuiabá, MT',
        descricao: 'Desaparecido desde 15/01/2024',
        contato: '(65) 99999-9999',
      };
      
      expect(() => validateInformationForm(validForm)).not.toThrow();
    });

    it('should validate API response', () => {
      const validResponse = {
        data: [validPerson],
        total: 1,
        page: 1,
        pageSize: 12,
        totalPages: 1,
      };
      
      expect(() => validateApiResponse(validResponse)).not.toThrow();
    });

    it('should validate statistics', () => {
      const validStats = {
        totalPessoas: 449,
        pessoasLocalizadas: 23,
        pessoasDesaparecidas: 426,
      };
      
      expect(() => validateStatistics(validStats)).not.toThrow();
    });
  });
});
