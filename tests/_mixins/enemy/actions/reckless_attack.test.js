/*eslint-env mocha */
"use strict";

const Enemy                = require('@app/content/enemies').Enemy;
const Character            = require('@app/character').Character;
const RecklessAttackAction = require('@mixins/enemy/actions/reckless_attack').RecklessAttackAction;

describe('RecklessAttackAction', () => {
  describe('getFightActions()', () => {
    it('should set reckless attack action', () => {
      const RecklessAttackingEnemy = RecklessAttackAction(50)(Enemy);
      const enemy = new RecklessAttackingEnemy();

      expect(enemy.getFightActions()).toEqual({
        doAttack: 50,
        recklessAttack: 50
      });
    });
  });

  describe('recklessAttack()', () => {
    it('should perform a reckless attack', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 100 });
      const RecklessAttackingEnemy = RecklessAttackAction(50)(Enemy);
      const enemy = new RecklessAttackingEnemy({ displayName: "BadGuy" });
      enemy.hp = 100;

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didDodge: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.recklessAttack(character)).toEqual([
        ":dash: BadGuy attacks, but you dodge!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didMiss: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.recklessAttack(character)).toEqual([
        "BadGuy attacks, but misses!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didCrit: true,
          damage: 10,
          extraMessages: [],
        };
      });
      expect(enemy.recklessAttack(character)).toEqual([
        "BadGuy attacks you recklessly, dealing *20* damage and taking *4* damage in return! _Critical hit!_"
      ]);
      expect(character.hp).toEqual(80);
      expect(enemy.hp).toEqual(96);
    });
  });
});