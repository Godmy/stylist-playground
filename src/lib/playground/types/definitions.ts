/**
 * Stylist Playground Types
 * Modern playground for Svelte 5 components
 */

export type ControlType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'range'
  | 'date'
  | 'object'
  | 'array';

export type ControlGroup =
  | 'Layout'
  | 'Style'
  | 'Behavior'
  | 'Content'
  | 'Advanced'
  | 'Other';

export interface StoryMeta {
  title: string;
  component?: any;
  description?: string;
  tags?: string[];
}

export interface VariantConfig {
  name: string;
  props?: Record<string, any>;
  description?: string;
}

export interface ControlConfig {
  name: string;
  type: ControlType;
  defaultValue?: any;
  description?: string;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
  group?: ControlGroup;
}

export interface StoryConfig {
  id: string;
  title: string;
  component: any;
  description?: string;
  controls?: ControlConfig[];
  variants?: VariantConfig[];
  code?: string;
  category?: string;
  tags?: string[];
  docs?: string; // Markdown documentation
}

export type BottomTab = 'controls' | 'code' | 'export' | 'shortcuts' | 'actions' | 'variants' | 'presets';
export type SidebarTab = 'variants' | 'props' | 'docs' | 'code' | 'a11y' | 'history';
export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';

export interface PlaygroundState {
  currentStoryId: string | null;
  darkMode: boolean;
  sidebarOpen: boolean;
  viewport: ViewportSize;
  showCode: boolean;
  controlsOpen: boolean;
  bottomTab?: BottomTab;
  sidebarTab?: SidebarTab;
}

export interface NavigatorItem {
  id: string;
  title: string;
  category?: string;
  children?: NavigatorItem[];
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}
