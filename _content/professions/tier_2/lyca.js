"use strict";

const { Profession } = require('@app/content/professions');
const { pluralize } = require('@util/text');

const {
  PROFESSIONS,
  LYCA_FORMS,
  FLAGS,
} = require('@constants');

const MASTERY_MAX_HP_BONUS = 50;

const SKILL_WOLF   = 'wolf';
const STAMINA_WOLF = 4;

const SKILL_BEAR           = 'bear';
const STAMINA_BEAR         = 6;
const SP_BEAR              = 250;
const REQ_SP_BEAR          = 300;
const FLAG_BITE_COOLDOWN   = 'bite_cooldown';

const SKILL_LION = 'lion';
const STAMINA_LION         = 6;
const SP_LION              = 500;
const REQ_SP_LION          = 1200;
const FIGHTS_COOLDOWN_LION = 3;

const SKILL_DRAGON           = 'dragon';
const STAMINA_DRAGON         = 6;
const SP_DRAGON              = 750;
const REQ_SP_DRAGON          = 2050;
const FIGHTS_COOLDOWN_DRAGON = 6;
const FLAG_SCALEFORM         = 'scaleform';
const SCALEFORM_MULTIPLIER   = 0.5;

/**
 * Plural is "Lycae".
 */
class Lyca extends Profession {
  constructor() {
    super({
      type: PROFESSIONS.LYCA,
      displayName: "Lyca",
      description: "The very definition of \"adaptable\", Lycae can change even their very bodies into the forms of powerful animals to become undisputed masters of combat.",
      details: "Lycae don't have combat skills themselves, but can take advantage of inner strength and battle conditions to transform into one of four powerful animal forms, each with their own skills and strategies.",
      adText: "*Offence:* Differs per form",
      image: 'professions/lyca.png',
      changeCost: 5000,
      maxSp: 4200,
      masteryDescription: `Gain +${MASTERY_MAX_HP_BONUS} Max HP.`,
      masteryImprovementDescription: "Gain +%d Max HP.",
      spMastery: 1000,
      reqSpMastery: 3200,
      supportSkill: SKILL_BEAR,
    });
  }

  /**
   * Get the current mastery bonus for this character.
   *
   * @param {Character} character - The character to get the mastery bonus for.
   *
   * @return {mixed}
   */
  getMasteryBonus(character, level = this.getMasteryLevel(character)) {
    return 50;
  }

  /**
   * Get the next mastery bonus for this character.
   *
   * @param {Character} character - The character to get the next mastery bonus for.
   *
   * @return {mixed}
   */
  getNextMasteryIncrement(character) {
    return 50;
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
    // When not transformed, total of 0.8
    // When transformed, different for each form, but a total of 1.2

    return Math.ceil(character.force * 0.4 + character.technique * 0.4);
  }

  /**
   * Add Max HP bonus.
   *
   * @param {Character} character - The character mastering this profession.
   */
  async performMasteryActions(character) {
    await super.performMasteryActions(character);

    character._maxHp += MASTERY_MAX_HP_BONUS;
  }

  /**
   * Add Max HP bonus AGAIN.
   *
   * @param {Character} character - The character improving their mastery.
   */
  async performImproveMasteryActions(character) {
    await super.performImproveMasteryActions(character);

    character._maxHp += this.getNextMasteryIncrement(character);
  }

  /**
   * If in Scaleform, take 50% damage.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Character} character - The character doing the defending.
   * @param {Combatant} attacker - The attacking combatant.
   *
   * @return {object}
   */
  doDefenderPostAttackProcessing(attackInfo, character, attacker) {
    // If character is in scaleform, take 50% damage
    if (character.hasFlag(FLAG_SCALEFORM)) {
      attackInfo.damage = Math.ceil(attackInfo.damage * SCALEFORM_MULTIPLIER);
    }

    return super.doDefenderPostAttackProcessing(attackInfo, character, attacker);
  }

  /**
   * Scaleform fades after the fight is finished, and your mouth is no longer full
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(character, messages) {
    character.clearFlag(FLAG_SCALEFORM);
    character.clearFlag(FLAG_BITE_COOLDOWN);

    return super.doFightEnd(character, messages);
  }

  /**
   * Get the stats available for purchase for this character/profession.
   *
   * @return {array}
   */
  getStats() {
    return {
      maxHp: {
        increase: 10,
        costs: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50 ]
      },
      maxMp: {
        increase: 5,
        costs: [ 50, 50, 50, 50, 50, 50, 50, 50, 50, 50 ]
      },
      force: {
        increase: 2,
        costs: [ 50, 50, 75, 75, 100 ]
      },
      technique: {
        increase: 2,
        costs: [ 50, 50, 75, 75, 100 ]
      },
    };
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
      [SKILL_WOLF]: {
        name: "Lywolf",
        description: "Take advantage of a Tired enemy's inattention and shift into the form of a wolf.",
        cost: STAMINA_WOLF,
        properties: [],
      },
      [SKILL_BEAR]: {
        name: "Lybear",
        description: "Shift into the form of a savage and resourceful bear.",
        cost: STAMINA_BEAR,
        spCost: SP_BEAR,
        reqSp: REQ_SP_BEAR,
        properties: [],
      },
      [SKILL_LION]: {
        name: "Lyon",
        description: "Shift into the form of a quick and powerful lion.",
        cost: STAMINA_LION,
        spCost: SP_LION,
        reqSp: REQ_SP_LION,
        properties: [],
      },
      [SKILL_DRAGON]: {
        name: "Lydragon",
        description: "Shift into the form of an unstoppable dragon.",
        cost: STAMINA_DRAGON,
        spCost: SP_DRAGON,
        reqSp: REQ_SP_DRAGON,
        properties: [],
      },
    };

    if (addSupport) {
      skills = this.addSupportSkill(character, skills);
    }

    return skills;
  }

  /**
   * Get the support skill for this profession.
   *
   * @param {Character} character - The character to get the support skill for.
   *
   * @return {object}
   */
  getSupportSkill(character) {
    if (this.type === character.profession.type) {
      return false;
    }

    return this.getSkills(character, false)[this.supportSkill];
  }

  /**
   * Check to see if a character can perform a specific combat skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} skill - The skill to perform.
   *
   * @return {array} Messages arising from the skill.
   */
  canDoSkill(character, skill) {
    if (SKILL_LION === skill && character.hasFlag(FLAGS.LION_FORM_COOLDOWN)) {
      return false;
    }
    else if (SKILL_DRAGON === skill && character.hasFlag(FLAGS.DRAGON_FORM_COOLDOWN)) {
      return false;
    }

    return super.canDoSkill(character, skill);
  }

  /**
   * Get the error message for why you can't use this skill.
   *
   * @param Character character The character performing the skill.
   * @param string    skill     The skill to perform.
   *
   * @return string
   */
  getSkillErrorMessage(character, skill) {
    if (SKILL_LION === skill && character.hasFlag(FLAGS.LION_FORM_COOLDOWN)) {
      const fights = character.getFlag(FLAGS.LION_FORM_COOLDOWN);
      return `:warning: You must recover for ${fights} more ${pluralize('fight', fights)} before you can shift into lion form.`;
    }
    else if (SKILL_DRAGON === skill && character.hasFlag(FLAGS.DRAGON_FORM_COOLDOWN)) {
      const fights = character.getFlag(FLAGS.DRAGON_FORM_COOLDOWN);
      return `:warning: You must recover for ${fights} more ${pluralize('fight', fights)} before you can shift into dragon form.`;
    }

    return super.getSkillErrorMessage(character, skill);
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
    if (SKILL_WOLF === type) {
      return this.doSkillWolf(character);
    }
    // Bear is a support skill
    else if (SKILL_LION === type) {
      return this.doSkillLion(character);
    }
    else if (SKILL_DRAGON === type) {
      return this.doSkillDragon(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * If enemy is Tired, take the form of a wolf.
   *
   * @param {Character} - The character perofrming this action.
   *
   * @return {array}
   */
  doSkillWolf(character) {
    const enemy = character.enemy;
    let messages = [];

    character.stamina -= STAMINA_WOLF;

    if (enemy.isTired()) {
      this.changeToForm(character, LYCA_FORMS.WOLF);
      messages.push(`You take advantage of ${enemy.getDisplayName(character)}'s inattention and shift into the form of a wolf, fur bristling and teeth flashing!`);
    }
    else {
      messages.push(`${enemy.getDisplayName(character)} isn't tired, and interrupts your attempts to change form.`);
    }

    return messages;
  }

  /**
   * Take the form of a lion.
   *
   * @param {Character} - The character perofrming this action.
   *
   * @return {array}
   */
  doSkillLion(character) {
    character.stamina -= STAMINA_LION;
    character.setFlag(FLAGS.LION_FORM_COOLDOWN, FIGHTS_COOLDOWN_LION);

    this.changeToForm(character, LYCA_FORMS.LION);
    return ["Your form elongates as you hunch over, a long tail growing behind and sharp claws and fangs growing afore.  Thick tawny fur coats your body, and you let loose a powerful, leonine roar!"];
  }

  /**
   * Take the form of a dragon.
   *
   * @param {Character} - The character perofrming this action.
   *
   * @return {array}
   */
  doSkillDragon(character) {
    character.stamina -= STAMINA_DRAGON;
    character.setFlag(FLAGS.DRAGON_FORM_COOLDOWN, FIGHTS_COOLDOWN_DRAGON);

    this.changeToForm(character, LYCA_FORMS.DRAGON);
    return ["Your skin hardens, darkens, and begins turning into thick scales.  You grow larger and larger, with a long neck and wings sprouting from your now-massive torso."];
  }
}

module.exports = Lyca;