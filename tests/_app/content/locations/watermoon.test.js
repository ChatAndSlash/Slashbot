/*eslint-env mocha */
"use strict";

const Locations = require('@app/content/locations').Locations;
const Character = require('@app/character').Character;
const Loot      = require('@app/loot').Loot;
const LootSlot  = require('@app/loot').LootSlot;

const FLAGS = require('@constants').FLAGS;

describe('Watermoon', () => {
  describe('getEnemyLevel()', () => {
    it('should return the correct level', () => {
      let character = new Character();
      let location = Locations.new('watermoon-scholar-hallway-shortcut');

      location.getLivingDragons = jest.fn(() => 3);

      character.setValues({ level: 20 });
      expect(location.getEnemyLevel({}, character)).toBe(20);

      character.setValues({ level: 26 });
      expect(location.getEnemyLevel({}, character)).toBe(26);

      character.setValues({ level: 30 });
      expect(location.getEnemyLevel({}, character)).toBe(26);

      location.getLivingDragons = jest.fn(() => 2);

      character.setValues({ level: 30 });
      expect(location.getEnemyLevel({}, character)).toBe(30);

      character.setValues({ level: 40 });
      expect(location.getEnemyLevel({}, character)).toBe(36);

      location.getLivingDragons = jest.fn(() => 1);

      character.setValues({ level: 40 });
      expect(location.getEnemyLevel({}, character)).toBe(40);

      character.setValues({ level: 50 });
      expect(location.getEnemyLevel({}, character)).toBe(46);

      location.getLivingDragons = jest.fn(() => 1);

      character.setValues({ level: 50 });
      expect(location.getEnemyLevel({}, character)).toBe(46);

      character.setValues({ level: 60 });
      expect(location.getEnemyLevel({ isBoss: true }, character)).toBe(60);
    });
  });

  describe('getCursedChestLoot()', () => {
    it('should return the correct loot', () => {
      const location = Locations.new('watermoon-scholar-hallway-shortcut');
      expect(location.getCursedChestLoot({})).toEqual(new Loot(
        new LootSlot().addEntry(100, 'catalyst-moondrop', 7, 10),
        new LootSlot().addEntry(50, 'consumables-potion', 3, 7).addEntry(50, 'consumables-elixir', 3, 7),
        new LootSlot().addEntry(50, 'consumables-antidote', 2, 5).addEntry(50, 'consumables-smelling_salts', 2, 5),
        new LootSlot().addEntry(100, 'torch', 10, 20),
      ));
    });
  });

  // getLivingDragons()

  describe('getLeaveLabyrinthButton()', () => {
    it('should display a green button when you can leave safely', () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 5);
      character.location = Locations.new('watermoon-scholar-hallway-shortcut');
      expect(character.location.getLeaveLabyrinthButton(character)).toEqual({
        name: "leave",
        text: "Leave",
        type: "button",
        style: "primary",
        value: 'labyrinth_leave|{}'
      });
    });

    it('should display a button with a warning popup when you cannot leave safely', () => {
      const Locations = require('@app/content/locations').Locations;
      let character = new Character();
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 17);
      character.location = Locations.new('watermoon-scholar-hallway-shortcut');
      expect(character.location.getLeaveLabyrinthButton(character)).toEqual({
        name: "leave",
        text: "Leave",
        type: "button",
        value: 'labyrinth_leave|{}',
        confirm: {
          title: "Are you sure?  This labyrinth is confusing.",
          text: "If you leave now, you won't be able to get back here, to the 18th hallway.  You'll only be able to find your way back to your last checkpoint, the 15th crossroads.",
          ok_text: "Leave",
          dismiss_text: "Stay"
        }
      });
    });
  });
});