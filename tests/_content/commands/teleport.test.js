/*eslint-env mocha */
"use strict";

const TeleportCommand = require('@content/commands/teleport');
const Character       = require('@app/character').Character;

describe('TeleportCommand', () => {
  describe('execute()', () => {
    it('should teleport you to a new location', async () => {
      let character = (new Character()).setValues();
      character.setValues({ max_mp: 100, mp: 100 });
      character.getFields = jest.fn(() => []);
      character.connection = { query: jest.fn(() => [['']]) };

      const command = new TeleportCommand(character, { info: { location: "scatterslide-campfire" } });
      command.updateLast = jest.fn();
      command.doLook = jest.fn();

      await command.execute();

      expect(command.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            title: ":comet: A blue light swirls around you and you're whisked into the air!  Seconds later, you find yourself gently deposited at Scatterslide Mines, Campfire."
          }]
        }
      });
      expect(character.location.type).toBe("scatterslide-campfire");
      expect(character.mp).toBe(50);
      expect(command.doLook).toHaveBeenCalled();
    });
  });
});