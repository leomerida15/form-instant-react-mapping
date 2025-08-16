// Jest setup file for React testing
import '@testing-library/jest-dom';

// Mock global objects if needed
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
