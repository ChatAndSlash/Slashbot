/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const HotChocolateConsumable = require('@content/items/consumables/hot_chocolate');

const FLAGS = require('@constants').FLAGS;

describe('HotChocolateConsumable', () => {
  describe('consume()', () => {
    it('should clear chilled status', () => {
      let character = new Character().setValues();
      character.addStatusChilled(3);
      character.inventory.add('consumables-hot_chocolate', 5);

      const item = new HotChocolateConsumable();
      item.consume(character);

      expect(character.inventory.quantity('consumables-hot_chocolate')).toBe(4);
      expect(character.hasFlag(FLAGS.CHILLED_TURNS)).toBe(false);
    });
  });
});