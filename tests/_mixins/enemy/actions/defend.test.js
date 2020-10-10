/*eslint-env mocha */
"use strict";

const Enemy        = require('@app/content/enemies').Enemy;
const DefendAction = require('@mixins/enemy/actions/defend').DefendAction;

const FLAG_IS_DEFENDING = 'is_defending';

describe('DefendAction', () => {
  describe('chooseFightAction()', () => {
    it('should set defending flag when defending', () => {
      const DefendingEnemy = DefendAction(100)(Enemy);
      const enemy = new DefendingEnemy();

      enemy.chooseFightAction({});
      expect(enemy.hasFlag(FLAG_IS_DEFENDING));
    });
  });

  describe('getFightActions()', () => {
    it('should set defend action weight', () => {
      const DefendingEnemy = DefendAction(50)(Enemy);
      const enemy = new DefendingEnemy();

      expect(enemy.getFightActions({})).toEqual({
        doAttack: 50,
        defend: 50
      });
    });
  });

  describe('defend()', () => {
    it('should defend against attacks', () => {
      const DefendingEnemy = DefendAction(50)(Enemy);
      const enemy = new DefendingEnemy({ displayName: "BadGuy", isAre: "is" });

      expect(enemy.defend({})).toEqual(
        "BadGuy was defending against your attacks!"
      );
    });
  });

  describe('doDefenderPostAttackProcessing()', () => {
    it('should take half damage when defending', () => {
      const DefendingEnemy = DefendAction(50)(Enemy);
      const enemy = new DefendingEnemy({ displayName: "BadGuy", isAre: "is" });

      enemy.setFlag(FLAG_IS_DEFENDING);
      expect(enemy.doDefenderPostAttackProcessing({ damage: 10 }, {})).toEqual({ damage: 5 });
      expect(enemy.hasFlag(FLAG_IS_DEFENDING)).toBe(false);
    });
  });
});

// end of turn should have # of turns concussed added to it