import { FC } from 'react';
import { INPUT_COMPONENTS_KEYS } from './types';

type MergeKeys<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? T[K]
    : K extends keyof U
      ? U[K]
      : never;
};

// K extiende de INPUT_COMPONENTS_KEYS y puede incluir más claves personalizadas
export class InputMapping<
  P = object,
  K extends string = INPUT_COMPONENTS_KEYS,
> extends Map<MergeKeys<K, INPUT_COMPONENTS_KEYS>, FC<P>> {
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

  private appendObj(obj: Partial<Record<K | INPUT_COMPONENTS_KEYS, FC<P>>>) {
    const keys = Object.keys(obj) as Array<K | INPUT_COMPONENTS_KEYS>;

    type Ky = MergeKeys<K, INPUT_COMPONENTS_KEYS>;

    for (const key of keys) this.set(key as Ky, obj[key]!);

    for (const [k, v] of this.zodAdacter()) this.set(k as Ky, this.get(v)!);
  }

  constructor(obj?: Partial<Record<K | INPUT_COMPONENTS_KEYS, FC<P>>>) {
    super();

    if (!obj) return;

    this.appendObj(obj);
  }

  exists(k: string) {
    const isHas = super.has(k as MergeKeys<K, INPUT_COMPONENTS_KEYS>);

    if (!isHas) return 'fallback';

    return k as MergeKeys<K, INPUT_COMPONENTS_KEYS>;
  }

  get(k: MergeKeys<K, INPUT_COMPONENTS_KEYS> | string) {
    return super.get(k as MergeKeys<K, INPUT_COMPONENTS_KEYS>);
  }

  set(k: MergeKeys<K, INPUT_COMPONENTS_KEYS>, v: FC<P>) {
    if (!super.has(k)) super.set(k, v);

    return this;
  }

  extends(
    cb: (
      mapingp: InputMapping<P, K | INPUT_COMPONENTS_KEYS>
    ) => Record<never, FC<P>>
  ) {
    const obj = Object.fromEntries(super.entries()) as Record<string, FC<P>>;

    const extendObj = cb(
      this as unknown as InputMapping<P, K | INPUT_COMPONENTS_KEYS>
    );

    return new InputMapping<P, K | INPUT_COMPONENTS_KEYS>({
      ...obj,
      ...extendObj,
    } as Record<K | INPUT_COMPONENTS_KEYS, FC<P>>);
  }
}
