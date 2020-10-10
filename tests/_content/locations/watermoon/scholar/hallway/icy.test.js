/*eslint-env mocha */
"use strict";

const Character  = require('@app/character').Character;
const Enemy      = require('@app/content/enemies').Enemy;
const IcyHallway = require('@content/locations/watermoon/scholar/hallway/icy');

const FLAGS = require('@constants').FLAGS;

describe('Icy Hallway', () => {
  describe('doFightTurnStart()', () => {
    it('add cannot dodge flag to both character and enemy', () => {
      const character = new Character();
      character.enemy = new Enemy();

      const hallway = new IcyHallway();
      hallway.doFightTurnStart(character, []);

      expect(character.hasFlag(FLAGS.CANNOT_DODGE)).toBe(true);
      expect(character.enemy.hasFlag(FLAGS.CANNOT_DODGE)).toBe(true);
    });
  });

  describe('chooseEnemy()', () => {
    it('should add text to combat beginning', () => {
      let character = new Character();
      let hallway = new IcyHallway();
      const message = { text: 'text' };

      character.setValues({ level: 22 });
      character.location = hallway;
      hallway.getPoisonDamage = jest.fn(() => 10);
      hallway.pickRandomEnemy = jest.fn(() => 'watermoon-scholar-hallways-amphisbaena');

      expect(hallway.chooseEnemy(character, message)).toEqual(
        ":white_check_mark: You encountered a L22 Amphisbaena.\n:snowflake: The ground beneath you is icy and slippery.  You and your opponent must concentrate on your footing, and as a result, neither will be able to dodge!"
      );
    });
  });
});