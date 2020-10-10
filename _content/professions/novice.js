"use strict";

const Combat     = require('@app/combat');
const Profession = require('@app/content/professions').Profession;
const Items      = require('@app/content/items').Items;

const PROFESSIONS = require('@constants').PROFESSIONS;
const FLAGS       = require('@constants').FLAGS;
const PROPERTIES  = require('@constants').PROPERTIES;

const POTION_RESTORE_HP = require('@constants').POTION_RESTORE_HP;
const ELIXIR_RESTORE_MP = require('@constants').ELIXIR_RESTORE_MP;

const SKILL_FIERCE   = 'fierce';
const STAMINA_FIERCE = 1;
const SP_FIERCE      = 5;
const REQ_SP_FIERCE  = 0;

const SKILL_SOOTHE           = 'soothe';
const STAMINA_SOOTHE         = 6;
const SP_SOOTHE              = 10;
const REQ_SP_SOOTHE          = 25;
const SOOTHE_HP_HEALED       = 10;
const TURNS_SOOTHED          = 5;

const SKILL_FIND_WEAKNESS   = 'find_weakness';
const STAMINA_FIND_WEAKNESS = 3;
const SP_FIND_WEAKNESS      = 15;
const REQ_SP_FIND_WEAKNESS  = 55;

const SKILL_EXPLOIT_WEAKNESS   = 'exploit_weakness';
const STAMINA_EXPLOIT_WEAKNESS = 3;
const SP_EXPLOIT_WEAKNESS      = 20;
const REQ_SP_EXPLOIT_WEAKNESS  = 120;

class Novice extends Profession {
  constructor() {
    super({
      type: PROFESSIONS.NOVICE,
      displayName: 'Novice',
      description: __('Everyone has to start somewhere.'),
      details: __("Novices are pretty poor at all things, but their lack of specialization allows them to observe and learn all things equally."),
      adText: __("*Offence:* (50% Force) + (50% Technique)"),
      image: 'professions/novice.png',
      maxSp: 225,
      masteryDescription: __("Your potions and elixirs will permanently restore an extra 50 HP/MP and you gain access to Soothe as a Support Skill."),
      masteryImprovementDescription: "Gain a permanent %d HP/MP potion/elixir bonus (%d bonus total).",
      spMastery: 25,
      reqSpMastery: 200,
      supportSkill: SKILL_SOOTHE,
    });
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
      this.getNextMasteryIncrement(character) * POTION_RESTORE_HP,
      this.getMasteryBonus(character, nextLevel) * POTION_RESTORE_HP
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
    if (level === 1) {
      return 1;
    }
    else if (level === 2) {
      return 2;
    }
    else {
      return (level - 2) * 0.5 + 2;
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
      return 1;
    }

    return 0.5;
  }

  /**
   * Get the offence stat for Novices.
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
   * Convert potion stock to equivalent amount, given new potion healing amount.
   *
   * @param {Character} character - The character mastering this profession.
   */
  async performMasteryActions(character) {
    const rewardText = await super.performMasteryActions(character);

    const potion = Items.new('consumables-potion');
    const potionsOwned = character.inventory.quantity('consumables-potion');
    const oldPotionHealthTotal = potionsOwned * POTION_RESTORE_HP;
    const newPotionHealing = potion.getRestoreHp(character);
    const newPotionCount = Math.ceil(oldPotionHealthTotal / newPotionHealing);

    character.inventory.remove('consumables-potion', potionsOwned - newPotionCount);

    const elixir = Items.new('consumables-elixir');
    const elixirsOwned = character.inventory.quantity('consumables-elixir');
    const oldElixirManaTotal = elixirsOwned * ELIXIR_RESTORE_MP;
    const newElixirRestoration = elixir.getRestoreMp(character);
    const newElixirCount = Math.ceil(oldElixirManaTotal / newElixirRestoration);

    character.inventory.remove('consumables-elixir', elixirsOwned - newElixirCount);

    return rewardText;
  }

  /**
   * Convert potion stock AGAIN.
   *
   * @param {Character} character - The character improving their mastery.
   */
  async performImproveMasteryActions(character) {
    const rewardText = await super.performImproveMasteryActions(character);

    const potionsOwned = character.inventory.quantity('consumables-potion');

    const oldPotionMultiplier = this.getMasteryBonus(character);
    const oldPotionHealing = POTION_RESTORE_HP * oldPotionMultiplier;
    const oldPotionHealthTotal = potionsOwned * oldPotionHealing;

    const newPotionMultiplier = this.getMasteryBonus(character, this.getMasteryLevel(character) + 1);
    const newPotionHealing = POTION_RESTORE_HP * newPotionMultiplier;
    const newPotionCount = Math.ceil(oldPotionHealthTotal / newPotionHealing);

    character.inventory.remove('consumables-potion', potionsOwned - newPotionCount);

    const elixirsOwned = character.inventory.quantity('consumables-elixir');

    const oldElixirMultiplier = this.getMasteryBonus(character);
    const oldElixirRestoration = ELIXIR_RESTORE_MP * oldElixirMultiplier;
    const oldElixirManaTotal = elixirsOwned * oldElixirRestoration;

    const newElixirMultiplier = this.getMasteryBonus(character, this.getMasteryLevel(character) + 1);
    const newElixirRestoration = ELIXIR_RESTORE_MP * newElixirMultiplier;
    const newElixirCount = Math.ceil(oldElixirManaTotal / newElixirRestoration);

    character.inventory.remove('consumables-elixir', elixirsOwned - newElixirCount);

    return rewardText;
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
        costs: [ 5, 5, 5, 5, 5, 10, 10, 10, 10, 10 ]
      },
      maxMp: {
        increase: 5,
        costs: [ 5, 5, 5, 5, 5, 10, 10, 10, 10, 10 ]
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
      [SKILL_FIERCE]: {
        name: __("Fierce"),
        description: __("Does double damage to Tired enemies."),
        cost: STAMINA_FIERCE,
        spCost: SP_FIERCE,
        reqSp: REQ_SP_FIERCE,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_SOOTHE]: {
        name: __("Soothe"),
        description: __("Once per fight, heal %d HP over the next %d turns.", SOOTHE_HP_HEALED * TURNS_SOOTHED, TURNS_SOOTHED),
        cost: STAMINA_SOOTHE,
        spCost: SP_SOOTHE,
        reqSp: REQ_SP_SOOTHE,
        properties: [],
      },
      [SKILL_FIND_WEAKNESS]: {
        name: __("Find Weakness"),
        description: __("Guarantees a critical hit on the following turn."),
        cost: STAMINA_FIND_WEAKNESS,
        spCost: SP_FIND_WEAKNESS,
        reqSp: REQ_SP_FIND_WEAKNESS,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
      [SKILL_EXPLOIT_WEAKNESS]: {
        name: __("Exploit Weakness"),
        description: __("An attack that ignores a third of enemy defences."),
        cost: STAMINA_EXPLOIT_WEAKNESS,
        spCost: SP_EXPLOIT_WEAKNESS,
        reqSp: REQ_SP_EXPLOIT_WEAKNESS,
        properties: [
          PROPERTIES.IS_ATTACK,
        ],
      },
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
    if (SKILL_FIERCE === type) {
      return this.doSkillFierce(character);
    }
    // Soothe is a Support Skill
    else if (SKILL_FIND_WEAKNESS === type) {
      return this.doSkillFindWeakness(character);
    }
    else if (SKILL_EXPLOIT_WEAKNESS === type) {
      return this.doSkillExploitWeakness(character);
    }

    return super.doSkill(character, type);
  }

  /**
   * Perform a fierce attack.
   *
   * If attacking a tired enemy, do 200% damage.
   * If attacking any other enemy, do 50% damage.
   *
   * @param {Character} character - The character performing the fierce attack.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillFierce(character) {
    let messages   = [];
    let enemy      = character.enemy;
    let attackInfo = character.getAttackInfo(enemy);

    // Dodged?  No damage!
    if (attackInfo.didDodge) {
      messages.push(__(":dash: You wildly attack %s, but they easily dodge your attack!", enemy.getDisplayName(character)));
    }

    // Missed?  No damage!
    else if (attackInfo.didMiss) {
      messages.push(__(":dash: You widly attack %s, but completely miss!", enemy.getDisplayName(character)));
    }

    // Otherwise, enemy got hurt
    else {
      let critText   = attackInfo.didCrit ? __(' _Critical hit!_') : '';
      let attackText = '';
      let damageText = '';

      // If enemy is tired, 200% damage
      if (enemy.isTired()) {
        attackInfo.damage *= 2;
        attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
        damageText = __(":rage: You lash into %s while they are too tired to properly defend themselves, dealing %s damage.%s", enemy.getDisplayName(character), attackText, critText);

        // If not tired, 50% damage
      }
      else {
        attackInfo.damage = Math.ceil(attackInfo.damage / 2);
        attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
        damageText = __(":fearful: You wildly attack %s, but they aren't tired and can easily defend themselves, and take only %s damage.%s", enemy.getDisplayName(character), attackText, critText);
      }

      messages.push(damageText);
      enemy.decreaseHp(attackInfo.damage);
    }

    character.stamina -= STAMINA_FIERCE;
    character.weapon.consumeAmmo(character, 1);

    return messages;
  }

  /**
   * Expose an enemy's weakness.
   *
   * @param {Character} character - The character performing the fierce attack.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillFindWeakness(character) {
    let messages = Combat.doAttack(character);

    character.enemy.setFlag(FLAGS.IS_WEAKENED);
    messages.push(__("Your attack has found a weakness.  Your next attack is sure to critically hit!"));

    character.stamina -= STAMINA_FIND_WEAKNESS;

    return messages;
  }

  /**
   * Exploit an enemy's weakness, ignoring 50% of their armour.
   *
   * @param {Character} character - The character exploiting the weakness.
   *
   * @return {array} Messages arising from this skill.
   */
  doSkillExploitWeakness(character) {
    let messages   = [];
    let enemy      = character.enemy;

    let attackInfo = character.getAttackInfo(enemy);

    // Dodged?  No damage!
    if (attackInfo.didDodge) {
      messages.push(__(":dash: You attempt to exploit a weakness in the defences of %s, but they easily dodge your attack!", enemy.getDisplayName(character)));
    }

    // Missed?  No damage!
    else if (attackInfo.didMiss) {
      messages.push(__(":dash: You see a brief moment of weakness in %s, but completely miss when you attack!", enemy.getDisplayName(character)));
    }

    // Otherwise, enemy got hurt
    else {
      let critText   = attackInfo.didCrit ? __(' _Critical hit!_') : '';
      let attackText = '';
      let damageText = '';

      // Actually ignoring armour at the low levels where you play as a Novice won't actually
      // do much.  3 vs 2 is whatever.
      attackInfo.damage = Math.ceil(attackInfo.damage * 1.33);

      attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      damageText = __(":rage: You see a brief moment of weakness in %s and immediately attack, dealing %s damage.%s", enemy.getDisplayName(character), attackText, critText);

      messages.push(damageText);
      enemy.decreaseHp(attackInfo.damage);
    }

    character.stamina -= STAMINA_EXPLOIT_WEAKNESS;
    character.weapon.consumeAmmo(character, 1);

    return messages;
  }
}

module.exports = Novice;