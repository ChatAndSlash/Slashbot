"use strict";

const mix            = require('mixwith').mix;
const { difference } = require('lodash');
const { pluralize }  = require('@util/text');
const { fromArray }  = require('@util/random');

const { WatermoonBonusBossEnemy } = require('@app/content/enemies/watermoon/bonus_boss');
const { WatermoonReputation }     = require('@mixins/enemy/reputation/watermoon');
const { DropsMoondrop }           = require('@mixins/enemy/loot/moondrop');

const { FuriousAction }     = require('@mixins/enemy/actions/furious');
const { DefendAction }      = require('@mixins/enemy/actions/defend');
const { StunAction }        = require('@mixins/enemy/actions/stun');
const { ConcussAction }     = require('@mixins/enemy/actions/concuss');
const { PowerAttackAction } = require('@mixins/enemy/actions/power_attack');
const { FallBackAction }    = require('@mixins/enemy/actions/fall_back');
const { MultiAttackAction } = require('@mixins/enemy/actions/multi_attack');
const { BurnAction }        = require('@mixins/enemy/actions/burn');
const { ChillAction }       = require('@mixins/enemy/actions/chill');
const { DazeAction }        = require('@mixins/enemy/actions/daze');

const { PROPERTIES, FLAGS } = require('@constants');

const FLAG_CURRENT_SECTION = 'current_section';
const FLAG_REMAINING_TURNS = 'remaining_turns';
const FLAG_DEFEATED_SECTIONS = 'defeated_sections';
const FLAG_SECTION_HP = 'section_hp';

const SECTION_PIKEMEN  = 'pikemen';
const SECTION_KNIGHTS  = 'knights';
const SECTION_WARMAGES = 'warmages';

const CHARGE_IN_DAMAGE_MULTIPLIER = 2;
const CHARGE_IN_STUN_DURATION = 2;

const TURNS_BETWEEN_SWITCHES = 3;

class SkeletonArmyEnemy extends mix(WatermoonBonusBossEnemy).with(
  FuriousAction(0),
  DefendAction(0),
  MultiAttackAction(0, { minAttacks: 2, maxAttacks: 5 }),
  ConcussAction(0),
  PowerAttackAction(0, {
    multiplier: 3,
    text: "%s surround you and thrash you fiercely for %s damage!%s",
  }),
  FallBackAction(0, {
    attackText: "%s attack you for %s damage as they charge away and gain some distance.",
    multiplier: 1,
    cannotCrit: false,
  }),
  BurnAction(0, {
    isRanged: true,
    dodgeText: ":dash: %s calls down a terrifying storm of fire, but you dodge!",
    missText: "%s spits calls down a terrifying storm of fire, but misses you!",
    attackText: ":fire: %s calls down a terrifying storm of fire, dealing %s damage.%s"
  }),
  ChillAction(0, {
    dodgeText: ":dash: %s conjures a freezing storm of ice, but you dodge!",
    missText: "%s conjures a freezing storm of ice, but misses you!",
    attackText: ":snowflake: %s conjures a freezing storm of ice, dealing %s damage and chilling you.%s"
  }),
  DazeAction(0, {
    dodgeText: ":dash: %s summons a raucous lightning storm, but you dodge!",
    missText: "%s summons a raucous lightning storm, but misses you!",
    attackText: ":zap: %s summons a raucous lightning storm, dealing %s damage %s dazing you for %d turns.%s",
  }),
  StunAction(0, {
    dodgeText: ":dash: %s gather a storm of shadows and fires them at you, but you dodge!",
    missText: "%s gather a storm of shadows and fires them at you, but misses you!",
    attackText: ":new_moon: %s gather a storm of shadows and fires them at you, dealing %s damage and stunning you for %d turn!%s",
  }),
  DropsMoondrop(100, 20),
  WatermoonReputation(150)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-skeleton_army',
      displayName: "Skeleton Army",
      isAre: 'are',
      stats: {
        perLevel: {
          maxHp: 100,  // Reduced HP because 3 forms
        }
      },
    });

    this.districtBosses = [
      'watermoon-mystic-lich_queen',
      'watermoon-mystic-skeleton_army',
      'watermoon-mystic-undying_slime',
    ];

    this.fightActionProperties.chargeIn = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
    ];

    this.bossFlag = FLAGS.MYSTIC_BOSS;
  }

  /**
   * Gets the current section of the army at the front.
   *
   * @return {string}
   */
  getCurrentSection() {
    return this.getFlag(FLAG_CURRENT_SECTION, SECTION_PIKEMEN);
  }

  /**
   * Get the display name of this enemy.
   *
   * @param {Character} character - The character examining this enemy.
   *
   * @return {string}
   */
  getDisplayName(character) {
    switch (this.getCurrentSection()) {
      case SECTION_PIKEMEN:
        return "Skeletal Pikemen";

      case SECTION_KNIGHTS:
        return "Bone Knights";

      case SECTION_WARMAGES:
        return "White Warmages";
    }
  }

  /**
   * What to display after "You encountered " when starting a fight.
   *
   * @param {Character} character - The character encountering the enemy.
   *
   * @return {string}
   */
  getEncounterName(character) {
    return 'a Skeleton Army';
  }

  /**
   * Get any other sections remaining that can be switched to.
   *
   * @return {array}
   */
  getRemainingSections() {
    const defeatedSections = this.getFlag(FLAG_DEFEATED_SECTIONS, []);
    return difference([
      SECTION_PIKEMEN,
      SECTION_KNIGHTS,
      SECTION_WARMAGES
    ], defeatedSections.concat(this.getCurrentSection()));
  }

  /**
   * Get the description for this enemy and character.
   * Allows for custom logic on a per-character basis.
   *
   * @param {Character} character - The character getting enemy description.
   *
   * @return {array}
   */
  getDescription(character) {
    switch (this.getCurrentSection()) {
      case SECTION_PIKEMEN:
        return "A tight formation of skeletal pikemen face you, this section of the Skeleton Army having taken the forefront.  Their bristling pikes are too close for comfort, while their shields and the skeletons behind them seem far, far in the distance.";

      case SECTION_KNIGHTS:
        return "Boney knights on boney horses wearing bone armour wielding bone lances come charging at you!  Faster and more agile than normal mounted knights, you'll have to stay on your toes to survive.";

      case SECTION_WARMAGES:
        return "While these skeletons wear bleached white robes, all the colours of the elements fly beetween their boney fingers, as they weave devastating war magic and prepare to hurl it your way!";
    }
  }

  /**
   * Return the fight actions of this enemy as a weighted array for Random.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {array}
   */
  getWeightedFightActions(character) {
    switch (this.getCurrentSection()) {
      case SECTION_PIKEMEN:
        return [
          { value: 'getFurious', weight: 40 },
          { value: 'defend', weight: 20 },
          { value: 'multiAttack', weight: 20 },
          { value: 'doAttack', weight: 20 },
        ];

      case SECTION_KNIGHTS:
        if (this.hasFlag(FLAGS.IS_RANGED)) {
          return [
            { value: 'chargeIn', weight: 100 },
          ];
        }
        else {
          return [
            { value: 'getFurious', weight: 20 },
            { value: 'concuss', weight: 20 },
            { value: 'powerAttack', weight: 20 },
            { value: 'fallBack', weight: 20 },
            { value: 'doAttack', weight: 20 },
          ];
        }

      case SECTION_WARMAGES:
        return [
          { value: 'burn', weight: 40 },
          { value: 'chill', weight: 20 },
          { value: 'daze', weight: 20 },
          { value: 'doStun', weight: 20 },
        ];
    }
  }

  /**
   * Charge in to range.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  chargeIn(character) {
    this.setFlag(FLAGS.DAMAGE_MODIFIER, CHARGE_IN_DAMAGE_MULTIPLIER);
    this.clearFlag(FLAGS.IS_RANGED);
    character.setFlag(FLAGS.STUNNED_TURNS, CHARGE_IN_STUN_DURATION + 1);

    return this.attackHelper(character, (attackInfo) => {
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : "no";
      character.decreaseHp(attackInfo.damage);

      return [`${this.getDisplayName(character)} charge back towards you, inflicting a stunning ${damageText} damage and stunning you for ${CHARGE_IN_STUN_DURATION} ${pluralize('turn', CHARGE_IN_STUN_DURATION)}!`];
    });
  }

  /**
   * Every three rounds, swap to another section.
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(opponent) {
    let messages = super.doPostRoundActions(opponent);

    // If at 0 hp and any sections remain to switch to, swap and reset swap timer
    const remainingSections = this.getRemainingSections();
    if (this.hp <= 0 && remainingSections.length > 0) {
      // Save old section
      const oldSection = this.getCurrentSection();
      const oldName = this.getDisplayName(opponent);
      const defeatedSections = this.getFlag(FLAG_DEFEATED_SECTIONS, []);
      this.setFlag(FLAG_DEFEATED_SECTIONS, defeatedSections.concat([oldSection]));

      // Change to new section
      const newSection = fromArray(remainingSections);
      this.setFlag(FLAG_CURRENT_SECTION, newSection);
      const newName = this.getDisplayName(opponent);
      this.hp = this.getFlag(`${FLAG_SECTION_HP}_${newSection}`, this.maxHp);

      // Reset counter
      this.setFlag(FLAG_REMAINING_TURNS, TURNS_BETWEEN_SWITCHES - 1);

      return [`:skull_and_crossbones: ${oldName} have been defeated! ${newName} step forward to take the field.`];
    }
    else {
      const remainingTurns = this.getFlag(FLAG_REMAINING_TURNS, TURNS_BETWEEN_SWITCHES - 1);
      if (0 === remainingTurns) {
        messages = messages.concat(this.switchToNewSection(opponent));
      }
      else {
        // Can't use decrement, it might not be set yet
        this.setFlag(FLAG_REMAINING_TURNS, remainingTurns - 1);
      }
    }

    return messages;
  }

  /**
   * Switch to a new section.
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  switchToNewSection(opponent) {
    const remainingSections = this.getRemainingSections();

    if (remainingSections.length) {
      // Save old section
      const oldSection = this.getCurrentSection();
      const oldName = this.getDisplayName(opponent);
      this.setFlag(`${FLAG_SECTION_HP}_${oldSection}`, this.hp + (Math.min(this.maxHp / 10)));

      // Change to new section
      const newSection = fromArray(remainingSections);
      this.setFlag(FLAG_CURRENT_SECTION, newSection);
      const newName = this.getDisplayName(opponent);
      this.hp = this.getFlag(`${FLAG_SECTION_HP}_${newSection}`, this.maxHp);

      // Can't have more than max HP
      this.hp = Math.min(this.hp, this.maxHp);

      // Reset counter
      this.setFlag(FLAG_REMAINING_TURNS, TURNS_BETWEEN_SWITCHES - 1);

      return [`:skull: ${oldName} retreat in an orderly fashion to regroup and heal, allowing ${newName} to take the field.`];
    }

    return [];
  }

  /**
   * Not dead if any sections remain to switch to!
   *
   * @return boolean
   */
  isDead() {
    return super.isDead() && this.getRemainingSections().length === 0;
  }

  /**
   * Clear all Mystic
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    character.clearFlag(FLAGS.NECRODRAGON_DEFEATS);
    character.clearFlag(FLAGS.NECRODRAGON_HEALTH);
    character.clearFlag(FLAGS.CATACOMBS_OPEN);
    character.clearFlag(FLAGS.FAITH_PORTAL_OPEN);
    character.clearFlag(FLAGS.SHADOW_PORTAL_OPEN);
    character.clearFlag(FLAGS.DEATH_PORTAL_OPEN);
    character.clearFlag(FLAGS.FAITH_BOSS_DEFEATED);
    character.clearFlag(FLAGS.SHADOW_BOSS_DEFEATED);
    character.clearFlag(FLAGS.DEATH_BOSS_DEFEATED);

    super.doFightSuccess(character, messages);

    return [];
  }
}

module.exports = SkeletonArmyEnemy;