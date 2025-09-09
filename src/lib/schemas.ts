import { z } from 'zod';

// Schema para pessoa
export const PersonSchema = z.object({
  id: z.number(),
  nome: z.string().min(1, 'Nome é obrigatório'),
  idade: z.number().min(0).max(120, 'Idade deve estar entre 0 e 120 anos'),
  sexo: z.enum(['M', 'F'], { message: 'Sexo deve ser M ou F' }),
  localizado: z.boolean(),
  dataDesaparecimento: z.string().optional(),
  localDesaparecimento: z.string().optional(),
  descricao: z.string().optional(),
  foto: z.string().url().optional(),
  contato: z.string().optional(),
  ocoId: z.string().optional(),
});

// Schema para resposta da API Abitus
export const AbitusResponseSchema = z.object({
  content: z.array(PersonSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  size: z.number(),
  number: z.number(),
  first: z.boolean(),
  last: z.boolean(),
  numberOfElements: z.number(),
  empty: z.boolean(),
});

// Schema para filtros de busca
export const SearchFiltersSchema = z.object({
  nome: z.string().optional(),
  idadeMinima: z.string().optional(),
  idadeMaxima: z.string().optional(),
  sexos: z.array(z.enum(['M', 'F'])).optional(),
  status: z.array(z.enum(['desaparecido', 'localizado'])).optional(),
});

// Schema para envio de informações
export const InformationFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  idade: z.string().min(1, 'Idade é obrigatória'),
  sexo: z.enum(['M', 'F'], { message: 'Sexo é obrigatório' }),
  dataDesaparecimento: z.string().min(1, 'Data de desaparecimento é obrigatória'),
  localDesaparecimento: z.string().min(1, 'Local de desaparecimento é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  contato: z.string().min(1, 'Contato é obrigatório'),
  sightingLocation: z.string().optional(),
  photos: z.array(z.string()).max(5, 'Máximo 5 fotos').optional(),
});

// Schema para resposta da API interna
export const ApiResponseSchema = z.object({
  data: z.array(PersonSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

// Schema para estatísticas
export const StatisticsSchema = z.object({
  totalPessoas: z.number(),
  pessoasLocalizadas: z.number(),
  pessoasDesaparecidas: z.number(),
});

// Schema para erro da API
export const ApiErrorSchema = z.object({
  message: z.string(),
  status: z.number().optional(),
  code: z.string().optional(),
  details: z.any().optional(),
});

// Tipos inferidos dos schemas
export type Person = z.infer<typeof PersonSchema>;
export type AbitusResponse = z.infer<typeof AbitusResponseSchema>;
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type InformationForm = z.infer<typeof InformationFormSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type Statistics = z.infer<typeof StatisticsSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

// Funções de validação
export function validatePerson(data: unknown): Person {
  return PersonSchema.parse(data);
}

export function validateAbitusResponse(data: unknown): AbitusResponse {
  return AbitusResponseSchema.parse(data);
}

export function validateSearchFilters(data: unknown): SearchFilters {
  return SearchFiltersSchema.parse(data);
}

export function validateInformationForm(data: unknown): InformationForm {
  return InformationFormSchema.parse(data);
}

export function validateApiResponse(data: unknown): ApiResponse {
  return ApiResponseSchema.parse(data);
}

export function validateStatistics(data: unknown): Statistics {
  return StatisticsSchema.parse(data);
}

export function validateApiError(data: unknown): ApiError {
  return ApiErrorSchema.parse(data);
}

// Funções de validação segura (não lançam erro)
export function safeValidatePerson(data: unknown) {
  return PersonSchema.safeParse(data);
}

export function safeValidateAbitusResponse(data: unknown) {
  return AbitusResponseSchema.safeParse(data);
}

export function safeValidateSearchFilters(data: unknown) {
  return SearchFiltersSchema.safeParse(data);
}

export function safeValidateInformationForm(data: unknown) {
  return InformationFormSchema.safeParse(data);
}

export function safeValidateApiResponse(data: unknown) {
  return ApiResponseSchema.safeParse(data);
}

export function safeValidateStatistics(data: unknown) {
  return StatisticsSchema.safeParse(data);
}

export function safeValidateApiError(data: unknown) {
  return ApiErrorSchema.safeParse(data);
}
