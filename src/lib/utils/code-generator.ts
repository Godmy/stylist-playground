/**
 * Code Generator Utility
 * Generates Svelte component code from props
 */

export interface CodeGeneratorOptions {
  componentName: string;
  category: string;
  props: Record<string, any>;
  includeImport?: boolean;
  includeScript?: boolean;
}

export function generateComponentCode(options: CodeGeneratorOptions): string {
  const { componentName, category, props, includeImport = true, includeScript = true } = options;

  const lines: string[] = [];

  // Generate import statement
  if (includeImport) {
    lines.push(`import { ${componentName} } from 'stylist-svelte/components/${category}';`);
    lines.push('');
  }

  // Generate script block with props
  if (includeScript && Object.keys(props).length > 0) {
    lines.push('<script>');
    lines.push('  let props = {');

    Object.entries(props).forEach(([key, value], index, array) => {
      const formattedValue = formatPropValue(value);
      const comma = index < array.length - 1 ? ',' : '';
      lines.push(`    ${key}: ${formattedValue}${comma}`);
    });

    lines.push('  };');
    lines.push('</script>');
    lines.push('');
  }

  // Generate component tag
  const propsString = generatePropsString(props);
  if (propsString) {
    lines.push(`<${componentName} ${propsString} />`);
  } else {
    lines.push(`<${componentName} />`);
  }

  return lines.join('\n');
}

function formatPropValue(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    const items = value.map(formatPropValue).join(', ');
    return `[${items}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([k, v]) => `${k}: ${formatPropValue(v)}`)
      .join(', ');
    return `{ ${entries} }`;
  }
  return String(value);
}

function generatePropsString(props: Record<string, any>): string {
  const propEntries = Object.entries(props).filter(([_, value]) => value !== undefined);

  if (propEntries.length === 0) return '';

  return propEntries
    .map(([key, value]) => {
      // Boolean true can be shorthand
      if (value === true) return key;
      // Boolean false is typically omitted, but we'll include it for clarity
      if (value === false) return `${key}={false}`;
      // String values
      if (typeof value === 'string') return `${key}="${value}"`;
      // Other values use curly braces
      return `${key}={${formatPropValue(value)}}`;
    })
    .join(' ');
}

export function generateImportCode(componentName: string, category: string): string {
  return `import { ${componentName} } from 'stylist-svelte/components/${category}';`;
}

export function generateUsageExample(componentName: string, props: Record<string, any>): string {
  const propsString = generatePropsString(props);
  if (propsString) {
    return `<${componentName} ${propsString} />`;
  }
  return `<${componentName} />`;
}

export function generateTypeScriptInterface(
  componentName: string,
  propsTypes: Record<string, string>
): string {
  const lines: string[] = [];
  lines.push(`interface ${componentName}Props {`);

  Object.entries(propsTypes).forEach(([key, type]) => {
    lines.push(`  ${key}: ${type};`);
  });

  lines.push('}');
  return lines.join('\n');
}
