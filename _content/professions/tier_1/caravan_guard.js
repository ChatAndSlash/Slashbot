"use strict";

const Profession = require('@app/content/professions').Profession;
const Combat     = require('@app/combat');
const Random     = require('@util/random');
const Text       = require('@util/text');

const PROFESSIONS = require('@constants').PROFESSIONS;
const FLAGS       = require('@constants').FLAGS;
const PROPERTIES  = require('@constants').PROPERTIES;

const MASTERY_DODGE_BONUS = 5;

const SKILL_CAUTION   = 'caution';
const STAMINA_CAUTION = 1;

const SKILL_GUARD   = 'guard';
const STAMINA_GUARD = 2;
const SP_GUARD      = 15;
const REQ_SP_GUARD  = 30;

const SKILL_TRIP   = 'trip';
const STAMINA_TRIP = 4;
const SP_TRIP      = 30;
const REQ_SP_TRIP  = 110;

const SKILL_RALLY           = 'rally';
const STAMINA_RALLY         = 1;
const SP_RALLY              = 60;
const REQ_SP_RALLY          = 180;
const COOLDOWN_FIGHTS_RALLY = 4;

class CaravanGuard extends Profession {
  constructor() {
    super({
      type: PROFESSIONS.CARAVAN_GUARD,
      displayName: 'Caravan Guard',
      description: __('Protect themselves as well as those they guard.'),
      details: __("Caravan Guards spend so long focusing on protecting people and goods, they get good at protecting people.  A Guard may not do a terrible amount of damage, but they're terribly hard to hurt."),
      adText: __("*Offence:* (50% Force) + (50% Technique)"),
      image: 'professions/caravan_guard.png',
      changeCost: 100,
      maxSp: 375,
      masteryDescription: __("You gain a permanent %d%% dodge bonus and access to Guard as a Support Skill.", MASTERY_DODGE_BONUS),
      masteryImprovementDescription: "Gain a permanent %d%% dodge bonus (%d%% bonus total).",
      spMastery: 90,
      reqSpMastery: 285,
      supportSkill: SKILL_GUARD,
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
   * Get the offence stat for Caravan Guards.
   *
   * 0.5 Force + 0.5 Technique
   *
   * @param {Character} character - The character to get the offence stat for.
   *
   * @return {integer}
   */
  getOffence(character) {
    return Math.ceil(character.force * 0.5 + character.technique * 0.5);
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
    // If character is tripping, do 50% damage
    if (character.hasFlag(FLAGS.IS_TRIPPING)) {
      attackInfo.damage = Math.ceil(attackInfo.damage / 2);
    }

    return attackInfo;
  }

  /**
   * Perform any post-fight failure actions and return the messages arising from them.
   *
   * @param {Character} character - The character who lost the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightFailure(character, messages) {
    character.clearFlag(FLAGS.RALLY_TEMP_HP);

    return super.doFightEnd(character, messages);
  }

  /**
   * Do any extra actions required when running.
   *
   * @param {Character} character - The character who lost the fight.
   * @param {array} message - The previously-generated messages.
   *
   * @return {array}
   */
  doFightRun(character, messages) {
    character.clearFlag(FLAGS.RALLY_TEMP_HP);

    return super.doFightEnd(character, messages);
  }

  /**
   * Perform any post-fight actions and return the messages arising from them.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    if (character.hasFlag(FLAGS.RALLY_TEMP_HP)) {
      const rallyHp = character.getFlag(FLAGS.RALLY_TEMP_HP);
      character._hp = Math.max(character.hp - rallyHp, 1);

      messages.push(__("Your rally HP fades, leaving you with %d HP.", character._hp));

      character.clearFlag(FLAGS.RALLY_TEMP_HP);
    }

    return super.doFightSuccess(character, messages);
  }

  /**
   * Add dodge bonus.
   *
   * @param {Character} character - The character mastering this profession.
   */
  async performMasteryActions(character) {
    await super.performMasteryActions(character);

    character._dodge += MASTERY_DODGE_BONUS;
  }

  /**
   * Add dodge bonus AGAIN.
   *
   * @param {Character} character - The character improving their mastery.
   */
  async performImproveMasteryActions(character) {
    await super.performImproveMasteryActions(character);

    character._dodge += this.getNextMasteryIncrement(character);
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
        costs: [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ]
      },
      defence: {
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
      [SKILL_CAUTION]: {
        name: __("Caution"),
        description: __("Immune from damage when attacking a Tired enemy."),
        cost: STAMINA_CAUTION,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_GUARD]: {
        name: __("Guard"),
        description: __("Forsake your attack to block 90% damage received."),
        cost: STAMINA_GUARD,
        spCost: SP_GUARD,
        reqSp: REQ_SP_GUARD,
        properties: [],
      },
      [SKILL_TRIP]: {
        name: __("Trip"),
        description: __("Do only 50% damage, but knock down and stun your enemy for 1-2 turn."),
        cost: STAMINA_TRIP,
        spCost: SP_TRIP,
        reqSp: REQ_SP_TRIP,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_RALLY]: {
        name: __("Rally"),
        description: __("Gain 50% of your Max HP as temporary HP for this fight only.  Has a 3 fight cooldown after use."),
        cost: STAMINA_RALLY,
        spCost: SP_RALLY,
        reqSp: REQ_SP_RALLY,
        properties: [],
      }
    };

    if (addSupport) {
      skills = this.addSupportSkill(character, skills);
    }

    return skills;
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
    if (SKILL_RALLY === skill && character.hasFlag(FLAGS.FIGHT_COOLDOWN_RALLY)) {
      return false;
    }

    return super.canDoSkill(character, skill);
  }

  /**
   * Get the error message for why you can't use this skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} skill - The skill to perform.
   *
   * @return {string}
   */
  getSkillErrorMessage(character, skill) {
    if (SKILL_RALLY === skill && character.hasFlag(FLAGS.FIGHT_COOLDOWN_RALLY)) {
      return __(":warning: That skill is on cooldown for %d more fights.", character.getFlag(FLAGS.FIGHT_COOLDOWN_RALLY));
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
    if (SKILL_CAUTION === type) {
      return this.doSkillCaution(character);
    }
    // Guard is a Support Skill
    else if (SKILL_TRIP === type) {
      return this.doSkillTrip(character);
    }
    else if (SKILL_RALLY === type) {
      return this.doSkillRally(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Cautiously attack, taking no damage from Tired enemies.
   *
   * @param {Character} character - The character cautiously attacking.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillCaution(character) {
    character.setFlag(FLAGS.IS_CAUTIOUS);
    character.stamina -= STAMINA_CAUTION;

    return Combat.doAttack(character, { message: ":angry: You cautiously attack, dealing %s damage to %s.%s", forceAttacks: 1 });
  }


  /**
   * Trip your enemy, doing only 50% damage, but stunning them for a turn.
   *
   * @param {Character} character - The character tripping.
   *
   * @preturn {array} Messages arising from this skill.
   */
  doSkillTrip(character) {
    const turns = Random.getWeighted([
      { 'weight': 30, value: 2 },
      { 'weight': 70, value: 1 },
    ]);

    character.setFlag(FLAGS.IS_TRIPPING);
    character.enemy.setFlag(FLAGS.STUNNED_TURNS, turns);
    character.stamina -= STAMINA_TRIP;

    const turnsText = `${turns} ${Text.pluralize("turn", turns)}`;
    return Combat.doAttack(character, { message: `:angry: You attack, dealing only %s damage to %s, but knocking them down and stunning them for ${turnsText}.%s`, forceAttacks: 1 });
  }

  /**
   * Gain 50% max HP in temporary hitpoints.
   *
   * @param {Character} character - The character rallying.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillRally(character) {
    const tempHp = Math.ceil(character.maxHp / 2);
    character.setFlag(FLAGS.RALLY_TEMP_HP, tempHp);
    character.setFlag(FLAGS.FIGHT_COOLDOWN_RALLY, COOLDOWN_FIGHTS_RALLY);

    // Increase directly, skipping max HP rules
    character._hp += tempHp;

    return [__(":muscle: You rally, gaining %d temporary hitpoints!", tempHp)];
  }
}

module.exports = CaravanGuard;