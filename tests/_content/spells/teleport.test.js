/*eslint-env mocha */
"use strict";

const Options       = require('slacksimple').Options;
const Slashbot      = require('@app/slashbot');
const Character     = require('@app/character').Character;
const Location      = require('@app/content/locations').Location;
const TeleportSpell = require('@content/spells/teleport');

const STATS = require('@constants').STATS;

describe('Teleport', () => {
  describe('castIdle', () => {
    it('should say a list of locations to teleport to', () => {
      let slashbot = new Slashbot();
      slashbot.say = jest.fn();

      let character = (new Character()).setValues();
      character.getFields = jest.fn(() => []);
      character.location = new Location();
      character.location.getDescription = jest.fn(() => "description");
      character.location.getTeleportWarning = jest.fn(() => " - teleport warning");
      character.slashbot = slashbot;

      let spell = new TeleportSpell();
      spell.getTeleportOptions = jest.fn(() => new Options());
      spell.castIdle(character);

      expect(slashbot.say).toHaveBeenCalledWith(
        "description - teleport warning",
        character,
        {
          attachments: {
            collection: [{
              actions: [{
                name: "locations",
                options: [],
                text: "Locations",
                type: "select"
              }, {
                name: "cancel",
                text: "Cancel",
                type: "button",
                value: 'look|{"resetDescription":"true"}'
              }],
              attachment_type: "default",
              color: "#3AA3E3",
              fields: [],
              title: "Where do you want to teleport to?"
            }]
          }
        }
      );
    });
  });

  describe('getTeleportOptions', () => {
    it('should get all teleport options', () => {
      let character = (new Character()).setValues();
      character.setStat(STATS.ENEMIES_KILLED, 1, 'tyrose-lair-green_dragon');
      character.setStat(STATS.ENEMIES_KILLED, 1, 'scatterslide-brown_dragon');

      const spell = new TeleportSpell();
      expect(spell.getTeleportOptions(character)).toEqual({
        collection: [{
          params: {
            action: "teleport",
            location: "tyrose"
          },
          text: "City of Tyrose, Town Center"
        }, {
          params: {
            action: "teleport",
            location: "scatterslide-campfire"
          },
          text: "Scatterslide Mines, Campfire"
        }, {
          params: {
            action: "teleport",
            location: "watermoon-gilded-exchange"
          },
          text: "Watermoon, Exchange"
        }]
      });
    });
  });
});