// Test setup for Bun.js
import { expect } from 'bun:test';

// Global test utilities
global.expect = expect;

// Mock React for testing
global.React = {
    createElement: () => ({}),
    Fragment: Symbol('Fragment'),
    memo: (component: any) => component,
    useMemo: (factory: () => any, deps: any[]) => factory(),
    useCallback: (callback: any, deps: any[]) => callback,
};

// Mock console for cleaner test output
const originalConsole = console;
global.console = {
    ...originalConsole,
    log: () => {},
    warn: () => {},
    error: () => {},
};
