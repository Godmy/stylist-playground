// Типы для системы вариантов stories

export interface StoryVariant {
  name: string;
  description?: string;
  props: Record<string, any>;
}

export interface StoryVariantsConfig {
  component: any;
  variants: StoryVariant[];
  layout?: 'grid' | 'list';
  columns?: number;
}

export type VariantLayout = 'grid' | 'list';
