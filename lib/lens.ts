import { atom, type WritableAtom } from 'jotai';

export type Writable<Value> = WritableAtom<Value, [Value], void>;

/**
 * `atom(initialValue)` возвращает `PrimitiveAtom`, который пишет через
 * `SetStateAction` (значение или функция-обновитель) — шире, чем простая
 * сигнатура `Writable`, которую ожидает `fieldOf`. Эта обёртка нормализует
 * такой атом до `Writable<Value>` (тот же приём, что и для `settingsAtom`
 * поверх `atomWithStorage` в `atoms/settings.ts`).
 */
export function writable<Value>(initialValue: Value): Writable<Value> {
  const raw = atom(initialValue);
  return atom(
    (get) => get(raw),
    (get, set, value: Value) => set(raw, value),
  );
}

/**
 * Единственное осознанное исключение из правила «никаких as» (см. CLAUDE.md):
 * TS не может доказать, что `{ ...S, [K]: value }` возвращает ровно `S` для
 * произвольного вычисляемого ключа `K`, хотя структурно это всегда верно.
 */
export function fieldOf<S, K extends keyof S>(parent: Writable<S>, key: K): Writable<S[K]> {
  return atom(
    (get) => get(parent)[key],
    (get, set, value: S[K]) => {
      set(parent, { ...get(parent), [key]: value } as S);
    },
  );
}
