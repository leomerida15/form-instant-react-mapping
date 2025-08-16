import Bun from 'bun';
import fs from 'node:fs';
import { buildDocs } from './docs.build.ts';

const timetaken = 'complete build';

// Starts the timer, the label value is timetaken
console.time(timetaken);

// Build documentation first
console.log('📚 Building documentation...');
try {
    buildDocs();
    console.log('✅ Documentation built successfully');
} catch (error) {
    console.error('❌ Documentation build failed:', error);
    process.exit(1);
}

// Build the main bundle
Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    format: 'esm',
    minify: true,
    sourcemap: 'external',
    target: 'browser',
    // Optimizations for smallest bundle size
    splitting: false,
    // External dependencies
    external: ['react', 'react-dom', 'minimatch'],
    // Define environment
    define: {
        'process.env.NODE_ENV': '"production"',
    },
})
    .then(() => {
        console.log('✅ Main bundle built successfully');
        console.log('📦 Bundle optimized for minimum size');

        // Clean TypeScript build cache to ensure fresh generation
        const buildInfoPath = './node_modules/.tmp/tsconfig.build.tsbuildinfo';
        try {
            fs.unlinkSync(buildInfoPath);
            console.log('🧹 TypeScript build cache cleaned');
        } catch (error) {
            // Cache file doesn't exist, which is fine
        }

        // Generate TypeScript declarations using the specific config
        return Bun.spawn(['bun', 'x', 'tsc', '--project', 'tsconfig.build.json']);
    })
    .then((result) => {
        // Check if the process completed successfully
        if (result.exitCode === 0 || result.exitCode === null) {
            console.log('✅ TypeScript declarations generated');
        } else {
            console.error('❌ TypeScript declarations generation failed');
            console.error('Exit code:', result.exitCode);
        }
    })
    .catch((err) => {
        console.error('❌ Build failed:', err);
        process.exit(1);
    })
    .finally(() => {
        console.timeEnd(timetaken);
    });
