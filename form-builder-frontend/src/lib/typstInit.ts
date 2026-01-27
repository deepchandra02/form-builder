import { $typst } from '@myriaddreamin/typst.ts';
import wasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';

let initialized = false;

export async function initTypst(): Promise<void> {
  if (initialized) return;

  await $typst.setCompilerInitOptions({
    getModule: () => WebAssembly.compileStreaming(fetch(wasmUrl))
  });

  initialized = true;
}

export { $typst };
