import { pathToFileURL } from 'url';

// ES Module loader for ts-node
export async function resolve(specifier, context, defaultResolve) {
  return defaultResolve(specifier, context);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.ts') || url.endsWith('.tsx')) {
    // For TypeScript files, we need to use ts-node
    // This is a simplified loader - ts-node/esm should handle this
    return defaultLoad(url, context);
  }
  return defaultLoad(url, context);
}


