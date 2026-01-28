import type { FC } from 'react';
import { SubscriptionManager } from '../../domain/services/subscription-manager';
import { NotificationService } from '../../domain/services/notification-service';
import type { SubscriptionCallback, UnsubscribeFunction } from '../../domain/types';
import { InputMapping } from '../../../../InputMapping/class';
import type { INPUT_COMPONENTS_KEYS } from '../../../../InputMapping/types';

/**
 * Extended InputMapping class with subscription system for granular rendering.
 * Allows components to subscribe only to specific fieldType changes.
 *
 * Infrastructure layer: Concrete implementation of InputMapping with subscription capabilities.
 *
 * @template Ob - The object structure defining the Inputs.
 */
export class InputMappingStore<Ob extends Record<string, any>> extends InputMapping<Ob> {
	private _subscriptionManager?: SubscriptionManager;

	/**
	 * Lazy getter for subscriptionManager to ensure it's initialized
	 * even when called during parent class construction.
	 */
	private get subscriptionManager(): SubscriptionManager {
		if (!this._subscriptionManager) {
			this._subscriptionManager = new SubscriptionManager();
		}
		return this._subscriptionManager;
	}

	/**
	 * Subscribe to changes for a specific key.
	 *
	 * @param key - The key to subscribe to (fieldType).
	 * @param callback - Callback function to execute when the key changes.
	 * @returns Unsubscribe function.
	 */
	subscribe(key: string, callback: SubscriptionCallback): UnsubscribeFunction {
		return this.subscriptionManager.subscribe(key, callback);
	}

	/**
	 * Unsubscribe from changes for a specific key.
	 *
	 * @param key - The key to unsubscribe from.
	 * @param callback - Callback function to remove.
	 */
	unsubscribe(key: string, callback: SubscriptionCallback): void {
		this.subscriptionManager.unsubscribe(key, callback);
	}

	/**
	 * Override set to notify subscribers when a new component is added.
	 */
	override set(k: keyof Ob | INPUT_COMPONENTS_KEYS, v: FC<any>): this {
		const changed = !super.has(k);
		super.set(k, v);
		if (changed) {
			NotificationService.notify(this.subscriptionManager, String(k));
		}
		return this;
	}

	/**
	 * Override delete to notify subscribers when a component is removed.
	 */
	override delete(k: keyof Ob | INPUT_COMPONENTS_KEYS): boolean {
		const result = super.delete(k);
		if (result) {
			NotificationService.notify(this.subscriptionManager, String(k));
		}
		return result;
	}

	/**
	 * Override clear to notify all subscribers when the store is cleared.
	 */
	override clear(): void {
		const keys = Array.from(this.keys()).map((k) => String(k));
		super.clear();
		NotificationService.notifyMany(this.subscriptionManager, keys);
	}
}
