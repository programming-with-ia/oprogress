

export function toBarPerc(n: number, direction: 'ltr' | 'rtl'): number {
  if (direction === 'rtl') return (1 - n) * 100;
  return (-1 + n) * 100;
}
