export function AddToMapArray<Key, Value>(map: Map<Key, Value[]>, key: Key, value: Value) {
  if (map.has(key)) {
    const arr = map.get(key)!;
    arr.push(value);
  } else {
    map.set(key, [value]);
  }
}
