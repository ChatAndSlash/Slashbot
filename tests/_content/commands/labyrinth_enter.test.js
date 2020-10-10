/*eslint-env mocha */
"use strict";

const EnterLabyrinthCommand = require('@content/commands/labyrinth_enter');
const Character             = require('@app/character').Character;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;

describe('EnterLabyrinthCommand', () => {
  describe('execute()', () => {
    it('should begin a fight when at a boss', async () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 10);

      const command = new EnterLabyrinthCommand(character, {}, {}, {});
      command.isAtBoss = jest.fn(() => true);
      command.updateLast = jest.fn();

      await command.execute();

      expect(character.enemy.type).toBe('watermoon-scholar-empusa');
      expect(character.state).toBe(CHARACTER_STATE.FIGHTING);
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: ":white_check_mark: You head into the Labyrinth to confront the Empusa!"
          }]
        },
        doLook: true
      });
    });

    it('should begin crossroads encounter when not at boss', async () => {
      let character = new Character();

      const command = new EnterLabyrinthCommand(character, {}, {}, {});
      command.isAtBoss = jest.fn(() => false);
      command.updateLast = jest.fn();

      await command.execute();

      expect(character.encounter.type).toBe('watermoon-scholar-crossroads');
      expect(character.state).toBe(CHARACTER_STATE.ENCOUNTER);
      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: ":white_check_mark: You enter the halls of the Labyrinth."
          }]
        },
        doLook: true
      });
    });
  });

  describe('isAtBoss()', () => {
    it('should identify when at boss', () => {
      let character = new Character();
      character.location = { chooseBoss: jest.fn(() => 'boss' )};
      const command = new EnterLabyrinthCommand();

      expect(command.isAtBoss(character)).toBe(false);

      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 10);
      expect(command.isAtBoss(character)).toBe(true);

      character.setFlag(FLAGS.BOSS_DEFEATED_ + 'boss');
      expect(command.isAtBoss(character)).toBe(false);
    });
  });
});