/**
 * Utilitários para máscaras e validações de campos
 */

/**
 * Aplica máscara de telefone brasileiro: (XX) XXXXX-XXXX
 */
export function formatPhone(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica máscara (XX) XXXXX-XXXX
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * Aplica máscara de data brasileira: DD/MM/AAAA
 */
export function formatDate(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica máscara DD/MM/AAAA
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}

/**
 * Valida se o telefone está no formato correto
 */
export function validatePhone(phone: string): boolean {
  // Remove formatação para validar apenas números
  const numbers = phone.replace(/\D/g, '');
  
  // Telefone deve ter 10 ou 11 dígitos (com DDD)
  return numbers.length === 10 || numbers.length === 11;
}

/**
 * Valida se a data está no formato correto e é válida
 */
export function validateDate(date: string): boolean {
  // Verifica se está no formato DD/MM/AAAA
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = date.match(dateRegex);
  
  if (!match) return false;
  
  const [, day, month, year] = match;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Validações básicas
  if (monthNum < 1 || monthNum > 12) return false;
  if (dayNum < 1 || dayNum > 31) return false;
  if (yearNum < 1900 || yearNum > 2100) return false;
  
  // Verifica se a data é válida
  const dateObj = new Date(yearNum, monthNum - 1, dayNum);
  return dateObj.getDate() === dayNum && 
         dateObj.getMonth() === monthNum - 1 && 
         dateObj.getFullYear() === yearNum;
}

/**
 * Converte data do formato DD/MM/AAAA para yyyy-MM-dd (formato ISO)
 */
export function formatDateToISO(date: string): string {
  if (!validateDate(date)) return '';
  
  const [day, month, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Converte data do formato yyyy-MM-dd para DD/MM/AAAA
 */
export function formatDateFromISO(date: string): string {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
}

/**
 * Remove formatação do telefone, deixando apenas números
 */
export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Remove formatação da data, deixando apenas números
 */
export function unformatDate(date: string): string {
  return date.replace(/\D/g, '');
}

/**
 * Hook para máscara de telefone
 */
export function usePhoneMask() {
  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatPhone(value);
    onChange(formatted);
  };

  return { handlePhoneChange, formatPhone, validatePhone, unformatPhone };
}

/**
 * Hook para máscara de data
 */
export function useDateMask() {
  const handleDateChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatDate(value);
    onChange(formatted);
  };

  return { handleDateChange, formatDate, validateDate, unformatDate };
}
