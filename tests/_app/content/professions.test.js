/* eslint-env mocha */
/* eslint-disable no-console */
"use strict";

const Profession = require('@app/content/professions').Profession;
const Character  = require('@app/character').Character;
const Weapon     = require("@app/content/items/equipment/weapons");

const PROPERTIES = require('@constants').PROPERTIES;
const FLAGS      = require('@constants').FLAGS;

// -- Tests ----------------------------------------------------------------------------------------

describe('Profession', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('canDoSkill()/getSkillErrorMessage()', () => {
    it('should disable skills for correct reasons', () => {
      let character = new Character();
      let profession = new Profession();
      const skillDetails = { properties: [PROPERTIES.IS_ATTACK], cost: 2 };

      // Concuss
      character.setFlag(FLAGS.CONCUSSED_TURNS, 2);
      expect(profession.canDoSkill(character, 'any')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'any')).toBe(":warning: You cannot use any skills while concussed.");
      character.clearFlag(FLAGS.CONCUSSED_TURNS);

      // Soothe
      profession.getSkills = jest.fn(() => {
        return { 'soothe': skillDetails }; 
      });
      character.setFlag(FLAGS.FIGHT_COOLDOWN_SOOTHE, 2);
      expect(profession.canDoSkill(character, 'soothe')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'soothe')).toBe(":warning: You can only use Soothe once per fight.");
      character.clearFlag(FLAGS.FIGHT_COOLDOWN_SOOTHE);

      // Evade
      profession.getSkills = jest.fn(() => {
        return { 'evade': skillDetails }; 
      });
      character.setFlag(FLAGS.IS_EVADING);
      expect(profession.canDoSkill(character, 'evade')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'evade')).toBe(":warning: You are already evading.");
      character.clearFlag(FLAGS.IS_EVADING);

      // Focus
      character.setFlag(FLAGS.IS_FOCUSED);
      expect(profession.canDoSkill(character, 'focus')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'focus')).toBe(":warning: You are already focused.");
      character.clearFlag(FLAGS.IS_FOCUSED);

      // Jammed
      character.setFlag(FLAGS.IS_JAMMED);
      expect(profession.canDoSkill(character, 'evade')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'evade')).toBe(":warning: Your gun is jammed!");
      character.clearFlag(FLAGS.IS_JAMMED);

      // Out of Ammo
      character.weapon = new Weapon();
      character.weapon.needsReloading = jest.fn(() => true);
      expect(profession.canDoSkill(character, 'evade')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'evade')).toBe(":warning: You're out of ammo!");
      character.weapon.needsReloading = jest.fn(() => false);

      // Quick Reload
      profession.getSkills = jest.fn(() => {
        return { 'quick_reload': skillDetails }; 
      });
      expect(profession.canDoSkill(character, 'quick_reload')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'quick_reload')).toBe(":warning: Only guns can be reloaded.");

      // Riposte
      profession.getSkills = jest.fn(() => {
        return { 'riposte': skillDetails }; 
      });
      character.setFlag(FLAGS.RIPOSTE_COOLDOWN_TURNS, 2);
      expect(profession.canDoSkill(character, 'riposte')).toBe(false);
      expect(profession.getSkillErrorMessage(character, 'riposte')).toBe(":warning: You are recovering from your Riposte for 2 more turns.");
      character.clearFlag(FLAGS.RIPOSTE_COOLDOWN_TURNS, 2);

      // Stamina
      character._stamina = 3;
      profession.getSkills = jest.fn(() => {
        return { 'other': skillDetails }; 
      });
      expect(profession.canDoSkill(character, 'other')).toBe(true);
      expect(profession.getSkillErrorMessage(character, 'other')).toBe(":warning: You don't have enough Stamina to do that!");
    });
  });
});