/*eslint-env mocha */
"use strict";

const Enemy         = require('@app/content/enemies').Enemy;
const ExplodeAction = require('@mixins/enemy/actions/explode').ExplodeAction;

describe('ExplodeAction', () => {
  describe('getFightActions()', () => {
    it('should set explode action at low enough floor', () => {

      const ExplodingEnemy = ExplodeAction(100, 0.5, 1)(Enemy);
      const enemy = new ExplodingEnemy();

      enemy.hp = 49;
      enemy.maxHp = 100;
      expect(enemy.getFightActions()).toEqual({ explode: 100 });

      enemy.hp = 50;
      enemy.maxHp = 100;
      expect(enemy.getFightActions()).toEqual({ explode: 100 });

      enemy.hp = 51;
      enemy.maxHp = 100;
      expect(enemy.getFightActions()).toEqual({ doAttack: 100 });
    });
  });

  describe('explode()', () => {
    it('should explode correctly', () => {

      const ExplodingEnemy = ExplodeAction(100, 1, 0.1)(Enemy);
      const enemy = new ExplodingEnemy();

      enemy._displayName = 'displayName';
      enemy.hp = 10;
      enemy.maxHp = 100;

      let character = {
        decreaseHp: jest.fn()
      };

      let messages = enemy.explode(character);

      expect(enemy.hp).toBe(0);
      expect(character.decreaseHp).toHaveBeenCalledWith(10);
      expect(messages).toEqual(["displayName explodes into tiny bits, dealing 10 damage to you and grossing you out as well."]);
    });
  });
});