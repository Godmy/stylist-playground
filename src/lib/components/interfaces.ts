/**
 * Playground Interfaces
 * Type definitions for story files and playground components
 */

import type { StoryConfig, ControlConfig } from './types';

// Define the Meta type for story configuration
export interface Meta {
  title: string;
  component?: any;
  tags?: string[];
  parameters?: {
    layout?: 'centered' | 'fullscreen' | 'padded';
    [key: string]: any;
  };
  argTypes?: {
    [key: string]: {
      control: {
        type: string;
        options?: any[];
      };
      description?: string;
      defaultValue?: any;
    };
  };
  [key: string]: any; // Allow additional properties
}

// Define the StoryFn type for story functions
export interface StoryFn {
  (args?: Record<string, any>): {
    Component: any;
    props: Record<string, any>;
  };
}

// Export other useful types
export type { StoryConfig, ControlConfig };