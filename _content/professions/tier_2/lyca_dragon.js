"use strict";

const LycaTransformBase = require('@content/professions/tier_2/lyca_transform_base');

const {
  PROFESSIONS,
  PROPERTIES,
} = require('@constants');

const SKILL_INFERNO      = 'inferno';
const STAMINA_INFERNO    = 6;
const INFERNO_MULTIPLIER = 5;
const INFERNO_PROPERTIES = [
  PROPERTIES.IS_ATTACK,
  PROPERTIES.RANGED_ATTACK,
  PROPERTIES.AOE_ATTACK,
  PROPERTIES.BURN_ATTACK,
];

const SKILL_TOASTY_GLOW   = 'toasty_glow';
const STAMINA_TOASTY_GLOW = 6;

const SKILL_SCALEFORM   = 'scaleform';
const STAMINA_SCALEFORM = 6;
const FLAG_SCALEFORM    = 'scaleform';

/**
 * Plural is "Lycae".
 */
class Lydragon extends LycaTransformBase {
  constructor() {
    super({
      type: PROFESSIONS.LYCA,
      displayName: "Lydragon",
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
    return character.force * 1.2;
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
      [SKILL_INFERNO]: {
        name: "Inferno",
        description: "Blast your opponent for incredibly heavy fire damage.",
        cost: STAMINA_INFERNO,
        properties: INFERNO_PROPERTIES,
      },
      [SKILL_TOASTY_GLOW]: {
        name: "Toasty Glow",
        description: "Heal yourself for half of your max HP & MP.",
        cost: STAMINA_TOASTY_GLOW,
        properties: [],
      },
      [SKILL_SCALEFORM]: {
        name: "Scaleform",
        description: "Gain 50% damage reduction for the remainder of the fight.",
        cost: STAMINA_SCALEFORM,
        properties: [],
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
      [SKILL_INFERNO]: true,
      [SKILL_TOASTY_GLOW]: true,
      [SKILL_SCALEFORM]: true,
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
    if (SKILL_INFERNO === type) {
      return this.doSkillInferno(character);
    }
    else if (SKILL_TOASTY_GLOW === type) {
      return this.doSkillToastyGlow(character);
    }
    else if (SKILL_SCALEFORM === type) {
      return this.doSkillScaleform(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Damage & 2-turn stun after Tired.
   *
   * @param {Character} character - The character doing the biting.
   *
   * @return {array}
   */
  doSkillInferno(character) {
    const enemy = character.enemy;
    character.stamina -= STAMINA_INFERNO;

    const attackInfo = character.getEffectAttackInfo(enemy, INFERNO_PROPERTIES);
    const damage = enemy.decreaseHp(Math.ceil(attackInfo.damage * INFERNO_MULTIPLIER));

    let messages = [`:fire::fire::fire: You take a deep breath, then spew forth an inferno of flame, dealing *${damage}* damage to ${enemy.getDisplayName(character)}!`];
    messages = messages.concat(attackInfo.extraMessages);

    return messages;
  }

  /**
   * Heal 100% of HP and restore 50% of MP.
   *
   * @param {Character} character - The character doing the biting.
   *
   * @return {array}
   */
  doSkillToastyGlow(character) {
    character.stamina -= STAMINA_TOASTY_GLOW;

    const hpRestored = character.increaseHp(Math.ceil(character.maxHp));
    const mpRestored = character.increaseMp(Math.ceil(character.maxMp / 2));

    return [`You hunker down, allowing the radiating warmth inside you spread to your extremities.  You heal ${hpRestored} HP and restore ${mpRestored} MP.`];
  }

  /**
   * 50% damage reduction for the rest of the fight.
   *
   * @param {Character} character - The character doing the biting.
   *
   * @return {array}
   */
  doSkillScaleform(character) {
    character.stamina -= STAMINA_SCALEFORM;
    character.setFlag(FLAG_SCALEFORM);

    return [":shield: Your scales flash and harden further, providing 50% damage reduction for the remainder of the fight."];
  }
}

module.exports = Lydragon;