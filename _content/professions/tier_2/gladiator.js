"use strict";

const Combat     = require('@app/combat');
const Profession = require('@app/content/professions').Profession;
const Random     = require('@util/random');

const PROFESSIONS = require('@constants').PROFESSIONS;
const FLAGS       = require('@constants').FLAGS;
const PROPERTIES  = require('@constants').PROPERTIES;

const SKILL_FRENZY   = 'frenzy';
const STAMINA_FRENZY = 2;

const SKILL_RAGE           = 'rage';
const STAMINA_RAGE         = 4;
const SP_RAGE              = 30;
const REQ_SP_RAGE          = 60;
const RAGE_BONUS_INCREMENT = 5;

const SKILL_IGNORE_PAIN   = 'ignore_pain';
const STAMINA_IGNORE_PAIN = 2;
const SP_IGNORE_PAIN      = 90;
const REQ_SP_IGNORE_PAIN  = 220;

const SKILL_DEATHBLOW   = 'deathblow';
const STAMINA_DEATHBLOW = 6;
const SP_DEATHBLOW      = 120;
const REQ_SP_DEATHBLOW  = 390;

class Gladiator extends Profession {
  constructor() {
    super({
      type: PROFESSIONS.GLADIATOR,
      displayName: 'Gladiator',
      description: __("Long hours spent in the pits of the Coliseum give Gladiators the battle skills and the rage they require to crush their feeble, worthless opponents.  Requires Mastery of Mercenary and Caravan Guard professions."),
      details: __("Masters of timing, Gladiators know just how and where to strike at an enemy's weak point to get a critical hit.  Combining this with brutal axes -- their favourite tool -- they are masters of dealing huge spikes of damage."),
      adText: __("*Offence:* (75% Force) + (25% Technique)"),
      image: 'professions/gladiator.png',
      changeCost: 500,
      maxSp: 750,
      masteryDescription: __("You gain a permanent 10% critical damage bonus and access to Rage as a Support Skill."),
      masteryImprovementDescription: "Gain a permanent %d%% critical damage bonus (%d%% bonus total).",
      spMastery: 150,
      reqSpMastery: 600,
      supportSkill: SKILL_RAGE,
    });
  }

  /**
   * If the character has met the requirements to switch to this profession.
   *
   * @param {Character} character - The character to check the requirements for.
   *
   * @return {boolean}
   */
  hasMetRequirements(character) {
    return character.hasMasteredProfession(PROFESSIONS.CARAVAN_GUARD)
      && character.hasMasteredProfession(PROFESSIONS.MERCENARY)
      && super.hasMetRequirements(character);
  }

  /**
   * Get the error message that explains why the character has failed to mee the requirements.
   *
   * @param {Character} character - The character to get the error text for.
   *
   * @return {string}
   */
  getRequirementError(character) {
    if ( ! character.hasMasteredProfession(PROFESSIONS.CARAVAN_GUARD)) {
      if ( ! character.hasMasteredProfession(PROFESSIONS.MERCENARY)) {
        return __("You must first master both the Caravan Guard and Mercenary professions before you can become a Gladiator.");
      }
      else {
        return __("You must first master the Caravan Guard profession before you can become a Gladiator.");
      }
    }
    else if ( ! character.hasMasteredProfession(PROFESSIONS.MERCENARY)) {
      return __("You must first master the Mercenary profession before you become a Gladiator.");
    }

    return super.getRequirementError(character);
  }

  /**
   * Get the cost for switching to this profession.
   *
   * @param {Character} character - The character switching professions.
   *
   * @return {string}
   */
  getCostText(character) {
    return __("Requires Mastery of Mercenary and Caravan Guard professions.\n")
      + super.getCostText(character);
  }

  /**
   * Get the current mastery bonus for this character.
   *
   * @param {Character} character - The character to get the mastery bonus for.
   *
   * @return {mixed}
   */
  getMasteryBonus(character, level = this.getMasteryLevel(character)) {
    if (level === 0) {
      return 1;
    }
    else if (level === 1) {
      return 1.1;
    }
    else if (level === 2) {
      return 1.15;
    }
    else if (level === 3) {
      return 1.17;
    }
    else if (level === 4) {
      return 1.19;
    }
    else {
      return ((level - 4) / 100) + 1.19;
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

    if (current === 0) {
      return 10;
    }
    else if (current === 1) {
      return 5;
    }
    else if (current === 2 || current == 3) {
      return 2;
    }

    return 1;
  }

  /**
   * Get the offence stat for Mist Dancers.
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
   * Get the stats available for purchase for this character/profession.
   *
   * @return {array}
   */
  getStats() {
    return {
      maxHp: {
        increase: 5,
        costs: [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ]
      },
      maxMp: {
        increase: 5,
        costs: [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ]
      },
      force: {
        increase: 1,
        costs: [ 10, 10, 15, 20, 25 ]
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
      [SKILL_FRENZY]: {
        name: __("Frenzy"),
        description: __("Gain a 50% crit bonus when attacking a Tired enemy.  For the next 2 turns, can only Attack, but with 75%, then 100% crit bonus."),
        cost: STAMINA_FRENZY,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_RAGE]: {
        name: __("Rage"),
        description: __("Attack with fury and gain a %d%% crit bonus for the fight.", RAGE_BONUS_INCREMENT),
        cost: STAMINA_RAGE,
        spCost: SP_RAGE,
        reqSp: REQ_SP_RAGE,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_IGNORE_PAIN]: {
        name: __("Ignore Pain"),
        description: __("Attack, taking only 50% damage in return."),
        cost: STAMINA_IGNORE_PAIN,
        spCost: SP_IGNORE_PAIN,
        reqSp: REQ_SP_IGNORE_PAIN,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_DEATHBLOW]: {
        name: __("Deathblow"),
        description: __("Once per fight, attack an enemy below 25% health to kill them outright."),
        cost: STAMINA_DEATHBLOW,
        spCost: SP_DEATHBLOW,
        reqSp: REQ_SP_DEATHBLOW,
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
   * Check to see if a character can perform a specific combat skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} type - The type of the skill to perform.
   *
   * @return {boolean}
   */
  canDoSkill(character, type) {
    if (SKILL_DEATHBLOW === type) {
      if (character.enemy.hp > Math.floor(character.enemy.maxHp / 4)) {
        return false;
      }
      else if (character.getFlag(FLAGS.FIGHT_COOLDOWN_DEATHBLOW)) {
        return false;
      }
    }

    return super.canDoSkill(character, type);
  }

  /**
   * Get the error message for why you can't use this skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} type - The type of the skill to perform.
   *
   * @return {string}
   */
  getSkillErrorMessage(character, type) {
    if (SKILL_DEATHBLOW === type) {
      const enemy = character.enemy;
      if (enemy.hp > Math.floor(enemy.maxHp / 4)) {
        return __(":warning: You cannot perform a deathblow against an enemy with that much health.");
      }
      else if (character.getFlag(FLAGS.FIGHT_COOLDOWN_DEATHBLOW)) {
        return __(":warning: You cannot perform a deathblow against %s.  They're watching you too closely for you to try again.", enemy.getDisplayName(character));
      }
    }

    return super.getSkillErrorMessage(character, type);
  }

  /**
   * Allow attack parameters to be modified before being used in an attack.
   *
   * @param {object} params - The parameters to modify.
   * @param {Combatant} defender - The defender of the attack.
   * @param {Character} character - The attacking character.
   *
   * @return {object}
   */
  attackerModifyAttackParameters(params, defender, character) {
    if (character.hasFlag(FLAGS.FRENZY_TURNS)) {
      const frenzyTurns = character.getFlag(FLAGS.FRENZY_TURNS);
      if (frenzyTurns === 3) {
        params.crit = Math.min(params.crit + 50, 100);
        params.paramExtraMessages.push("Your frenzy granted you an extra 50% crit chance!");
      }
      else if (frenzyTurns === 2) {
        params.crit = Math.min(params.crit + 75, 100);
        params.paramExtraMessages.push("Your frenzy granted you an extra 75% crit chance!");
      }
      else {
        params.crit = 100;
        params.paramExtraMessages.push("Your frenzy guaranteed you a critical hit!");
      }
    }

    return super.attackerModifyAttackParameters(params, defender, character);
  }

  /**
   * After an attack has been performed, allow the defender to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Character} character - The character doing the defending.
   * @param {Combatant} attacker - The attacking combatant.
   *
   * @return {object}
   */
  doDefenderPostAttackProcessing(attackInfo, character, attacker) {
    // If character is ignoring pain, receive only 50% damage
    if (character.hasFlag(FLAGS.IS_IGNORING_PAIN)) {
      attackInfo.damage = Math.ceil(attackInfo.damage / 2);
    }

    return super.doDefenderPostAttackProcessing(attackInfo, character, attacker);
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
    if (SKILL_FRENZY === type) {
      return this.doSkillFrenzy(character);
    }
    // Rage is a Support Skill
    else if (SKILL_IGNORE_PAIN === type) {
      return this.doSkillIgnorePain(character);
    }
    else if (SKILL_DEATHBLOW === type) {
      return this.doSkillDeathblow(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Frenzy!  Attack with 50% crit chance, but then you can only attack for the next 2 rounds,
   * with 75% crit chance and 100% crit chance respectively.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {Attachments}
   */
  doSkillFrenzy(character) {
    const enemy = character.enemy;
    let messages = [];

    character.stamina -= STAMINA_FRENZY;

    if (enemy.isTired()) {
      character.setFlag(FLAGS.FRENZY_TURNS, 3);
      messages = messages.concat(Combat.doAttack(character, { message: ":angry: You attack wildly, dealing %s damage to %s and fly into a frenzy!%s" }));
    }
    else {
      messages.push(__("You throw yourself at %s, but they're not Tired at all, and you can't really work up a good frenzy.", enemy.getDisplayName(character)));
      messages = messages.concat(Combat.doAttack(character));
    }

    return messages;
  }

  /**
   * Attack, ignoring the pain of the counterattack, taking only 50% damage in return.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillIgnorePain(character) {
    character.stamina -= STAMINA_IGNORE_PAIN;
    character.setFlag(FLAGS.IS_IGNORING_PAIN);

    return Combat.doAttack(character, { message: ":angry: You attack, ignoring any pain dealt your way and dealing %s damage to %s!%s" });
  }

  /**
   * Killing an enemy below 25% health.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillDeathblow(character) {
    const enemy = character.enemy;

    character.stamina -= STAMINA_DEATHBLOW;
    character.setFlag(FLAGS.FIGHT_COOLDOWN_DEATHBLOW);

    // Bosses have a 50% of it failing.
    if (enemy.isBoss && Random.between(1, 2) === 2) {
      return [__(":disappointed: You attempt to deliver a deathblow to %s, but they prove to be quite tough and resist you!  They're now wary of you, and you won't have the opportunity again.", enemy.getDisplayName(character))];
    }

    enemy.hp = 0;
    return [__(":-1: Imagining the cheering crowds of the coliseum, you deliver a glorious deathblow to %s!", enemy.getDisplayName(character))];
  }
}

module.exports = Gladiator;