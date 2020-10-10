"use strict";

const { mix }     = require('mixwith');
const { times }   = require('lodash');
const { between } = require('@util/random');
const { sprintf } = require("sprintf-js");
const { WatermoonBonusBossEnemy } = require('@app/content/enemies/watermoon/bonus_boss');
const { WatermoonReputation }     = require('@mixins/enemy/reputation/watermoon');
const { DropsMoondrop }           = require('@mixins/enemy/loot/moondrop');

const { FLAGS, PROPERTIES } = require('@constants');

const FLAG_IS_CONSUMING_SOUL = 'is_consuming_soul';
const FLAG_DO_SEAL_SOUL_JAR = 'do_seal_soul_jar';
const FLAG_SOUL_JAR_SEALED = 'soul_jar_sealed';

const FIRE_WHEEL_MIN_ATTACKS = 3;
const FIRE_WHEEL_MAX_ATTACKS = 5;
const FIRE_WHEEL_MULTIPLIER = 1;
const FIRE_WHEEL_BURN_TURNS = 4;

const FLAG_POISON_SPIKE_COOLDOWN = 'turns_cooldown_poison_spike';
const POISON_SPIKE_ATTACK_MULTIPLIER = 2;
const POISON_SPIKE_POISON_MULTIPLIER = 0.75;
const POISON_SPIKE_DURATION = 6;

const FLAG_ICE_PRISON_TURNS = 'turns_ice_prison';
const ICE_PRISON_TURNS = 3;
const FLAG_ICE_PRISON_COOLDOWN = 'turns_cooldown_ice_prison';
const ICE_PRISON_COOLDOWN_TURNS = 5;
const FLAG_MELTED_ICE_PRISON = 'melted_ice_prison';

class LichQueenEnemy extends mix(WatermoonBonusBossEnemy).with(
  DropsMoondrop(100, 20),
  WatermoonReputation(150)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-lich_queen',
      displayName: "Lich Queen",
      description: "Tall, dark, and mysterious, yet the Lich Queen isn't anyone you'd want to be interested in you for any reason.  For one, the fact that she's floating just off the floor is unsettling.  But mainly, it's the dark incantations she's muttering under her breath and the flashes of pure evil you can see in her eyes!",
    });

    this.districtBosses = [
      'watermoon-mystic-lich_queen',
      'watermoon-mystic-skeleton_army',
      'watermoon-mystic-undying_slime',
    ];

    this.fightActionProperties.castFireWheel = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
      PROPERTIES.BURN_ATTACK,
    ];
    this.fightActionProperties.castPoisonSpike = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
    ];
    this.fightActionProperties.castIcePrison = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
    ];
    this.fightActionProperties.castShadowBolt = [
      PROPERTIES.IS_ATTACK,
      PROPERTIES.RANGED_ATTACK,
    ];

    this.bossFlag = FLAGS.MYSTIC_BOSS;
  }

  /**
   * Return the fight actions of this enemy as a weighted array for Random.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {array}
   */
  getWeightedFightActions(character) {
    // If soul jar is open, consume soul and heal
    if (this.hasFlag(FLAG_IS_CONSUMING_SOUL)) {
      return [
        { value: 'consumeSoul', weight: 100 },
      ];
    }
    // Ice attack was used, seal that soul jar
    else if (this.hasFlag(FLAG_DO_SEAL_SOUL_JAR)) {
      return [
        { value: 'sealSoulJar', weight: 100 },
      ];
    }
    // If has access to soul jar & under 50% max HP
    else if ( ! this.hasFlag(FLAG_SOUL_JAR_SEALED) && this.hp <= this.maxHp / 2) {
      return [
        { value: 'openSoulJar', weight: 100 },
      ];
    }
    else {
      let spells = [];

      // If cold compress not set, can cast fire wheel
      if ( ! character.hasFlag(FLAGS.COLD_COMPRESS_TURNS)) {
        spells.push('castFireWheel');
      }

      if ( ! this.hasFlag(FLAG_POISON_SPIKE_COOLDOWN)) {
        spells.push('castPoisonSpike');
      }

      if ( ! this.hasFlag(FLAG_ICE_PRISON_COOLDOWN)) {
        spells.push('castIcePrison');
      }

      spells.push('castShadowBolt');

      // Evenly split the chance of all valid spells
      return spells.map(name => ({ value: name, weight: Math.ceil(100 / spells.length) }));
    }
  }

  /**
   * Set a flag for this character.
   * If chilled when Soul Jar is open, seal it!
   *
   * @param {string} flag - The flag to set.
   * @param {mixed} value - The value to set (default true).
   *
   * @return {void}
   */
  setFlag(flag, value = true) {
    // If soul jar is open and ice effect is being applied
    if (this.hasFlag(FLAG_IS_CONSUMING_SOUL) && flag === FLAGS.CHILLED_TURNS) {
      // Seal that soul jar
      this.clearFlag(FLAG_IS_CONSUMING_SOUL);
      this.setFlag(FLAG_DO_SEAL_SOUL_JAR);
    }

    // If character trapped in ice and burn effect is being applied
    if (this.character.hasFlag(FLAG_ICE_PRISON_TURNS) && flag === FLAGS.BURNED_TURNS) {
      // Melt that prison!
      this.character.clearFlag(FLAG_ICE_PRISON_TURNS);
      this.setFlag(FLAG_MELTED_ICE_PRISON);
    }

    super.setFlag(flag, value);
  }

  /**
   * Special actions to take when this enemy has won.
   *
   * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
   * the action fight message.
   *
   * @param {Character} character - The character who lost the fight.
   *
   * @return array
   */
  doFightFailure(character, messages) {
    character.setFlag(FLAGS.DIED_TO_LICH_QUEEN);
    messages = messages.concat(`:thinking_face: As you fade into unconciousness, you wonder about the ${this.getDisplayName(character)}'s Soul Jar.  There *must* be a way to counter it!  Maybe someone in town knows...`);

    return messages;
  }

  /**
   * Perform any actions that happen after the round (decrement/clear all timers, etc)
   *
   * @param {Combatant} opponent - The current combatant's opponent.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(opponent) {
    let messages = super.doPostRoundActions(opponent);

    this.decrementFlag(FLAG_POISON_SPIKE_COOLDOWN);
    this.decrementFlag(FLAG_ICE_PRISON_COOLDOWN);
    opponent.decrementFlag(FLAG_ICE_PRISON_TURNS);

    if (this.hasFlag(FLAG_MELTED_ICE_PRISON)) {
      this.clearFlag(FLAG_MELTED_ICE_PRISON);
      this.clearFlag(FLAGS.IS_RANGED);
      opponent.clearFlag(FLAGS.IS_RANGED);
      messages.push(":droplet: The heat of your spell has melted the prison of ice.");
    }

    if (opponent.hasFlag(FLAG_ICE_PRISON_TURNS)) {
      const turns = opponent.getFlag(FLAG_ICE_PRISON_TURNS);
      messages.push(`:snowflake: You are trapped in the prison of ice for ${turns} rounds, unable to melee attack!`);
    }

    return messages;
  }

  /**
   * Open the Soul Jar, and begin consuming a soul.
   *
   * @param {Character} character - The character being fought.
   *
   * @return {array}
   */
  openSoulJar(character) {
    this.setFlag(FLAG_IS_CONSUMING_SOUL);

    return [`:ghost: ${this.getDisplayName(character)} opens her Soul Jar and begins consuming a soul...`];
  }

  /**
   * Ice attack was used this turn, seal the soul jar.
   *
   * @param {Character} The character being fought.
   *
   * @return {array}
   */
  sealSoulJar(character) {
    this.setFlag(FLAG_SOUL_JAR_SEALED);
    this.clearFlag(FLAG_DO_SEAL_SOUL_JAR);
    this.clearFlag(FLAG_IS_CONSUMING_SOUL);

    return [`:snowflake: The ice seals ${this.getDisplayName(character)}'s Soul Jar tight!  She is unable to consume any more souls.`];
  }

  /**
   * Consume a soul from the Soul Jar and heal to full.
   *
   * @param {Character} The character being fought.
   *
   * @return {array}
   */
  consumeSoul(character) {
    this.clearFlag(FLAG_IS_CONSUMING_SOUL);
    const healed = this.increaseHp(this.maxHp);

    return [`${this.getDisplayName(character)} consumes a soul from her Soul Jar and heals ${healed} HP!`];
  }

  /**
   * Cast fire wheel.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  castFireWheel(character) {
    const attackText = ":fire: The flaming wheel sears you for %s!%s%s";
    const dodgeText = "You manage to dodge out of the way of the flaming wheel.";
    const missText = "The flaming wheel totters wildly and misses you.";
    const attacks = between(FIRE_WHEEL_MIN_ATTACKS, FIRE_WHEEL_MAX_ATTACKS);

    let messages = [`:fire: ${this.getDisplayName(character)}'s hands begin to burn as she conjures forth a flaming wheel and hurls it at you!`];
    times(attacks, () => {
      const burnText = character.hasFlag(FLAGS.BURNED_TURNS) ? " :fire: Extra burn damage!" : "";

      messages = messages.concat(this.attackHelper(character, (attackInfo) => {
        const damage = Math.ceil(attackInfo.damage * FIRE_WHEEL_MULTIPLIER);

        const damageText = damage > 0 ? `*${damage}*` : "no";
        const critText   = attackInfo.didCrit && damage > 0 ? " _Critical hit!_" : "";

        character.decreaseHp(damage);

        return sprintf(attackText, damageText, critText, burnText);
      }, dodgeText, missText));
    });

    messages = messages.concat(character.addStatusBurned(FIRE_WHEEL_BURN_TURNS));

    return messages;
  }

  /**
   * Cast poison spike.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  castPoisonSpike(character) {
    const attackText = "You move too slowly, and the spike impales you!  You take %s damage.%s";
    const dodgeText = "You dodge quickly to the side!";
    const missText = "The spike misses you entirely!";

    let messages = [];
    messages.push(`${this.getDisplayName()} thrusts her hands high, and a giant green spike bursts from the ground.`);
    messages = messages.concat(this.attackHelper(character, (attackInfo) => {
      let messages = [];

      attackInfo.damage = Math.ceil(attackInfo.damage * POISON_SPIKE_ATTACK_MULTIPLIER);
      character.decreaseHp(attackInfo.damage);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(sprintf(attackText, damageText, critText));
      messages.push(":face_vomiting: The spike was poisoned, and now you are too!");

      this.setFlag(FLAG_POISON_SPIKE_COOLDOWN, POISON_SPIKE_DURATION + 1);
      character.setFlag(FLAGS.POISONED_TURNS, POISON_SPIKE_DURATION + 1);
      character.setFlag(FLAGS.POISON_DAMAGE, this.getPoisonDamage(character));

      return messages;
    }, dodgeText, missText, [PROPERTIES.RANGED_ATTACK]));

    return messages;
  }

  /**
   * Get the amount of damage this enemy's poison attack does.
   * Note: Poison cannot crit.
   *
   * @param {Combatant} opponent - The opponent to poison.
   *
   * @return {integer}
   */
  getPoisonDamage(opponent) {
    const attackInfo = this.getEffectAttackInfo(opponent);
    return Math.max(1, Math.ceil(attackInfo.damage * POISON_SPIKE_POISON_MULTIPLIER));
  }

  /**
   * Encases the character in an ice prison.
   *
   * @param {Combatant} character - The character being encased in an ice prison.
   */
  castIcePrison(character) {
    const attackText = "A prison of ice encases you!  You take %s damage.%s";
    const dodgeText = "You leap aside as a pillar of ice rises from the ground!";
    const missText = "The pillar of ice shoots up from the ground, missing you completely!";

    let messages = [];
    messages.push(`${this.getDisplayName()} chants for a moment, as the air grows colder.`);
    messages = messages.concat(this.attackHelper(character, (attackInfo) => {
      let messages = [];

      character.decreaseHp(attackInfo.damage);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(sprintf(attackText, damageText, critText));

      character.setFlag(FLAG_ICE_PRISON_TURNS, ICE_PRISON_TURNS + 1);
      character.setFlag(FLAGS.IS_RANGED);

      this.setFlag(FLAG_ICE_PRISON_COOLDOWN, ICE_PRISON_COOLDOWN_TURNS + 1);

      return messages;
    }, dodgeText, missText, [PROPERTIES.RANGED_ATTACK]));

    return messages;
  }

  /**
   * Opponent cannot close distance if they are in an ice prison.
   *
   * @param {Combatant} opponent - The opposing combatant.
   *
   * @return {boolean}
   */
  canCloseDistance(opponent) {
    return super.canCloseDistance(opponent) && ! opponent.hasFlag(FLAG_ICE_PRISON_TURNS);
  }

  /**
   * The message returned when failing to close distance.
   *
   * @param {Combatant} opponent - The opposing combatant.
   *
   * @return {string}
   */
  getCloseDistanceFailureMessage(opponent) {
    return "You are trapped in the prison of ice and cannot close the distance!";
  }

  /**
   * Cast a bolt of shadow, disabling a random skill for a turn.
   *
   * @param {Combatant} character - The character being attacked.
   */
  castShadowBolt(character) {
    const attackText = ":new_moon: %s hits you with a bolt of pure shadow, inflicting %s damage.%s";
    const dodgeText = `You dodge the bolt of shadow that ${this.getDisplayName()} casts at you!`;
    const missText = `${this.getDisplayName()} casts a bolt of shadow at you, but misses completely!`;

    let messages = [];
    messages.push(`Shadows begin to grow around ${this.getDisplayName()}.`);
    messages = messages.concat(this.attackHelper(character, (attackInfo) => {
      let messages = [];

      character.decreaseHp(attackInfo.damage);

      const critText   = attackInfo.didCrit && attackInfo.damage > 0 ? __(' _Critical hit!_') : '';
      const damageText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(sprintf(attackText, this.getDisplayName(), damageText, critText));

      // Disable a random ability for a turn
      const skills = Object.values(character.profession.getSkills(character));
      const slot = between(0, skills.length - 1);
      const skill = skills[slot];
      character.setFlag(`${FLAGS.SKILL_SLOT_DISABLED_TURNS}_${slot}`, 2);
      messages.push(`The shadow bolt has temporarily disabled your ${skill.name} skill.`);

      return messages;
    }, dodgeText, missText, [PROPERTIES.RANGED_ATTACK]));

    return messages;
  }

  /**
   * Clear all Mystic flags.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    // Clear conversation flag - no need to have this conversation again!
    character.clearFlag(FLAGS.DIED_TO_LICH_QUEEN);

    character.clearFlag(FLAGS.NECRODRAGON_DEFEATS);
    character.clearFlag(FLAGS.NECRODRAGON_HEALTH);
    character.clearFlag(FLAGS.CATACOMBS_OPEN);
    character.clearFlag(FLAGS.FAITH_PORTAL_OPEN);
    character.clearFlag(FLAGS.SHADOW_PORTAL_OPEN);
    character.clearFlag(FLAGS.DEATH_PORTAL_OPEN);
    character.clearFlag(FLAGS.FAITH_BOSS_DEFEATED);
    character.clearFlag(FLAGS.SHADOW_BOSS_DEFEATED);
    character.clearFlag(FLAGS.DEATH_BOSS_DEFEATED);

    return super.doFightSuccess(character, messages);
  }
}

module.exports = LichQueenEnemy;