/*eslint-env mocha */
"use strict";

const Ambrosia  = require('@content/items/consumables/ambrosia');
const Character = require('@app/character').Character;

const CHARACTER_STATE = require('@constants').CHARACTER_STATE;
const FLAGS           = require('@constants').FLAGS;
const STATS           = require('@constants').STATS;

const TYPE_AMBROSIA = 'consumables-ambrosia';

// -- Tests ----------------------------------------------------------------------------------------

describe('Ambrosia', () => {
  describe('canBeUsed()', () => {
    it('can only be used when missing hp or mp', () => {
      let character = new Character();
      let ambrosia = new Ambrosia;

      character.setValues({ max_hp: 50, hp: 49 });
      expect(ambrosia.canBeUsed(character)).toBe(true);

      character.setValues({ max_mp: 30, hp: 29 });
      expect(ambrosia.canBeUsed(character)).toBe(true);

      character.setValues();
      expect(ambrosia.canBeUsed(character)).toBe(false);
    });
  });

  describe('consume()', () => {
    let ambrosia, character = {};

    beforeEach(() => {
      ambrosia = new Ambrosia;
      character = new Character().setValues();
      character.inventory.add(TYPE_AMBROSIA, 3);
    });

    it('should be consumed', () => {
      ambrosia.consume(character);

      expect(character.inventory.quantity(TYPE_AMBROSIA)).toBe(2);
      expect(character.getStat(STATS.ITEMS_CONSUMED, TYPE_AMBROSIA)).toBe(1);
    });

    it('should heal and restore all missing hp and mp', () => {
      character.setValues({ max_hp: 50, hp: 45 });
      character.inventory.add(TYPE_AMBROSIA, 3);
      expect(ambrosia.consume(character)).toEqual([":yum: You uncork the bottle and imbibe the honey-like liquid inside.  You heal 5 HP."]);

      character.setValues({ max_mp: 30, mp: 20 });
      character.inventory.add(TYPE_AMBROSIA, 3);
      expect(ambrosia.consume(character)).toEqual([":yum: You uncork the bottle and imbibe the honey-like liquid inside.  You restore 10 MP."]);

      character.setValues({ max_hp: 50, hp: 45, max_mp: 30, mp: 20 });
      character.inventory.add(TYPE_AMBROSIA, 3);
      expect(ambrosia.consume(character)).toEqual([":yum: You uncork the bottle and imbibe the honey-like liquid inside.  You heal 5 HP and restore 10 MP."]);
    });

    it('should allow only one consumption in a fight', () => {
      character.state = CHARACTER_STATE.FIGHTING;

      ambrosia.consume(character);
      expect(character.hasFlag(FLAGS.AMBROSIA_FIGHT_USE)).toBe(true);

      expect(ambrosia.consume(character)).toEqual([":warning: You can only use 1 Ambrosia per fight."]);
    });
  });
});