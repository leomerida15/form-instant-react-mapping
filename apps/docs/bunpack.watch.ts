import { watch } from 'node:fs';
import { buildLlm } from './build-llm.ts';

const onServer = (): void => {
    const command: string[] = ['bun', 'run', '--bun', 'docsify', 'serve'];
    Bun.spawn(command);
    console.log(command.join(' '));
};

// Archivos que disparan rebuild del servidor y/o de llm.md
const RELEVANT = /^(index\.ts|README\.md|_sidebar\.md|index\.html|views\/.*\.md)$/;
const TRIGGERS_LLM = /^(README\.md|views\/.*\.md)$/;

const onRelevantChange = (filename: string): void => {
    if (TRIGGERS_LLM.test(filename)) {
        buildLlm().catch((e: unknown) => console.error('build-llm error', e));
    }
    onServer();
};

// Genera llm.md al arrancar, luego levanta el servidor y el watcher
buildLlm()
    .then(() => {
        onServer();
        watch('.', { recursive: true }, (event: string, filename: string | null) => {
            if (event !== 'change' && event !== 'rename') return;
            if (filename == null) return;
            if (RELEVANT.test(filename)) onRelevantChange(filename);
        });
    })
    .catch((e: unknown) => {
        console.error('build-llm error', e);
        process.exit(1);
    });