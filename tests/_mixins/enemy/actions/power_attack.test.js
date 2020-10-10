/*eslint-env mocha */
"use strict";

const Enemy             = require('@app/content/enemies').Enemy;
const Character         = require('@app/character').Character;
const PowerAttackAction = require('@mixins/enemy/actions/power_attack').PowerAttackAction;

describe('PowerAttackAction', () => {
  describe('getFightActions()', () => {
    it('should set power attack action', () => {
      const PowerAttackingEnemy = PowerAttackAction(50)(Enemy);
      const enemy = new PowerAttackingEnemy();

      expect(enemy.getFightActions()).toEqual({
        doAttack: 50,
        powerAttack: 50
      });
    });
  });

  describe('powerAttack()', () => {
    it('should perform a power attack', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 100 });
      const PowerAttackingEnemy = PowerAttackAction(50)(Enemy);
      const enemy = new PowerAttackingEnemy({ displayName: "BadGuy" });

      enemy.getAttackInfo = jest.fn(() => {
        return { didDodge: true }; 
      });
      expect(enemy.powerAttack(character)).toEqual([
        ":dash: BadGuy attacks, but you dodge!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return { didMiss: true }; 
      });
      expect(enemy.powerAttack(character)).toEqual([
        "BadGuy attacks, but misses!"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didCrit: true,
          damage: 10,
          extraMessages: [],
        };
      });
      expect(enemy.powerAttack(character)).toEqual([
        "BadGuy hits you with an extra-powerful attack for *15* damage! _Critical hit!_"
      ]);
      expect(character.hp).toEqual(85);
    });
  });
});