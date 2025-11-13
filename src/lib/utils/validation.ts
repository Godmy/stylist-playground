import type { ValidationRule } from '../types/controls';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Валидирует значение по правилам
 */
export function validateValue(value: any, rules?: ValidationRule[]): ValidationResult {
  const errors: string[] = [];

  if (!rules || rules.length === 0) {
    return { isValid: true, errors: [] };
  }

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '') {
          errors.push(rule.message || 'Поле обязательно для заполнения');
        }
        break;

      case 'min':
        if (typeof value === 'number' && rule.value !== undefined && value < rule.value) {
          errors.push(rule.message || `Минимальное значение: ${rule.value}`);
        }
        break;

      case 'max':
        if (typeof value === 'number' && rule.value !== undefined && value > rule.value) {
          errors.push(rule.message || `Максимальное значение: ${rule.value}`);
        }
        break;

      case 'minLength':
        if (typeof value === 'string' && rule.value !== undefined && value.length < rule.value) {
          errors.push(rule.message || `Минимальная длина: ${rule.value} символов`);
        }
        break;

      case 'maxLength':
        if (typeof value === 'string' && rule.value !== undefined && value.length > rule.value) {
          errors.push(rule.message || `Максимальная длина: ${rule.value} символов`);
        }
        break;

      case 'pattern':
        if (typeof value === 'string' && rule.value !== undefined) {
          const regex = new RegExp(rule.value);
          if (!regex.test(value)) {
            errors.push(rule.message || 'Неверный формат');
          }
        }
        break;

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          errors.push(rule.message || 'Значение не прошло валидацию');
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Определяет тип контрола на основе значения
 */
export function inferControlType(value: any): string {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    // Проверяем цвет
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) return 'color';
    return 'text';
  }
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'object';
  return 'text';
}
