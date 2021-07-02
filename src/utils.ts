import ColorConvert from 'color-convert';

export function normalizeValue(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

export function colorConverter(hexColor: string) {
  return ColorConvert.hex.hsv(hexColor ?? '#fff');
}
