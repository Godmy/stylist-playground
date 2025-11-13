// Утилита для генерации кода компонента на основе props

export interface CodeGeneratorOptions {
  componentName: string;
  props: Record<string, any>;
  framework?: 'svelte' | 'react' | 'vue';
}

/**
 * Форматирует значение prop для кода
 */
function formatPropValue(value: any): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

/**
 * Генерирует код для Svelte
 */
function generateSvelteCode(componentName: string, props: Record<string, any>): string {
  const propsEntries = Object.entries(props).filter(([_, value]) => value !== undefined && value !== null);

  if (propsEntries.length === 0) {
    return `<script>
  import ${componentName} from 'stylist-svelte';
</script>

<${componentName} />`;
  }

  const propsString = propsEntries
    .map(([key, value]) => {
      if (typeof value === 'boolean' && value === true) {
        return `  ${key}`;
      }
      if (typeof value === 'string') {
        return `  ${key}="${value}"`;
      }
      return `  ${key}={${formatPropValue(value)}}`;
    })
    .join('\n');

  return `<script>
  import ${componentName} from 'stylist-svelte';
</script>

<${componentName}
${propsString}
/>`;
}

/**
 * Генерирует код для React
 */
function generateReactCode(componentName: string, props: Record<string, any>): string {
  const propsEntries = Object.entries(props).filter(([_, value]) => value !== undefined && value !== null);

  if (propsEntries.length === 0) {
    return `import { ${componentName} } from 'stylist-react';

function App() {
  return <${componentName} />;
}`;
  }

  const propsString = propsEntries
    .map(([key, value]) => {
      if (typeof value === 'boolean' && value === true) {
        return `    ${key}`;
      }
      if (typeof value === 'string') {
        return `    ${key}="${value}"`;
      }
      return `    ${key}={${formatPropValue(value)}}`;
    })
    .join('\n');

  return `import { ${componentName} } from 'stylist-react';

function App() {
  return (
    <${componentName}
${propsString}
    />
  );
}`;
}

/**
 * Генерирует код для Vue
 */
function generateVueCode(componentName: string, props: Record<string, any>): string {
  const propsEntries = Object.entries(props).filter(([_, value]) => value !== undefined && value !== null);

  if (propsEntries.length === 0) {
    return `<template>
  <${componentName} />
</template>

<script setup>
import { ${componentName} } from 'stylist-vue';
</script>`;
  }

  const propsString = propsEntries
    .map(([key, value]) => {
      if (typeof value === 'boolean' && value === true) {
        return `    ${key}`;
      }
      if (typeof value === 'string') {
        return `    ${key}="${value}"`;
      }
      return `    :${key}="${formatPropValue(value)}"`;
    })
    .join('\n');

  return `<template>
  <${componentName}
${propsString}
  />
</template>

<script setup>
import { ${componentName} } from 'stylist-vue';
</script>`;
}

/**
 * Главная функция генерации кода
 */
export function generateCode(options: CodeGeneratorOptions): string {
  const { componentName, props, framework = 'svelte' } = options;

  switch (framework) {
    case 'svelte':
      return generateSvelteCode(componentName, props);
    case 'react':
      return generateReactCode(componentName, props);
    case 'vue':
      return generateVueCode(componentName, props);
    default:
      return generateSvelteCode(componentName, props);
  }
}

/**
 * Определяет язык подсветки на основе framework
 */
export function getLanguageForFramework(framework: 'svelte' | 'react' | 'vue'): string {
  switch (framework) {
    case 'svelte':
      return 'svelte';
    case 'react':
      return 'tsx';
    case 'vue':
      return 'vue';
    default:
      return 'svelte';
  }
}
