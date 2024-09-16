import { CountDigits, NumberToDigitsString } from './digits';

describe('CountDigits 숫자 자릿수 리턴 함수 테스트', () => {
  it('111 을 입력받아 3을 리턴하는 경우', () => {
    const given = 111;

    const result = CountDigits(given);

    expect(result).toBe(3);
  });

  it('9999 을 입력받아 3을 리턴하는 경우', () => {
    const given = 9999;

    const result = CountDigits(given);

    expect(result).toBe(4);
  });

  it('0 을 입력받아 1을 리턴하는 경우', () => {
    const given = 0;

    const result = CountDigits(given);

    expect(result).toBe(1);
  });
});

describe('NumberToFiveDigitsString 숫자를 입력받아 5자리 string 을 return 하는 함수 테스트', () => {
  it('1 를 5자리로 변경, 00001 을 리턴하는 경우', () => {
    const given = 1;

    const result = NumberToDigitsString(given, 5);

    expect(result).toBe('00001');
  });

  it('111 5자리로 변경, 00111 을 리턴하는 경우', () => {
    const given = 111;

    const result = NumberToDigitsString(given, 5);

    expect(result).toBe('00111');
  });

  it('100000 5자리로 변경, 10000을 리턴하는 경우', () => {
    const given = 100_00;

    const result = NumberToDigitsString(given, 5);

    expect(result).toBe('10000');
  });

  it('100_000 을 입력받아 100000을 리턴하는 경우', () => {
    const given = 100_000;

    const result = NumberToDigitsString(given, 5);

    expect(result).toBe('100000');
  });

  it('1 을 입력받아 01 리턴하는 경우', () => {
    const given = 1;

    const result = NumberToDigitsString(given, 2);

    expect(result).toBe('01');
  });

  it('10 을 입력받아 10 리턴하는 경우', () => {
    const given = 10;

    const result = NumberToDigitsString(given, 2);

    expect(result).toBe('10');
  });
});
