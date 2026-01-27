import { $typst } from '@myriaddreamin/typst.ts';
import wasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';

let initialized = false;

export function initTypst(): void {
  if (initialized) return;

  // Set up compiler init options with the WASM URL
  // The actual WASM loading happens lazily when pdf() or other compile methods are called
  $typst.setCompilerInitOptions({
    getModule: () => wasmUrl
  });

  initialized = true;
}

export { $typst };
