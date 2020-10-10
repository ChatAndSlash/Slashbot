/*eslint-env mocha */
"use strict";

const Charlie   = require('@content/items/equipment/pets/charlie');
const Character = require('@app/character').Character;

// -- Tests ----------------------------------------------------------------------------------------

describe('Charlie', () => {
  describe('doFightSuccess()', () => {
    it('should add extra gold on fight success when lucky', () => {
      let pet = new Charlie();
      pet.shouldFindGold = jest.fn(() => true);
      pet.getExtraGold = jest.fn(() => 7);

      let character = new Character();
      character.gold = 5;

      expect(pet.doFightSuccess(character, [])).toEqual(["Charlie digs excitedly nearby, uncovering an extra 7 gold that you missed!"]);
      expect(character.gold).toBe(12);
    });
  });
});