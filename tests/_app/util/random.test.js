/*eslint-env mocha */
"use strict";

const Random = require('@util/random');

let mockMath = Object.create(global.Math);
global.Math = mockMath;

// -- Tests ----------------------------------------------------------------------------------------

describe('Random', () => {
  describe('fromArray()', () => {
    it('should pull from an array', () => {
      mockMath.random = () => 0.5;
      expect(Random.fromArray([0, 1, 2, 3, 4])).toBe(2);
    });
  });

  describe('between()', () => {
    it('should choose a random, rounded number', () => {
      mockMath.random = () => 0.5;
      expect(Random.between(0, 4)).toBe(2);
    });

    it('should choose a random, un-rounded number', () => {
      mockMath.random = () => 0.5;
      expect(Random.between(0, 4, false)).toBe(2.5);
    });
  });

  describe('getWeighted()', () => {
    it('should pick a value from a weighted array', () => {
      mockMath.random = () => 0.5;
      expect(Random.getWeighted([
        { 'weight': 10, value: 'not this' },
        { 'weight': 10, value: 'yes this' },
        { 'weight': 10, value: 'not this' },
      ])).toBe('yes this');
    });

    it('should throw an error against bad JSON', () => {
      expect(() => {
        return Random.getWeighted('asdf');
      }).toThrow(/Invalid weighted array format/);
    });
  });

  describe('drawCard()', () => {
    it('should draw a special card', () => {
      mockMath.random = () => 0.09;
      expect(Random.drawCard()).toBe("The Egg");
    });

    it('should draw a rank/suit card', () => {
      mockMath.random = () => 0.2;
      expect(Random.drawCard()).toBe("3 of Swords");
    });
  });

  describe('drawCards()', () => {
    it('should draw a few cards', () => {
      mockMath.random = () => 0.2;
      expect(Random.drawCards(3)).toEqual([
        "3 of Swords",
        "3 of Swords",
        "3 of Swords",
      ]);
    });
  });
});