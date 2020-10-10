/*eslint-env mocha */
"use strict";

const Enemy           = require('@app/content/enemies').Enemy;
const Character       = require('@app/character').Character;
const DoNothingAction = require('@mixins/enemy/actions/do_nothing').DoNothingAction;

describe('DoNothingAction', () => {
  describe('getFightActions()', () => {
    it('should set do nothing action', () => {
      const DoingNothingEnemy = DoNothingAction(50)(Enemy);
      const enemy = new DoingNothingEnemy();

      expect(enemy.getFightActions()).toEqual({
        doAttack: 50,
        doNothing: 50
      });
    });
  });

  describe('doNothing()', () => {
    it('should do nothing', () => {
      let character = new Character();
      const DoingNothingEnemy = DoNothingAction(50)(Enemy);
      const enemy = new DoingNothingEnemy({ displayName: "BadGuy" });

      expect(enemy.doNothing(character)).toEqual([
        "BadGuy does... nothing, simply considering you."
      ]);
    });
  });
});