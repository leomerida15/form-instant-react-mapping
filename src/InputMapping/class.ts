import { FC } from 'react';
import { INPUT_COMPONENTS_KEYS, ParsedField } from './types';

// Nuevo tipo auxiliar para mapear cada clave a su componente correspondiente
// Ahora el value depende de la key: si es de Ob, es FC<Ob[K]>; si es de INPUT_COMPONENTS_KEYS, es FC<any>
type InputComponentMap<Ob extends Record<string, any>> = {
    [K in keyof Ob]?: FC<ParsedField<Ob[K]>>;
} & {
    [K in INPUT_COMPONENTS_KEYS]?: FC<any>;
};

export class InputMapping<Ob extends Record<string, any>> extends Map<
    keyof Ob | INPUT_COMPONENTS_KEYS,
    FC<any>
> {
    private zodAdacter() {
        return Object.entries({
            ZodBoolean: 'checkbox',
            ZodDate: 'date',
            ZodEnum: 'select',
            ZodNativeEnum: 'select',
            ZodNumber: 'number',
            string: 'text',
        });
    }

    private appendObj(obj: Partial<InputComponentMap<Ob>>) {
        const keys = Object.keys(obj) as Array<keyof typeof obj>;

        for (const key of keys) {
            const value = obj[key];
            if (value && (key as string) in ({} as Ob)) {
                this.set(key as keyof Ob, value as FC<Ob[keyof Ob]>);
            } else if (value) {
                this.set(key as INPUT_COMPONENTS_KEYS, value as FC<any>);
            }
        }

        for (const [k, v] of this.zodAdacter()) {
            const existingValue = this.get(v as INPUT_COMPONENTS_KEYS);
            if (existingValue) {
                this.set(k as INPUT_COMPONENTS_KEYS, existingValue);
            }
        }
    }

    constructor(obj?: Partial<InputComponentMap<Ob>>) {
        super();
        if (!obj) return;
        this.appendObj(obj);
    }

    exists(k: string) {
        const isHas = super.has(k as keyof Ob | INPUT_COMPONENTS_KEYS);
        if (!isHas) return 'fallback';
        return k as keyof Ob | INPUT_COMPONENTS_KEYS;
    }

    get<Ky extends keyof Ob | INPUT_COMPONENTS_KEYS>(k: Ky) {
        return super.get(k);
    }

    set<K extends keyof Ob>(k: K, v: FC<Ob[K]>): this;
    set<K extends INPUT_COMPONENTS_KEYS>(k: K, v: FC<any>): this;
    set(k: keyof Ob | INPUT_COMPONENTS_KEYS, v: FC<any>): this {
        if (!super.has(k)) super.set(k, v);
        return this;
    }

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
