/*eslint-env mocha */
"use strict";

const Num = require('@util/num');

// -- Tests ----------------------------------------------------------------------------------------

describe('Num', () => {
  describe('fib()', () => {
    it('should calculate fibonacci sequence correctly', () => {
      expect(Num.fib(1)).toBe(1);
      expect(Num.fib(2)).toBe(2);
      expect(Num.fib(3)).toBe(3);
      expect(Num.fib(4)).toBe(5);
      expect(Num.fib(10)).toBe(89);
    });

    it('should calculate fibonacci sequences quickly', () => {
      let start = process.hrtime();
      Num.fib(100);
      let end = process.hrtime(start);

      // Shouldn't take even half a millisecond
      expect(end[1]).toBeLessThan(500000);
    });
  });

  describe('getIncreaseForPercentage()', () => {
    it('should error out when not a percentage', () => {
      expect(() => {
        Num.getIncreaseForPercentage(5, 1.5);
      }).toThrowError("Percentage must be < 1, is actually: '1.5'.");
    });

    it('should properly get the increase', () => {
      expect(Num.getIncreaseForPercentage(99, 0.01)).toBe(1);
      expect(Num.getIncreaseForPercentage(100, 0.1)).toBe(12);
      expect(Num.getIncreaseForPercentage(100, 0)).toBe(0);
    });
  });

  describe('bound()', () => {
    it('should properly bound numbers', () => {
      expect(Num.bound(5, 0, 10)).toBe(5);
      expect(Num.bound(-5, 0, 10)).toBe(0);
      expect(Num.bound(50, 0, 10)).toBe(10);
    });
  });

  describe('roundToMultiple()', () => {
    it('should round to the multiple of a number', () => {
      expect(Num.roundToMultiple(126, 25)).toBe(125);
      expect(Num.roundToMultiple(149, 25)).toBe(150);
      expect(Num.roundToMultiple(1, 25)).toBe(0);
    });
  });
});