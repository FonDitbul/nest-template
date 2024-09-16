export function CountDigits(number: number): number {
  return Math.abs(number).toString().length;
}

export function NumberToDigitsString(number: number, digits: number): string {
  let str: string = Math.abs(number).toString();
  while (str.length < digits) {
    str = '0' + str;
  }

  return str;
}

export function extractNumberFromString(input: string): number | null {
  const match = input.match(/\d+$/); // 문자열의 끝에서 숫자를 찾는 정규식
  return match ? parseInt(match[0], 10) : null; // 숫자가 있으면 정수로 변환, 없으면 null 반환
}
