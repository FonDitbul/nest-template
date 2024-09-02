import { AddToMapArray } from './map.util';

describe('AddToMapArray 함수 테스트', () => {
  it('Map에 새로운 값이 들어간 경우', () => {
    const givenMap: Map<number, number[]> = new Map();

    AddToMapArray(givenMap, 1, 1);
    const result = givenMap.get(1)!;

    expect(result.length).toBe(1);
    expect(result[0]).toBe(1);
  });

  it('Map에 값이 존재하며 array에 추가된 경우', () => {
    const givenMap: Map<number, number[]> = new Map();

    AddToMapArray(givenMap, 1, 1);
    AddToMapArray(givenMap, 1, 2);
    AddToMapArray(givenMap, 1, 3);

    const result = givenMap.get(1)!;

    expect(result.length).toBe(3);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(3);
  });
});
