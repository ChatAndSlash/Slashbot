"use strict";

const Combat     = require('@app/combat');
const Profession = require('@app/content/professions').Profession;
const Random     = require('@util/random');
const Text       = require('@util/text');

const PROFESSIONS = require('@constants').PROFESSIONS;
const FLAGS       = require('@constants').FLAGS;
const PROPERTIES  = require('@constants').PROPERTIES;

const SKILL_INFLAME   = 'inflame';
const STAMINA_INFLAME = 2;
const INFLAME_TURNS   = 3;

const SKILL_RIPOSTE   = 'riposte';
const STAMINA_RIPOSTE = 2;
const SP_RIPOSTE      = 30;
const REQ_SP_RIPOSTE  = 60;

const SKILL_DISARM   = 'disarm';
const STAMINA_DISARM = 1;
const SP_DISARM      = 90;
const REQ_SP_DISARM  = 220;

const SKILL_MIST_BALM           = 'mist_balm';
const STAMINA_MIST_BALM         = 6;
const SP_MIST_BALM              = 120;
const REQ_SP_MIST_BALM          = 390;
const COOLDOWN_FIGHTS_MIST_BALM = 1;
const TURNS_BALMED              = 4;
const MIST_BALM_HP_HEALED    = 50;

class MistDancer extends Profession {
  constructor() {
    super({
      type: PROFESSIONS.MIST_DANCER,
      displayName: 'Mist Dancer',
      description: __("With subtlety, guile, and a little bit of seduction, Mist Dancers use their natural assets to their advantage and their enemy's disadvantage.  Requires Mastery of Bard and Caravan Guard professions."),
      details: __("Mist Dancers are masters of defence, though using Hidden Daggers can give them that extra burst of damage to even things out."),
      adText: __("*Offence:* (25% Force) + (75% Technique)"),
      image: 'professions/mist_dancer.png',
      changeCost: 500,
      maxSp: 750,
      masteryDescription: __("Gain an extra 10% damage reduction when Defending, and access to Riposte as a Support Skill."),
      masteryImprovementDescription: "Gain a permanent %d%% damage reduction when Defending (%d%% bonus total).",
      spMastery: 150,
      reqSpMastery: 600,
      supportSkill: SKILL_RIPOSTE,
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
    return character.hasMasteredProfession(PROFESSIONS.BARD)
      && character.hasMasteredProfession(PROFESSIONS.CARAVAN_GUARD)
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
    if ( ! character.hasMasteredProfession(PROFESSIONS.BARD)) {
      if ( ! character.hasMasteredProfession(PROFESSIONS.CARAVAN_GUARD)) {
        return __("You must first master both the Bard and Caravan Guard professions before you can become a Mist Dancer.");
      }
      else {
        return __("You must first master the Bard profession before you can become a Mist Dancer.");
      }
    }
    else if ( ! character.hasMasteredProfession(PROFESSIONS.CARAVAN_GUARD)) {
      return __("You must first master the Caravan Guard profession before you become a Mist Dancer.");
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
    return __("Requires Mastery of Bard and Caravan Guard professions.\n")
      + super.getCostText(character);
  }

  /**
   * Get the description for what happens when you improve your mastery.
   *
   * @param {Character} character - The character to get the description for.
   *
   * @return {string}
   */
  getMasteryImprovementDescription(character) {
    const nextLevel = this.getMasteryLevel(character) + 1;
    return __(
      this._masteryImprovementDescription,
      this.getNextMasteryIncrement(character),
      Math.round((this.getMasteryBonus(character, nextLevel)) * 100)
    );
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
      return 0;
    }
    else if (level === 1) {
      return 0.1;
    }
    else if (level === 2) {
      return 0.15;
    }
    else if (level === 3) {
      return 0.2;
    }
    else if (level === 4) {
      return 0.22;
    }
    else if (level === 5) {
      return 0.24;
    }
    else {
      return ((level - 5) / 100) + 0.24;
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
    else if (current === 1 || current === 2) {
      return 5;
    }
    else if (current === 3 || current == 4) {
      return 2;
    }

    return 1;
  }

  /**
   * Get the offence stat for Mist Dancers.
   *
   * 0.25 Force + 0.75 Technique
   *
   * @param {Character} character - The character to get the offence stat for.
   *
   * @return {integer}
   */
  getOffence(character) {
    return Math.ceil(character.force * 0.25 + character.technique * 0.75);
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
      technique: {
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
      [SKILL_INFLAME]: {
        name: __("Inflame"),
        description: __("Attack a Tired enemy in an unfair manner, enraging them for %d turns during which they can only attack you, and have a 50%% miss chance.", INFLAME_TURNS),
        cost: STAMINA_INFLAME,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_RIPOSTE]: {
        name: __("Riposte"),
        description: __("Defend, and reflect back 50% of the next standard or furious attack against you.  Has a 4 turn cooldown."),
        cost: STAMINA_RIPOSTE,
        spCost: SP_RIPOSTE,
        reqSp: REQ_SP_RIPOSTE,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_DISARM]: {
        name: __("Disarm"),
        description: __("Attack and knock your enemy's weapon away, so they only deal 50% damage in return."),
        cost: STAMINA_DISARM,
        spCost: SP_DISARM,
        reqSp: REQ_SP_DISARM,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_MIST_BALM]: {
        name: __("Mist Balm"),
        description: __("Not quite a smoke bomb, this pleasant-smelling mist grants you 25%% dodge and healing for %d turns, once per fight.", TURNS_BALMED),
        cost: STAMINA_MIST_BALM,
        spCost: SP_MIST_BALM,
        reqSp: REQ_SP_MIST_BALM,
        properties: [],
      }
    };

    if (addSupport) {
      skills = this.addSupportSkill(character, skills);
    }

    return skills;
  }

  /**
   * Do any actions that might happen after each round of combat (regen, etc.)
   *
   * @param {Character} character - The character in combat.
   *
   * @return {array} The messages generated by these actions.
   */
  doPostRoundActions(character) {
    const enemy = character.enemy;
    let messages = super.doPostRoundActions(character);

    if ( ! enemy.isDead() && enemy.hasFlag(FLAGS.INFLAMED_TURNS)) {
      const turns = enemy.getFlag(FLAGS.INFLAMED_TURNS) - 1;
      if (turns > 0) {
        const turnsText = `${turns} ${Text.pluralize("turn", turns)}`;
        messages.push(__(":angry: %s %s inflamed!  They are forced to attack and suffer a 50%% miss rate for %s.", enemy.getDisplayName(character), enemy.isAre, turnsText));
      }
    }

    if (character.hasFlag(FLAGS.MIST_BALM_TURNS)) {
      messages.push(this.beBalmed(character));
    }

    return messages;
  }

  /**
   * Check to see if a character can perform a specific combat skill.
   *
   * @param {Character} character - The character performing the skill.
   * @param {string} type - The type of the skill to perform.
   *
   * @return boolean
   */
  canDoSkill(character, type) {
    if (SKILL_MIST_BALM === type && character.hasFlag(FLAGS.FIGHT_COOLDOWN_MIST_BALM)) {
      return false;
    }

    return super.canDoSkill(character, type);
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
    if (SKILL_MIST_BALM === skill && character.hasFlag(FLAGS.FIGHT_COOLDOWN_MIST_BALM)) {
      return __(":warning: You can only use Mist Balm once per fight.");
    }

    return super.getSkillErrorMessage(character, skill);
  }

  /**
   * Perform any post-fight actions that always happen.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - The messages already generated in this fight.
   *
   * @return {array}
   */
  doFightEnd(character, messages) {
    character.clearFlag(FLAGS.MIST_BALM_TURNS);

    return super.doFightEnd(character, messages);
  }

  /**
   * Perform any post-fight success actions and return the messages arising from them.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Messages that have already been generated.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    if (character.hasFlag(FLAGS.MIST_BALM_TURNS)) {
      messages.push(this.beBalmed(character));
    }

    return messages;
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
    // If attacker is inflamed, they have a 50% chance of missing
    if (attacker.hasFlag(FLAGS.INFLAMED_TURNS) && Random.between(1, 2) === 1) {
      attackInfo.damage = 0;
      attackInfo.didMiss = true;
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
    if (SKILL_INFLAME === type) {
      return this.doSkillInflame(character);
    }
    // Riposte is a Support Skill
    else if (SKILL_DISARM === type) {
      return this.doSkillDisarm(character);
    }
    else if (SKILL_MIST_BALM === type) {
      return this.doSkillMistBalm(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Inflame the enemy if Tired.  They must only attack and have a 50% miss rate.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {Attachments}
   */
  doSkillInflame(character) {
    const enemy = character.enemy;
    let messages = [];

    character.stamina -= STAMINA_INFLAME;

    if (enemy.isTired()) {
      enemy.setFlag(FLAGS.INFLAMED_TURNS, INFLAME_TURNS + 1);

      messages.push(__("You take advantage of %s being Tired and sneak in a really unfair attack.  They are inflamed for %d turns!", enemy.getDisplayName(character), INFLAME_TURNS));
      messages = messages.concat(Combat.doAttack(character));
    }
    else {
      messages.push(__("You try to sneak in an unfair attack against %s, but not being Tired, they notice and stop you.", enemy.getDisplayName(character)));
    }

    return  messages;
  }

  /**
   * Disarm your opponent, causing their next attack to deal 50% less damage.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillDisarm(character) {
    character.enemy.setFlag(FLAGS.IS_DISARMED);
    character.stamina -= STAMINA_DISARM;

    return Combat.doAttack(character, { message: ":angry: You attack, dealing %s damage to %s and disarming them, rendering their next attack less effective!%s" });
  }

  /**
   * HoT and +25% dodge for the next 4 turns.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillMistBalm(character) {
    character.stamina -= STAMINA_MIST_BALM;
    character.setFlag(FLAGS.FIGHT_COOLDOWN_MIST_BALM, COOLDOWN_FIGHTS_MIST_BALM);
    character.setFlag(FLAGS.MIST_BALM_TURNS, TURNS_BALMED);

    return [__("You drop a mist balm at your feet.  It explodes and covers the area in a concealing, healing mist for %d turns.", TURNS_BALMED)];
  }

  /**
   * If balmed, heal some HP!
   *
   * @param {Character} character - The character being soothed.
   *
   * @return {array} The messages generated by being soothed.
   */
  beBalmed(character) {
    // Have to manually manage turns so that fight success gets one more turn of healing
    character.decrementFlag(FLAGS.MIST_BALM_TURNS);

    character.increaseHp(MIST_BALM_HP_HEALED);
    const remainingTurns = character.getFlag(FLAGS.MIST_BALM_TURNS);
    const remainingText = remainingTurns > 0 ? __(" (%d turns remaining)", remainingTurns) : "";

    return __(":relieved: You bask in the mist balm and regain %d HP%s.", MIST_BALM_HP_HEALED, remainingText);
  }
}

module.exports = MistDancer;