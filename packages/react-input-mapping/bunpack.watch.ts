import fs from 'node:fs'

fs.watch('src/index.ts', { recursive: true }, (event, filename) => {
    if (event === 'change' || event === 'rename') {
        Bun.spawn(['bun', 'run', 'build']);
    }
});