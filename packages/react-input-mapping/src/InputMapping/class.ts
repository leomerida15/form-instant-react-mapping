import type { FC } from 'react';
import type { FieldConfig, INPUT_COMPONENTS_KEYS } from '.';

/**
 * Auxiliary type to map each key to its corresponding React component.
 * Values can either be specific Input types from the generic object `Ob`
 * or predefined keys from `INPUT_COMPONENTS_KEYS`.
 *
 * @template Ob - The object structure defining the Inputs and their types.
 */
type InputComponentMap<Ob extends Record<string, any>> = {
    [K in keyof Ob]?: FC<FieldConfig<Ob[K]>>;
} & {
        [K in INPUT_COMPONENTS_KEYS]?: FC<any>;
    };

/**
 * Class representing a mapping between Input keys and React components.
 * Extends the native `Map` class to handle component associations for specific object Inputs
 * and generic input component keys.
 *
 * @template Ob - The object structure defining the Inputs.
 */
export class InputMapping<Ob extends Record<string, any>> extends Map<
    keyof Ob | INPUT_COMPONENTS_KEYS,
    FC<any>
> {

    /**
     * Internal method to populate the mapping from a partial object.
     *
     * @param obj - A partial mapping of keys to components.
     * @private
     */
    private appendObj(obj: Partial<InputComponentMap<Ob>>) {
        for (const k in obj) this.set(k as INPUT_COMPONENTS_KEYS, obj[k] as FC<any>);
    }

    /**
     * Initializes a new instance of the InputMapping class.
     *
     * @param obj - An optional initial set of key-to-component mappings.
     */
    constructor(obj?: Partial<InputComponentMap<Ob>>) {
        super();
        if (!obj) return;
        this.appendObj(obj);
    }

    /**
     * Checks if a specific key exists in the mapping.
     *
     * @param k - The key to check.
     * @returns The key itself if it exists, otherwise returns 'fallback'.
     */
    exists(k: string) {
        const isHas = super.has(k as keyof Ob | INPUT_COMPONENTS_KEYS);
        if (!isHas) return 'fallback';
        return k as keyof Ob | INPUT_COMPONENTS_KEYS;
    }

    /**
     * Retrieves the component associated with a specific key.
     *
     * @template Ky - The type of the key, which must be a key of `Ob` or `INPUT_COMPONENTS_KEYS`.
     * @param k - The key to retrieve the component for.
     * @returns The React component associated with the key, or undefined if not found.
     */
    override get<Ky extends keyof Ob | INPUT_COMPONENTS_KEYS>(k: Ky) {
        return super.get(k);
    }

    /**
     * Associates a React component with a specific Input from the object `Ob`.
     *
     * @template K - A key from the object structure `Ob`.
     * @param k - The key to set.
     * @param v - The React component to associate with the key.
     * @returns The current class instance for method chaining.
     */
    override set<K extends keyof Ob>(k: K, v: FC<Ob[K]>): this;
    /**
     * Associates a React component with a predefined input component key.
     *
     * @template K - A key from the `INPUT_COMPONENTS_KEYS` type.
     * @param k - The key to set.
     * @param v - The React component to associate with the key.
     * @returns The current class instance for method chaining.
     */
    override set<K extends INPUT_COMPONENTS_KEYS>(k: K, v: FC<any>): this;
    /**
     * Implementation of the set method.
     *
     * @param k - The key to set (either from `Ob` or `INPUT_COMPONENTS_KEYS`).
     * @param v - The React component to associate with the key.
     * @returns The current class instance.
     */
    override set(k: keyof Ob | INPUT_COMPONENTS_KEYS, v: FC<any>): this {
        if (!super.has(k)) super.set(k, v);
        return this;
    }

    /**
     * Creates a new `InputMapping` instance by extending the current mapping with new associations.
     * Useful for building complex mappings incrementally.
     *
     * @template Ext - The type representing the additional mappings.
     * @param cb - A callback function that receives the current mapping and returns the extensions.
     * @returns A new `InputMapping` instance containing both original and extended mappings.
     */
    extends<Ext extends Record<string, FC<any>>>(
        cb: (mapping: InputMapping<Ob & { [K in keyof Ext]: any }>) => Ext,
    ) {
        const obj = Object.fromEntries(super.entries()) as Partial<
            InputComponentMap<Ob & { [K in keyof Ext]: any }>
        >;
        const extendObj = cb(this as InputMapping<Ob & { [K in keyof Ext]: any }>);
        return new InputMapping<Ob & { [K in keyof Ext]: any }>({
            ...obj,
            ...extendObj,
        });
    }
}
