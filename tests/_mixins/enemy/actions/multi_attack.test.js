/*eslint-env mocha */
"use strict";

const Enemy             = require('@app/content/enemies').Enemy;
const Character         = require('@app/character').Character;
const MultiAttackAction = require('@mixins/enemy/actions/multi_attack').MultiAttackAction;

describe('MultiAttackAction', () => {
  describe('getFightActions()', () => {
    it('should set reckless attack action', () => {
      const MultiAttackingEnemy = MultiAttackAction(50)(Enemy);
      const enemy = new MultiAttackingEnemy();

      expect(enemy.getFightActions()).toEqual({
        doAttack: 50,
        multiAttack: 50
      });
    });
  });

  describe('multiAttack()', () => {
    it('should perform a multi attack', () => {
      let character = new Character();
      character.setValues({ max_hp: 100, hp: 100 });
      const MultiAttackingEnemy = MultiAttackAction(50, {
        minAttacks: 2,
        maxAttacks: 2,
        dodgeText: "dodgeText",
        missText: "missText",
        attackText: "attackText",
        preText: "preText",
      })(Enemy);
      const enemy = new MultiAttackingEnemy({ displayName: "BadGuy" });
      enemy.hp = 100;

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didDodge: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.multiAttack(character)).toEqual([
        "preText",
        "dodgeText",
        "dodgeText",
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didMiss: true,
          extraMessages: [],
        }; 
      });
      expect(enemy.multiAttack(character)).toEqual([
        "preText",
        "missText",
        "missText"
      ]);

      enemy.getAttackInfo = jest.fn(() => {
        return {
          didCrit: true,
          damage: 15,
          extraMessages: [],
        };
      });
      expect(enemy.multiAttack(character)).toEqual([
        "preText",
        "attackText",
        "attackText"
      ]);
      expect(character.hp).toEqual(70);
    });
  });

  describe('getNumberOfAttacks()', () => {
    it('should choose between the min and max provided', () => {
      const MultiAttackingEnemy = MultiAttackAction(50, {
        minAttacks: 20,
        maxAttacks: 30,
      })(Enemy);
      const enemy = new MultiAttackingEnemy();

      const numAttacks = enemy.getNumberOfAttacks();
      expect(numAttacks).toBeLessThanOrEqual(30);
      expect(numAttacks).toBeGreaterThanOrEqual(20);
    });
  });
});