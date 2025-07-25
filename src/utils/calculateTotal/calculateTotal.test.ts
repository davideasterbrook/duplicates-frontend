import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should calculate total from comma-separated values', () => {
    expect(calculateTotal('1,2,3')).toBe(6);
    expect(calculateTotal('10,20,30')).toBe(60);
    expect(calculateTotal('1.5,2.5,3')).toBe(7);
  });

  it('should calculate total from newline-separated values', () => {
    expect(calculateTotal('1\n2\n3')).toBe(6);
    expect(calculateTotal('10\n20\n30')).toBe(60);
    expect(calculateTotal('1.5\n2.5\n3')).toBe(7);
  });

  it('should calculate total from mixed separators', () => {
    expect(calculateTotal('1,2\n3')).toBe(6);
    expect(calculateTotal('10\n20,30')).toBe(60);
    expect(calculateTotal('1.5,2.5\n3')).toBe(7);
  });

  it('should handle single value', () => {
    expect(calculateTotal('42')).toBe(42);
    expect(calculateTotal('3.14')).toBe(3.14);
  });

  it('should handle empty string', () => {
    expect(calculateTotal('')).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(calculateTotal('-1,2,3')).toBe(4);
    expect(calculateTotal('1,-2,3')).toBe(2);
    expect(calculateTotal('-1,-2,-3')).toBe(-6);
  });

  it('should handle decimal numbers', () => {
    expect(calculateTotal('1.1,2.2,3.3')).toBeCloseTo(6.6);
    expect(calculateTotal('0.1,0.2,0.3')).toBeCloseTo(0.6);
  });

  it('should handle whitespace and extra separators', () => {
    expect(calculateTotal('1,,2,3')).toBe(6); // Empty string becomes 0
    expect(calculateTotal('1\n\n2\n3')).toBe(6); // Empty string becomes 0
  });

  it('should handle zero values', () => {
    expect(calculateTotal('0,1,2')).toBe(3);
    expect(calculateTotal('1,0,2')).toBe(3);
    expect(calculateTotal('0,0,0')).toBe(0);
  });

  it('should handle invalid numbers (NaN becomes 0)', () => {
    expect(calculateTotal('1,abc,3')).toBe(4);
    expect(calculateTotal('hello,world')).toBe(0);
  });
});
