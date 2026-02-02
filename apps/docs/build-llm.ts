/**
 * Genera apps/docs/llm.md y packages/react-input-mapping/README.md empaquetando
 * README.md + views/*.md para consumo por IA y documentación del paquete.
 * Exporta buildLlm para uso desde bunpack.watch.ts u otros; al ejecutarse como script
 * (bun run build-llm.ts) también ejecuta el build.
 */

const DIR = import.meta.dir;
const README_PATH = `${DIR}/README.md`;
const VIEWS_DIR = `${DIR}/views`;
const LLM_PATH = `${DIR}/llm.md`;
const INPUT_MAPPING_README_PATH = `${DIR}/../../packages/react-input-mapping/README.md`;

const INCLUDE_RE = /\[([^\]]+)\]\((views\/([^)]+\.md))\s*":include"\)/g;

const AI_HEADER = `<!-- Documentación empaquetada para consumo por IA. Generado desde README.md + views/*.md -->\n\n`;

export async function buildLlm(): Promise<void> {
  let readme = await Bun.file(README_PATH).text();

  for (const match of readme.matchAll(INCLUDE_RE) as IterableIterator<RegExpMatchArray>) {
    const filename = match[3];
    if (filename == null) continue;
    const viewPath = `${VIEWS_DIR}/${filename}`;
    try {
      const content = await Bun.file(viewPath).text();
      readme = readme.replace(match[0], content);
    } catch (e: unknown) {
      console.error(`build-llm: no se pudo leer ${viewPath}`, e);
    }
  }

  const out = AI_HEADER + readme;
  await Bun.write(LLM_PATH, out);
  await Bun.write(INPUT_MAPPING_README_PATH, out);
  console.log('llm.md y packages/react-input-mapping/README.md actualizados');
}

if (import.meta.main) {
  buildLlm().catch((e: unknown) => {
    console.error('build-llm error:', e);
    process.exit(1);
  });
}
