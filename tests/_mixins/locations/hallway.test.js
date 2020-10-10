/*eslint-env mocha */
"use strict";

const Locations       = require('@app/content/locations').Locations;
const Location        = require('@app/content/locations').Location;
const HallwayLocation = require('@mixins/location/hallway').HallwayLocation;
const Character       = require('@app/character').Character;
const Actions         = require('slacksimple').Actions;

const FLAGS           = require('@constants').FLAGS;
const CHARACTER_STATE = require('@constants').CHARACTER_STATE;

const TYPE_CROSSROADS_ENCOUNTER = 'watermoon-scholar-crossroads';

describe('HallwayLocation', () => {
  describe('doFightSuccess()', () => {
    it('should advance down the hallway', () => {
      let character = new Character();

      const ComposedHallway = HallwayLocation()(Location);
      const hallway = new ComposedHallway();
      hallway.encounterCrossroads = jest.fn();
      hallway.encounterBoss = jest.fn();

      character.setFlag(FLAGS.HALLWAY_REMAINING, 1);
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 5);
      hallway.doFightSuccess(character, []);
      expect(character.getFlag(FLAGS.HALLWAY_REMAINING)).toBe(0);
      expect(character.getFlag(FLAGS.HALLWAYS_COMPLETED)).toBe(6);
      expect(hallway.encounterCrossroads).toHaveBeenCalledWith(character, []);

      character.setFlag(FLAGS.HALLWAY_REMAINING, 1);
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 9);
      hallway.doFightSuccess(character, []);
      expect(character.getFlag(FLAGS.HALLWAY_REMAINING)).toBe(0);
      expect(character.getFlag(FLAGS.HALLWAYS_COMPLETED)).toBe(10);
      expect(hallway.encounterBoss).toHaveBeenCalledWith(character, []);
    });
  });

  // encounterBoss

  describe('chooseBoss()', () => {
    it('should choose the correct boss', () => {
      const ComposedHallway = HallwayLocation()(Location);
      const hallway = new ComposedHallway();

      expect(hallway.chooseBoss(10)).toBe('watermoon-scholar-empusa');
      expect(hallway.chooseBoss(20)).toBe('watermoon-scholar-minotaur');
      expect(hallway.chooseBoss(30)).toBe('watermoon-scholar-gorgon');
      expect(hallway.chooseBoss(40)).toBe('watermoon-scholar-black_dragon');

      expect(() => {
        hallway.chooseBoss(5);
      }).toThrowError('No boss for 5 hallways completed.');
    });
  });

  describe('encounterCrossroads()', () => {
    it('should encounter a crossroads', () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 5);
      const ComposedHallway = HallwayLocation()(Location);
      const hallway = new ComposedHallway();

      expect(hallway.encounterCrossroads(character, [])).toEqual([
        "On reaching the end of the hallway, you come to a crossroads!",
        "This crossroads is very distinctive.  You know you'll be able to find your way back here again if you leave."
      ]);
      expect(character.state).toBe(CHARACTER_STATE.ENCOUNTER);
      expect(character.encounter.type).toBe(TYPE_CROSSROADS_ENCOUNTER);
    });
  });

  describe('addMiscActions()', () => {
    it('should add the leave button', () => {
      let character = new Character();
      character.setFlag(FLAGS.HALLWAYS_COMPLETED, 5);
      character.location = Locations.new('watermoon-scholar-hallway-shortcut');

      expect(character.location.addMiscActions(character, new Actions())).toEqual({
        collection: [{
          name: "leave",
          text: "Leave",
          type: "button",
          style: "primary",
          value: 'labyrinth_leave|{}'
        }]
      });
    });
  });
});