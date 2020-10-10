/*eslint-env mocha */
"use strict";

const AmethystHeartAmulet = require('@content/items/equipment/accessories/watermoon/033_amethyst_heart_amulet');
const Character           = require('@app/character').Character;

// -- Tests ----------------------------------------------------------------------------------------

describe('Amethyst Heart Amulet', () => {
  describe('doPostRoundActions()', () => {
    it('should do nothing for players with insufficient MP.', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 95, mp: 0 });

      const amulet = new AmethystHeartAmulet();
      expect(amulet.doPostRoundActions(character)).toEqual([]);
    });

    it('should do nothing for dead players', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 0, mp: 50 });

      const amulet = new AmethystHeartAmulet();
      expect(amulet.doPostRoundActions(character)).toEqual([]);
    });

    it('should do nothing for full health players', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 100, mp: 50 });

      const amulet = new AmethystHeartAmulet();
      expect(amulet.doPostRoundActions(character)).toEqual([]);
    });

    it('should heal and consume MP', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 50, mp: 50 });

      const amulet = new AmethystHeartAmulet();
      expect(amulet.doPostRoundActions(character)).toEqual([
        ":purple_heart: Your Amethyst Heart Amulet regenerates 10 HP at the cost of 4 MP."
      ]);
    });
  });
});