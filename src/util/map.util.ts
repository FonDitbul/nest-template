export function AddToMapArray<Key, Value>(map: Map<Key, Value[]>, key: Key, value: Value) {
  if (map.has(key)) {
    const arr = map.get(key)!;
    arr.push(value);
  } else {
    map.set(key, [value]);
  }
}

export function listToMap<T, K>(list: T[], getKey: (item: T) => K): Map<K, T> {
  const map = new Map<K, T>();

  for (const item of list) {
    const key = getKey(item);
    map.set(key, item);
  }

  return map;
}

export function listToMapValue<T, K, V>(list: T[], getKey: (item: T) => K, getValue: (item: T) => V): Map<K, V> {
  const map = new Map<K, V>();

  for (const item of list) {
    const key = getKey(item);
    const value = getValue(item);
    map.set(key, value);
  }

  return map;
}
