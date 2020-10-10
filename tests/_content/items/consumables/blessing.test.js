/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const BlessingConsumable = require('@content/items/consumables/blessing');

const FLAGS = require('@constants').FLAGS;

describe('BlessingConsumable', () => {
  describe('canBeUsed', () => {
    it('should only be used when cursed', () => {
      let character = new Character();
      let item = new BlessingConsumable();

      expect(item.canBeUsed(character)).toBe(false);

      character.setFlag(FLAGS.CURSED_TURNS, 5);
      expect(item.canBeUsed(character)).toBe(true);
    });
  });

  describe('consume()', () => {
    it('should clear burned status', () => {
      let character = new Character().setValues();
      character.inventory.add('consumables-blessing', 5);
      character.setFlag(FLAGS.CURSED_TURNS, 3);
      let item = new BlessingConsumable();

      expect(item.consume(character)).toEqual([":star2:  A warm, bright light glow around you, removing your curse and recovering *0* HP."]);
      expect(character.inventory.quantity('consumables-blessing')).toBe(4);
      expect(character.hasFlag(FLAGS.CURSED_TURNS)).toBe(false);
    });
  });
});