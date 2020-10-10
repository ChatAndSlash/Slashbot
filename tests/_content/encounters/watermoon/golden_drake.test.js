/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const GoldenDrakeEncounter = require('@content/encounters/watermoon/golden_drake');

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const ACTION_AP       = 'ap';
const ACTION_HP_MP    = 'hpmp';
const ACTION_TREASURE = 'treasure';

const TREASURE_SCALES    = 'scales';
const TREASURE_MOONDROPS = 'moondrops';
const TREASURE_GOLD      = 'gold';

describe('GoldenDrakeEncounter', () => {
  describe('doAction', () => {
    it('should call the appropriate action', async () => {
      let character = new Character();
      character.setValues({ state: CHARACTER_STATE.ENCOUNTER });
      let encounter = new GoldenDrakeEncounter();

      encounter.updateLast = jest.fn();
      encounter.doApRefill = jest.fn(() => "text");
      encounter.doHpMpRefill = jest.fn();
      encounter.doGiveTreasure = jest.fn();

      encounter.doAction(ACTION_AP, character, {}, {});
      expect(encounter.doApRefill).toHaveBeenCalledWith(character);
      expect(character.state).toBe(CHARACTER_STATE.IDLE);
      expect(encounter.updateLast).toHaveBeenCalledWith({
        attachments: {
          collection: [{
            color: "good",
            title: "text"
          }]
        },
        doLook: true
      });

      encounter.doAction(ACTION_HP_MP, character, {}, {});
      expect(encounter.doHpMpRefill).toHaveBeenCalledWith(character);

      encounter.doAction(ACTION_TREASURE, character, {}, {});
      expect(encounter.doGiveTreasure).toHaveBeenCalledWith(character);

      await expect(encounter.doAction('bad', {}, {}, {})).rejects.toHaveProperty(
        'message',
        "Uncrecognized action for watermoon-golden_drake: 'bad'"
      );
    });
  });

  describe('doApRefill', () => {
    it('should refill the characters AP', () => {
      let character = new Character();
      character.setValues({ ap: 0 });

      let encounter = new GoldenDrakeEncounter();
      expect(encounter.doApRefill(character)).toBe(
        ":white_check_mark: \"Gotcha,\" she says.  \"Just hold still!\"  She waggles her little tail at you, and a golden aura surrounds you.  You feel energized!"
      );
      expect(character.ap).toBe(character.maxAp);
    });
  });

  describe('doHpMpRefill', () => {
    it('should refill the characters HP/MP', () => {
      let character = new Character();
      character.setValues({ hp: 1, max_hp: 100, mp: 1, max_mp: 100 });

      let encounter = new GoldenDrakeEncounter();
      expect(encounter.doHpMpRefill(character)).toBe(
        ":white_check_mark: \"No worries!\" she says.  \"I got this!\"  She wriggles her little nose at you, and a feeling of wellness infuses you."
      );
      expect(character.hp).toBe(character.maxHp);
      expect(character.mp).toBe(character.maxMp);
    });
  });

  describe('doGiveTreasure', () => {
    it('should give the character a bunch of moondrops', () => {
      let character = new Character();
      character.setValues();

      let encounter = new GoldenDrakeEncounter();
      encounter.getRandomTreasureType = jest.fn(() => TREASURE_MOONDROPS);
      encounter.getNumMoondrops = jest.fn(() => 5);

      expect(encounter.doGiveTreasure(character)).toBe(
        ":white_check_mark: \"Yeah, treasure, I can dig it!\" she says.  She sniffs a couple times, looks around, then flies over to a spot on the ground and scratches an X.  \"Dig here!\" she giggles, and then flies off.  After digging a little while, you discover a leather bag containing 5 Moondrops!"
      );
      expect(character.inventory.quantity('catalyst-moondrop')).toBe(5);
    });

    it('should give the character a couple moondrops and some gold', () => {
      let character = new Character();
      character.setValues();

      let encounter = new GoldenDrakeEncounter();
      encounter.getRandomTreasureType = jest.fn(() => TREASURE_GOLD);
      encounter.getNumSmallMoondrops = jest.fn(() => 1);
      encounter.getNumSmallGold = jest.fn(() => 1050);

      expect(encounter.doGiveTreasure(character)).toBe(
        ":white_check_mark: \"Yeah, treasure, I can dig it!\" she says.  She sniffs a couple times, looks around, then flies over to a spot on the ground and scratches an X.  \"Dig here!\" she giggles, and then flies off.  After digging a little while, you discover a leather bag containing 1 Moondrop and 1050 gold!"
      );
      expect(character.inventory.quantity('catalyst-moondrop')).toBe(1);
      expect(character.gold).toBe(1050);
    });

    it('should give the character some dragon scales', () => {
      let character = new Character();
      character.setValues();

      let encounter = new GoldenDrakeEncounter();
      encounter.getRandomTreasureType = jest.fn(() => TREASURE_SCALES);
      encounter.getNumScales = jest.fn(() => 3);

      expect(encounter.doGiveTreasure(character)).toBe(
        ":white_check_mark: \"Yeah, treasure, I can dig it!\" she says.  She sniffs a couple times, looks around, then flies over to a spot on the ground and scratches an X.  \"Dig here!\" she giggles, and then flies off.  After digging a little while, you discover a leather bag containing 3 Dragon Scales!"
      );
      expect(character.scales).toBe(3);
    });
  });
});