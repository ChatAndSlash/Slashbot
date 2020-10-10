"use strict";

const Profession = require('@app/content/professions').Profession;
const Combat     = require('@app/combat');
const Random     = require('@util/random');

const PROFESSIONS = require('@constants').PROFESSIONS;
const FLAGS       = require('@constants').FLAGS;
const PROPERTIES  = require('@constants').PROPERTIES;

const MASTERY_CRIT_BONUS = 5;

const SKILL_DOUBLE_STRIKE   = 'double-strike';
const STAMINA_DOUBLE_STRIKE = 1;

const SKILL_EVADE   = 'evade';
const STAMINA_EVADE = 2;
const SP_EVADE      = 15;
const REQ_SP_EVADE  = 30;

const SKILL_DISCIPLINE   = 'discipline';
const STAMINA_DISCIPLINE = 2;
const SP_DISCIPLINE      = 30;
const REQ_SP_DISCIPLINE  = 110;

const SKILL_FLURRY   = 'flurry';
const STAMINA_FLURRY = 4;
const SP_FLURRY      = 60;
const REQ_SP_FLURRY  = 180;
const FLURRY_ATTACKS = [
  { weight: 20, value: 2 },
  { weight: 40, value: 3 },
  { weight: 30, value: 4 },
  { weight: 10, value: 5 },
];

class Mercenary extends Profession {
  constructor() {
    super({
      type: PROFESSIONS.MERCENARY,
      displayName: 'Mercenary',
      description: __('Hired for their strength and ferocity, they\'re no slouch in a scrap.'),
      details: __("Mercenaries are trained for one thing, and that's fighting.  When you absolutely, positively have to hurt someone right now, Mercenaries are who you hire."),
      adText: __("*Offence:* (75% Force) + (25% Technique)"),
      image: 'professions/mercenary.png',
      changeCost: 100,
      maxSp: 375,
      masteryDescription: __("You gain a permanent %d%% critical strike chance and access to Evade as a Support Skill.", MASTERY_CRIT_BONUS),
      masteryImprovementDescription: "Gain a permanent %d%% critical strike chance (%d%% bonus total).",
      spMastery: 90,
      reqSpMastery: 285,
      supportSkill: SKILL_EVADE,
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
    if (level === 1) {
      return 1.05;
    }
    else if (level === 2) {
      return 1.07;
    }
    else {
      return ((level - 2) / 100) + 1.07;
    }
  }

  /**
   * Get the next mastery bonus for this character.
   *
   * @param {Character} character - The character to get the next mastery bonus for.
   *
   * @return {mixed}
   */
  getNextMasteryIncrement(character) {
    const current = this.getMasteryLevel(character);

    if (current === 1) {
      return 2;
    }

    return 1;
  }

  /**
   * Get the offence stat for Mercenaries.
   *
   * 0.75 Force + 0.25 Technique
   *
   * @param {Character} character - The character to get the offence stat for.
   *
   * @return {integer}
   */
  getOffence(character) {
    return Math.ceil(character.force * 0.75 + character.technique * 0.25);
  }

  /**
   * After an attack has been performed, allow the attacker to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Combatant} defender - The defending combatant.
   *
   * @return {object}
   */
  doAttackerPostAttackProcessing(attackInfo, character, defender) {
    // If character is disciplined, do 125% damage
    if (character.hasFlag(FLAGS.IS_DISCIPLINED)) {
      attackInfo.damage = Math.ceil(attackInfo.damage * 1.25);
    }

    // If character is flurrying, do 50% damage
    else if (character.hasFlag(FLAGS.IS_FLURRYING)) {
      attackInfo.damage = Math.ceil(attackInfo.damage / 2);
    }

    return attackInfo;
  }

  /**
   * Add crit bonus.
   *
   * @param {Character} character - The character mastering this profession.
   */
  async performMasteryActions(character) {
    await super.performMasteryActions(character);

    character._crit += MASTERY_CRIT_BONUS;
  }

  /**
   * Add crit bonus AGAIN.
   *
   * @param {Character} character - The character improving their mastery.
   */
  async performImproveMasteryActions(character) {
    await super.performImproveMasteryActions(character);

    character._crit += this.getNextMasteryIncrement(character);
  }

  /**
   * Get the stats available for purchase for this character/profession.
   *
   * @return {array}
   */
  getStats() {
    return {
      maxHp: {
        increase: 5,
        costs: [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ]
      },
      maxMp: {
        increase: 5,
        costs: [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ]
      },
      force: {
        increase: 1,
        costs: [ 10, 10, 15, 20, 25 ]
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
      [SKILL_DOUBLE_STRIKE]: {
        name: __("Double Strike"),
        description: __("When attacking a tired enemy, attack twice.  Cannot crit."),
        cost: STAMINA_DOUBLE_STRIKE,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_EVADE]: {
        name: __("Evade"),
        description: __("Gain 25% dodge until you dodge, which will fill your Stamina."),
        cost: STAMINA_EVADE,
        spCost: SP_EVADE,
        reqSp: REQ_SP_EVADE,
        properties: [],
      },
      [SKILL_DISCIPLINE]: {
        name: __("Discipline"),
        description: __("Forgo your chance to perform a critical strike for 25% bonus damage."),
        cost: STAMINA_DISCIPLINE,
        spCost: SP_DISCIPLINE,
        reqSp: REQ_SP_DISCIPLINE,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_FLURRY]: {
        name: __("Flurry"),
        description: __("Attack between 2 to 5 times for 50% damage per hit."),
        cost: STAMINA_FLURRY,
        spCost: SP_FLURRY,
        reqSp: REQ_SP_FLURRY,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      }
    };

    if (addSupport) {
      skills = this.addSupportSkill(character, skills);
    }

    return skills;
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
    if (SKILL_DOUBLE_STRIKE === type) {
      return this.doSkillDoubleStrike(character);
    }
    // Evade is a Support Skill
    else if (SKILL_DISCIPLINE === type) {
      return this.doSkillDiscipline(character);
    }
    else if (SKILL_FLURRY === type) {
      return this.doSkillFlurry(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Attack Tired enemies twice.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillDoubleStrike(character) {
    character.stamina -= STAMINA_DOUBLE_STRIKE;
    character.setFlag(FLAGS.CANNOT_CRIT);

    let messages = [];

    // If enemy is tired, attack twice
    if (character.enemy.isTired()) {
      messages.push(Combat.doAttack(character, { message: ":angry: You attack, dealing %s damage to %s.%s", forceAttacks: 1 }));
      messages.push(Combat.doAttack(character, { message: ":angry: Your enemy is tired, allowing you to attack again! You deal %s damage to %s.%s", forceAttacks: 1 }));
    }
    else {
      messages.push(Combat.doAttack(character, { message: ":angry: You attack, dealing %s damage to %s.%s", forceAttacks: 1 }));
      messages.push(__("Your enemy is not Tired, so you can't manage to work in a second attack."));
    }

    character.clearFlag(FLAGS.CANNOT_CRIT);

    return messages;
  }

  /**
   * Attack with discipline, forsaking a chance at a critical strike to do 25% extra damage.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillDiscipline(character) {
    character.stamina -= STAMINA_DISCIPLINE;
    character.setFlag(FLAGS.IS_DISCIPLINED);

    return Combat.doAttack(character, { message: ":angry: You exercise discipline as you attack, dealing %s damage to %s.%s", forceAttacks: 1 });
  }

  /**
   * Do between 2 to 5 attacks, dealing 50% damge per hit.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillFlurry(character) {
    let messages = [];
    character.stamina -= STAMINA_FLURRY;
    character.setFlag(FLAGS.IS_FLURRYING);

    messages.push(__(":rage: You prepare to unleash a flurry of blows..."));

    const attacks = Random.getWeighted(FLURRY_ATTACKS);
    for (let x = 0; x < attacks; x++) {
      messages.push(Combat.doAttack(character, { message: ":angry: A hit!  You deal %s damage to %s.%s", forceAttacks: 1 }));
    }

    return messages;
  }
}

module.exports = Mercenary;