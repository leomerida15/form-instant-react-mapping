/**
 * Granular rendering hooks for InputMapping.
 * 
 * This module provides:
 * - InputMappingStore: Extended InputMapping with subscription system
 * - createInputMappingGranularHook: Factory for creating granular hooks
 * 
 * Architecture: Hexagonal (Domain/Application/Infrastructure)
 * Principles: SOLID (SRP, OCP, DIP)
 */

export { InputMappingStore } from './infrastructure/store/input-mapping-store';
export { createInputMappingGranularHook } from './application/factory/create-granular-hook';

// Re-export types for convenience
export type { SubscriptionCallback, UnsubscribeFunction } from './domain/types';
