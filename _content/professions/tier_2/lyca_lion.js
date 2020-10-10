"use strict";

const Combat            = require('@app/combat');
const LycaTransformBase = require('@content/professions/tier_2/lyca_transform_base');
const { between }       = require('@util/random');

const {
  PROFESSIONS,
  PROPERTIES,
  FLAGS,
} = require('@constants');

const SKILL_LEAP      = 'leap';
const STAMINA_LEAP    = 1;
const LEAP_MULTIPLIER = 0.3;
const LEAP_PROPERTIES = [
  PROPERTIES.IS_ATTACK,
];

const SKILL_ROAR      = 'roar';
const STAMINA_ROAR    = 1;
const ROAR_MULTIPLIER = 3;
const ROAR_PROPERTIES = [];
const FLAG_ROAR       = 'roar';

const SKILL_POUNCE      = 'pounce';
const STAMINA_POUNCE    = 1;
const POUNCE_MULTIPLIER = 2;
const POUNCE_PROPERTIES = [
  PROPERTIES.IS_ATTACK,
  PROPERTIES.RANGED_ATTACK,
];

/**
 * Plural is "Lycae".
 */
class Lyon extends LycaTransformBase {
  constructor() {
    super({
      type: PROFESSIONS.LYCA,
      displayName: "Lyon",
      description: "",
      details: "",
      image: 'professions/lyca.png',
    });
  }

  /**
   * Get the offence stat for Lycae.
   *
   * When not transformed:
   * 0.4 Force + 0.4 Technique = 0.8
   *
   * When transformed:
   * - Wolf: 0.6 Force + 0.6 Technique = 1.2
   * - Bear: 1.2 Force = 1.2
   * - Lion: 1.2 Technique = 1.2
   * - Dragon: 0.6 Force + 0.6 Technique
   *
   * @param {Character} character - The character to get the offence stat for.
   *
   * @return {integer}
   */
  getOffence(character) {
    return character.technique * 1.2;
  }

  /**
   * Get the skills the provided character has access to from this profession.
   *
   * NB: Can't call canDoSkill in here, as it will recurse indefinitely.
   *
   * @param {Character} character - The character getting the skills of this profession.
   * @param {boolean} addSupport - Add selected Support Skill.
   *
   * @return {object}
   */
  getSkills(character, addSupport = true) {
    let skills = {
      [SKILL_LEAP]: {
        name: "Leap",
        description: "Smack your enemy quickly while leaping to range, with a 50% chance to stun.",
        cost: STAMINA_LEAP,
        properties: LEAP_PROPERTIES,
      },
      [SKILL_ROAR]: {
        name: "Roar",
        description: "Gain double-damage bonus for next attack and either stun your opponent or regain stamina.",
        cost: STAMINA_ROAR,
        properties: ROAR_PROPERTIES,
      },
      [SKILL_POUNCE]: {
        name: "Pounce",
        description: "Deal 3x damage from range.",
        cost: STAMINA_POUNCE,
        properties: POUNCE_PROPERTIES,
      },
    };

    if (addSupport) {
      skills = this.addSupportSkill(character, skills);
    }

    return skills;
  }

  /**
   * Lycae forms can always use their skills.
   *
   * @param {array} dbRow - The database row to extract the trained skills from.
   * @param {string} type - The type of profession being loaded.
   * @param {Character} character - The character loading the skills.
   *
   * @return {array}
   */
  getTrained(dbRow, type, character) {
    return {
      [SKILL_LEAP]: true,
      [SKILL_ROAR]: true,
      [SKILL_POUNCE]: true,
    };
  }

  /**
   * Perform a specific combat skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} type - The type of the skill to perform.
   *
   * @return {array} Messages arising from the skill.
   */
  doSkill(character, type) {
    if (SKILL_LEAP === type) {
      return this.doSkillLeap(character);
    }
    else if (SKILL_ROAR === type) {
      return this.doSkillRoar(character);
    }
    else if (SKILL_POUNCE === type) {
      return this.doSkillPounce(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Deal 1/2x damage, 75% chance of stunning enemy, and leap to ranged.
   *
   * @param {Character} character - The character doing the biting.
   *
   * @return {array}
   */
  doSkillLeap(character) {
    let messages = [];
    character.stamina -= STAMINA_LEAP;

    let stunText = "";

    if (between(1, 4) > 1) {
      character.enemy.setFlag(FLAGS.STUNNED_TURNS, 1);
      stunText = ", stunning them,";
    }

    messages = messages.concat(Combat.doAttack(character, {
      message: `:angry: You swat %2$s for %1$s damage${stunText} and leap away!%3$s`,
      multiplier: LEAP_MULTIPLIER * (character.hasFlag(FLAG_ROAR) ? ROAR_MULTIPLIER : 1),
    }, LEAP_PROPERTIES));

    character.setFlag(FLAGS.IS_RANGED);
    character.clearFlag(FLAG_ROAR);

    return messages;
  }

  /**
   * Gain triple damage bonus for next attack and either stun your opponent or regain stamina.
   *
   * @param {Character} character - The character doing the biting.
   *
   * @return {array}
   */
  doSkillRoar(character) {
    let messages;
    character.stamina -= STAMINA_ROAR;
    character.setFlag(FLAG_ROAR);

    // Either stun for 1 turn
    if (between(1, 2) === 1) {
      character.enemy.setFlag(FLAGS.STUNNED_TURNS, 1);
      messages = [`:lion_face: You roar powerfully, stunning ${character.enemy.getDisplayName(character)} and gaining bonus damage on your next attack!`];
    }
    // Or regain stamina
    else {
      character.stamina = character.getMaxStamina();
      messages = [`:lion_face: You roar dominantly, regaining your stamina and gaining bonus damage on your next attack!`];
    }

    return messages;
  }

  /**
   * 2x damage from ranged.
   *
   * @param {Character} character - The character doing the biting.
   *
   * @return {array}
   */
  doSkillPounce(character) {
    let messages;
    character.stamina -= STAMINA_POUNCE;

    if (character.isAtRange(character.enemy)) {
      messages = Combat.doAttack(character, {
        message: `:pouting_cat: You leap from afar onto %2$s, dealing %1$s damage!%3$s`,
        multiplier: POUNCE_MULTIPLIER * (character.hasFlag(FLAG_ROAR) ? ROAR_MULTIPLIER : 1),
      }, POUNCE_PROPERTIES);
    }
    else {
      messages = Combat.doAttack(character, {
        message: `:crying_cat_face: You're too close to pounce on %2$s, and you only deal %1$s damage.%3$s`,
        multiplier: character.hasFlag(FLAG_ROAR) ? ROAR_MULTIPLIER : 1,
      }, POUNCE_PROPERTIES);
    }

    return messages;
  }
}

module.exports = Lyon;