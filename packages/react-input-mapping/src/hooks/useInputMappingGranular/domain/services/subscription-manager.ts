import type { SubscriptionCallback, UnsubscribeFunction } from '../types';

/**
 * Manages subscriptions for specific keys.
 * Single Responsibility: Handle subscription and unsubscription operations.
 * 
 * @internal
 */
export class SubscriptionManager {
	private readonly listeners = new Map<string, Set<SubscriptionCallback>>();

	/**
	 * Subscribe to changes for a specific key.
	 * 
	 * @param key - The key to subscribe to.
	 * @param callback - Callback function to execute when the key changes.
	 * @returns Unsubscribe function.
	 */
	subscribe(key: string, callback: SubscriptionCallback): UnsubscribeFunction {
		if (!this.listeners.has(key)) {
			this.listeners.set(key, new Set());
		}
		this.listeners.get(key)!.add(callback);
		return () => this.unsubscribe(key, callback);
	}

	/**
	 * Unsubscribe from changes for a specific key.
	 * 
	 * @param key - The key to unsubscribe from.
	 * @param callback - Callback function to remove.
	 */
	unsubscribe(key: string, callback: SubscriptionCallback): void {
		this.listeners.get(key)?.delete(callback);
	}

	/**
	 * Get all listeners for a specific key.
	 * 
	 * @param key - The key to get listeners for.
	 * @returns Set of callbacks for the key, or undefined if no listeners.
	 * @internal
	 */
	getListeners(key: string): Set<SubscriptionCallback> | undefined {
		return this.listeners.get(key);
	}

	/**
	 * Check if there are any listeners for a key.
	 * 
	 * @param key - The key to check.
	 * @returns True if there are listeners, false otherwise.
	 * @internal
	 */
	hasListeners(key: string): boolean {
		return this.listeners.has(key) && this.listeners.get(key)!.size > 0;
	}

	/**
	 * Clear all subscriptions.
	 * 
	 * @internal
	 */
	clear(): void {
		this.listeners.clear();
	}
}
