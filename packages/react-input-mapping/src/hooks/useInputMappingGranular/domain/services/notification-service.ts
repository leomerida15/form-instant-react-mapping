import type { SubscriptionManager } from './subscription-manager';

/**
 * Service responsible for notifying subscribers about changes.
 * Single Responsibility: Handle notification logic.
 * 
 * @internal
 */
export class NotificationService {
	/**
	 * Notify all listeners for a specific key.
	 * 
	 * @param subscriptionManager - The subscription manager instance.
	 * @param key - The key that changed.
	 */
	static notify(subscriptionManager: SubscriptionManager, key: string): void {
		const listeners = subscriptionManager.getListeners(key);
		if (listeners) {
			listeners.forEach((callback) => callback());
		}
	}

	/**
	 * Notify all listeners for multiple keys.
	 * 
	 * @param subscriptionManager - The subscription manager instance.
	 * @param keys - Array of keys that changed.
	 */
	static notifyMany(subscriptionManager: SubscriptionManager, keys: string[]): void {
		keys.forEach((key) => this.notify(subscriptionManager, key));
	}
}
