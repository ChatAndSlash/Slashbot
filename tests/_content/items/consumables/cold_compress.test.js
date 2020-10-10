/*eslint-env mocha */
"use strict";

const Character              = require('@app/character').Character;
const ColdCompressConsumable = require('@content/items/consumables/cold_compress');

const FLAGS = require('@constants').FLAGS;

describe('ColdCompressConsumable', () => {
  describe('consume()', () => {
    it('should clear burned status', () => {
      let character = new Character().setValues();
      character.inventory.add('consumables-cold_compress', 5);
      character.addStatusBurned(2);

      const item = new ColdCompressConsumable();
      item.consume(character);

      expect(character.inventory.quantity('consumables-cold_compress')).toBe(4);
      expect(character.hasFlag(FLAGS.BURNED_TURNS)).toBe(false);
    });
  });
});