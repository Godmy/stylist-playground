// Типы для системы контролов

export type ControlType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'range'
  | 'object'
  | 'array'
  | 'date'
  | 'textarea';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface RangeConfig {
  min: number;
  max: number;
  step?: number;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean;
}

export interface ControlConfig {
  type: ControlType;
  label?: string;
  defaultValue?: any;
  description?: string;
  group?: string;

  // Для select
  options?: SelectOption[];

  // Для range и number
  min?: number;
  max?: number;
  step?: number;

  // Валидация
  validation?: ValidationRule[];

  // Для textarea
  rows?: number;

  // Для всех типов
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ControlValue {
  value: any;
  config: ControlConfig;
  isValid: boolean;
  validationErrors?: string[];
}

export type ControlsState = Record<string, ControlValue>;
