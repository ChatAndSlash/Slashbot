/*eslint-env mocha */
"use strict";

const LightningStrikeSpell = require('@content/spells/lightning_strike');
const Character            = require('@app/character').Character;
const Enemy                = require('@app/content/enemies').Enemy;

describe('LightningStrikeSpell', () => {
  describe('castFighting', () => {
    it('should do a bunch of damage to enemy', () => {
      let character = new Character();
      character.setValues({ max_mp: 100, mp: 100 });
      character.enemy = new Enemy({ displayName: "BadGuy" });
      character.enemy.character = character;
      character.enemy._maxHp = 100;
      character.enemy.hp = 100;

      const spell = new LightningStrikeSpell();
      spell.getSpellDamage = jest.fn(() => 10);
      spell.getStrikesCount = jest.fn(() => 3);

      expect(spell.castFighting(character)).toEqual([
        ":zap: You call down 3 strikes of lightning, dealing *30* damage to BadGuy.",
      ]);
      expect(character.mp).toBe(70);
      expect(character.enemy.hp).toBe(70);
    });
  });
});