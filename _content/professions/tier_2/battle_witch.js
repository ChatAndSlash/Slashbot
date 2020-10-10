"use strict";

const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;
const Combat      = require('@app/combat');
const Gun         = require('@app/content/items/equipment/weapons/guns');
const Profession  = require('@app/content/professions').Profession;
const Spells      = require('@app/content/spells').Spells;
const Random      = require('@util/random');

const PROFESSIONS = require('@constants').PROFESSIONS;
const COLORS      = require('@constants').COLORS;
const FLAGS       = require('@constants').FLAGS;
const PROPERTIES  = require('@constants').PROPERTIES;

const MASTERY_AMMO_BONUS = 10;

const SKILL_BATTLECAST   = 'battlecast';
const STAMINA_BATTLECAST = 1;

const SKILL_QUICK_RELOAD   = 'quick_reload';
const STAMINA_QUICK_RELOAD = 2;
const SP_QUICK_RELOAD      = 30;
const REQ_SP_QUICK_RELOAD  = 60;

const SKILL_BACKFLIP   = 'backflip';
const STAMINA_BACKFLIP = 4;
const SP_BACKFLIP      = 90;
const REQ_SP_BACKFLIP  = 220;

const SKILL_ALPHA_STRIKE   = 'alpha_strike';
const STAMINA_ALPHA_STRIKE = 6;
const SP_ALPHA_STRIKE      = 120;
const REQ_SP_ALPHA_STRIKE  = 390;

class BattleWitch extends Profession {
  constructor() {
    super({
      type: PROFESSIONS.BATTLE_WITCH,
      displayName: 'Battle Witch',
      description: __("Agile assassins with amazing arcane abilities, Battle Witches mix superior spellcasting with batlletic ballistics.  Requires Mastery of Mercenary and Bard professions."),
      details: __("Battle Witches have a unique familiarity with guns, incorporating them into their combat and spellplay in a powerful fashion.  No other profession can be as effective with guns as they can."),
      adText: __("*Offence:* (50% Force) + (50% Technique)"),
      image: 'professions/battle_witch.png',
      changeCost: 500,
      maxSp: 750,
      masteryDescription: __("You gain a permanent %d%% ammo capacity and access to Quick Reload as a Support Skill.", MASTERY_AMMO_BONUS),
      masteryImprovementDescription: "Gain a permanent %d%% ammo capacity bonus (%d%% bonus total).",
      spMastery: 150,
      reqSpMastery: 600,
      supportSkill: SKILL_QUICK_RELOAD,
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
    if ( ! character.hasMasteredProfession(PROFESSIONS.BARD)) {
      if ( ! character.hasMasteredProfession(PROFESSIONS.MERCENARY)) {
        return __("You must first master both the Bard and Mercenary professions before you can become a Battle Witch.");
      }
      else {
        return __("You must first master the Bard profession before you can become a Battle Witch.");
      }
    }
    else if ( ! character.hasMasteredProfession(PROFESSIONS.MERCENARY)) {
      return __("You must first master the Mercenary profession before you become a Battle Witch.");
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
    return __("Requires Mastery of Mercenary and Bard professions.\n")
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
      return 1.2;
    }
    else if (level === 3) {
      return 1.25;
    }
    else if (level === 4) {
      return 1.3;
    }
    else {
      return ((level - 4) / 50) + 1.3;
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
      return 10;
    }
    else if (current === 2 || current == 3) {
      return 5;
    }

    return 2;
  }

  /**
   * Get the offence stat for Battle Witches.
   *
   * 0.50 Force + 0.50 Technique
   *
   * @param {Character} character - The character to get the offence stat for.
   *
   * @return {integer}
   */
  getOffence(character) {
    return Math.ceil(character.force * 0.5 + character.technique * 0.5);
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
      technique: {
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
      [SKILL_BATTLECAST]: {
        name: __("Battlecast"),
        description: __("When facing a tired enemy, cast a damaging spell at no MP cost."),
        cost: STAMINA_BATTLECAST,
        properties: [
          PROPERTIES.HAS_SUB_ACTIONS,
        ],
      },
      [SKILL_QUICK_RELOAD]: {
        name: __("Quick Reload"),
        description: __("Reload your gun and attack in the same turn."),
        cost: STAMINA_QUICK_RELOAD,
        spCost: SP_QUICK_RELOAD,
        reqSp: REQ_SP_QUICK_RELOAD,
        properties: [
          PROPERTIES.IS_ATTACK,
          PROPERTIES.DOES_NOT_NEED_AMMO,
        ],
      },
      [SKILL_BACKFLIP]: {
        name: __("Backflip"),
        description: __("Attack while acrobatically backflipping, gaining range on your opponent."),
        cost: STAMINA_BACKFLIP,
        spCost: SP_BACKFLIP,
        reqSp: REQ_SP_BACKFLIP,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_ALPHA_STRIKE]: {
        name: __("Alpha Strike"),
        description: __("Shoot all the ammo in your gun, suffering a 25% miss penalty and jamming your gun.  A great finisher."),
        cost: STAMINA_ALPHA_STRIKE,
        spCost: SP_ALPHA_STRIKE,
        reqSp: REQ_SP_ALPHA_STRIKE,
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
   * After an attack has been performed, allow the attacker to modify the attack info.
   *
   * @param {object} attackInfo - The attack information.
   * @param {Character} character - The character doing the attacking.
   * @param {Combatant} defender - The defending combatant.
   *
   * @return {object}
   */
  doAttackerPostAttackProcessing(attackInfo, character, defender) {
    // If character is alpha striking, 25% chance of missing
    if (character.hasFlag(FLAGS.IS_ALPHA_STRIKING)) {
      if (Random.between(1, 4) === 1) {
        attackInfo.damage  = 0;
        attackInfo.didMiss = true;
      }
    }

    return attackInfo;
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
    character.clearFlag(FLAGS.IS_JAMMED);

    return super.doFightEnd(character, messages);
  }

  /**
   * Do any actions that might happen after each round of combat (regen, etc.)
   *
   * @param {Character} character - The character in combat.
   *
   * @return {array} The messages generated by these actions.
   */
  doPostRoundActions(character) {
    let messages = super.doPostRoundActions(character);

    if (character.hasFlag(FLAGS.IS_JAMMED)) {
      messages.push(__(":exclamation: Your gun is jammed!  You must clear the jam before you can fire again."));
    }

    return messages;
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
    if (SKILL_BACKFLIP === type && ! (character.weapon instanceof Gun)) {
      return false;
    }
    else if (SKILL_ALPHA_STRIKE === type && ! (character.weapon instanceof Gun)) {
      return false;
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
    if (SKILL_BACKFLIP === type && ! (character.weapon instanceof Gun)) {
      return __(":warning: You require a gun to backflip away acrobatically while firing a gun.  Right?");
    }
    else if (SKILL_ALPHA_STRIKE === type && ! (character.weapon instanceof Gun)) {
      return __(":warning: You can only perform an Alpha Strike with a gun.");
    }

    return super.getSkillErrorMessage(character, type);
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
    if (SKILL_BATTLECAST === type) {
      return this.doSkillBattlecast(character);
    }
    // Quick Reload is a Support Skill
    else if (SKILL_BACKFLIP === type) {
      return this.doSkillBackflip(character);
    }
    else if (SKILL_ALPHA_STRIKE === type) {
      return this.doSkillAlphaStrike(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Display a list of spells that can be cast on Tired enemies for 2x damage.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {Attachments}
   */
  doSkillBattlecast(character) {
    let attachments = new Attachments().add({
      title: __('What spell do you want to cast?'),
      fields: character.getFields(),
      color: COLORS.INFO
    });
    let options = new Options();

    // If enemy is tired, add battlecasting flag while getting spell options, so damaging
    // spells show with proper 0 MP cost
    if (character.enemy.hasFlag(FLAGS.TIRED_TURNS)) {
      character.setFlag(FLAGS.IS_BATTLECASTING);
    }

    for (let spellType of character.knownSpells) {
      const spell = Spells.new(spellType);
      const canCastText = (character.mp < spell.getMpCost(character)) ? '✗' : '✓';
      options.add(
        `${spell.getDisplayName(character)}  (${spell.getMpCost(character)}MP ${canCastText})`,
        { action: "battlecast", spell: spellType }
      );
    }

    character.clearFlag(FLAGS.IS_BATTLECASTING);

    attachments.addSelect(__("Spells"), "fight_action", options.getCollection());
    attachments.addButton(__("Cancel"), "look");

    return attachments;
  }

  /**
   * Attack while flipping backwards, gaining range.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillBackflip(character) {
    character.stamina -= STAMINA_BACKFLIP;

    character.setFlag(FLAGS.IS_RANGED);

    let messages = [__("You flip quickly away from %s, attacking as you do.", character.enemy.getDisplayName(character))];

    return messages.concat(Combat.doAttack(character));
  }

  /**
   * Fire off all remaining bullets, with a 50% miss chance, then your gun jams.
   *
   * @param {Character} character - The character performing the skill.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillAlphaStrike(character) {
    let messages = [];
    character.stamina -= STAMINA_ALPHA_STRIKE;
    character.setFlag(FLAGS.IS_ALPHA_STRIKING);
    character.setFlag(FLAGS.IS_JAMMED);

    messages.push(__(":joy: You leap into the air and laugh maniacally while wildly emptying your weapon into %s!", character.enemy.getDisplayName(character)));

    const attacks = character.getFlag(FLAGS.AMMO_COUNT);
    for (let x = 0; x < attacks; x++) {
      messages.push(Combat.doAttack(character, { message: ":angry: A hit!  You deal %s damage to %s.%s", forceAttacks: 1 }));
    }

    character.clearFlag(FLAGS.IS_ALPHA_STRIKING);

    messages.push(__("The last bullet that leaves your gun makes an odd _pinging_ noise as it leaves the chamber."));

    return messages;
  }
}

module.exports = BattleWitch;