"use strict";

const { mix }             = require('mixwith');
const { Enemy }           = require('@app/content/enemies');
const { FuriousAction }   = require('@mixins/enemy/actions/furious');
const { DrainLifeAction } = require('@mixins/enemy/actions/drain_life');
const { ChillAction }     = require('@mixins/enemy/actions/chill');
const { getWeighted }     = require('@util/random');
const { pluralize }       = require('@util/text');

const { FLAGS } = require('@constants');

const FLAG_SPOOK_COOLDOWN = 'flag_spook_cooldown';
const FLAG_IS_LAUGHING = 'flag_is_laughing';
const FLAG_IS_POSSESSING = 'flag_is_possessing';
const SPOOK_DURATION = 4;
const SPOOK_COOLDOWN = 6;
const POSSESSION_DURATION = 5;

const DrainSoulAction = DrainLifeAction(20, {
  damageMultiplier: 1.5,
  attackText: ":fog: %s drains a tiny piece of your soul from you, dealing %s damage and gaining %s health.%s"
});

class SpiritDragonEnemy extends mix(Enemy).with(
  FuriousAction(20),
  DrainSoulAction,
  ChillAction(20),
) {
  constructor() {
    super({
      type: 'event-spirit_dragon',
      displayName: 'Spirit Dragon',
      description: 'The monstrous yet half-visible form of a Spirit Dragon floats before you.  You sense a deep well of malice from her, but you can also see the glint of cruel amusement in her eyes, as she considers how to toy with your delicate mortal frame.',
      isBoss: true,
      stats: {
        base: {
          maxHp: 75,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 50,
          goldMin: 10,
          goldMax: 15,
          minDamage: 1.4,
          maxDamage: 1.4,
          force: 1.8,
          defence: 1.8,
        }
      },
    });
  }

  /**
   * Get the fight actions for this enemy.
   *
   * @param {Character} character - The character this enemy is fighting.
   * @param {object} actions - Actions passed in from mixed-in actions.
   *
   * @return {object}
   */
  getFightActions(character, actions = {}) {
    // If character is stunned, don't do any spooky stuff
    if ( ! character.hasFlag(FLAGS.STUNNED_TURNS)) {
      // If has given warning about possession attempt, attempt that possession!
      if (this.hasFlag(FLAG_IS_POSSESSING)) {
        return { possess: 100 };
      }
      // If spooked last turn, laugh for one turn to give a chance to clear daze
      else if (this.hasFlag(FLAG_IS_LAUGHING)) {
        return { laugh: 100 };
      }
      // If SD has recently spooked, maybe they try to possess!
      else if (this.hasFlag(FLAG_SPOOK_COOLDOWN)) {
        actions.possessionWarn = 50;
      }
      // If hasn't recently spooked, chance to spook
      else {
        actions.spook = 20;
      }
    }

    return super.getFightActions(character, actions);
  }

  /**
   * Perform any actions that happen after the round (decrement/clear all timers, etc)
   *
   * @param {Character} character - The character facing this enemy.
   *
   * @return {array} Messages generated by these actions.
   */
  doPostRoundActions(character) {
    let messages = super.doPostRoundActions(character);

    // Character is dazed?
    if (character.hasFlag(FLAGS.DAZED_TURNS)) {
      const turns = character.getFlag(FLAGS.DAZED_TURNS) - 1;
      const turnText = (turns > 0) ? ` for ${turns} more ${pluralize("turn", turns)}` : "";
      messages.push(`:dizzy_face: You stumble a bit, dazed from your ${this.getDisplayName(character)}'s attack${turnText}.  Your defence is 25% lower, and you cannot defend!`);
    }

    if (this.hasFlag(FLAG_SPOOK_COOLDOWN)) {
      this.decrementFlag(FLAG_SPOOK_COOLDOWN);
    }

    return messages;
  }

  /**
   * Special actions to take when this enemy has been beaten.
   *
   * NOTE: Any additionally enqueued messages NEED a delay in order to ensure they show up after
   * the action fight message.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    const scales = getWeighted([
      { 'weight': 50, value: 1 },
      { 'weight': 30, value: 2 },
      { 'weight': 20, value: 3 },
    ]);

    character.scales += scales;
    character.clearFlag(FLAGS.SPIRIT_DRAGON_FIGHTS);

    character.setFlag(FLAGS.IN_CUTSCENE);
    messages = messages.concat([
      "As you land the final blow, your weapon passes through a fine mist where the Spirit Dragon was, just moments before.",
      `It fades into the aether, dropping ${scales} Dragon ${pluralize('Scale', scales)} and some gold to the ground.`,
      "You pick up your loot, looking around cautiously, but the Spirit Dragon seems to have been defeated.  ...For now."
    ]);

    character.slashbot.tellStory(messages, character);

    return [];
  }

  /**
   * Spook the character, dazing them and preparing to possess them!
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  spook(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 1.5);
      const critText   = attackInfo.didCrit && damage > 0 ? ' _Critical hit!_' : '';
      const attackText = damage > 0 ? `*${damage}*` : 'no';

      character.decreaseHp(damage);

      character.setFlag(FLAGS.DAZED_TURNS, SPOOK_DURATION + 1);
      this.setFlag(FLAG_SPOOK_COOLDOWN, SPOOK_COOLDOWN);
      this.setFlag(FLAG_IS_LAUGHING);

      return [`:ghost: ${this.getDisplayName(character)} disappears, then smacks you from behind for ${attackText} damage, spooking you and dazing you.${critText}`];
    });
  }

  /**
   * Spooked character last turn and is laughing because that shit is FUNNY.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  laugh(character) {
    this.clearFlag(FLAG_IS_LAUGHING);

    return [`:rolling_on_the_floor_laughing: ${this.getDisplayName(character)} is too busy laughing about spooking you to do anything this turn.`];
  }

  /**
   * Begin a posession attempt!
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  possessionWarn(character) {
    this.setFlag(FLAG_IS_POSSESSING);

    return [`:hushed: ${this.getDisplayName(character)} attempting to possess you.  Defend yourself!`];
  }

  /**
   * Possess the character, stunning them for 5 turns.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  possess(character) {
    this.clearFlag(FLAG_IS_POSSESSING);

    // If defending possession attempt fails
    if (character.hasFlag(FLAGS.IS_DEFENDING)) {
      return [`:sweat: You Defend yourself and fight off ${this.getDisplayName(character)}'s attempt to possess you!`];
    }
    // If not defending, you're screwed, buddy!
    else {
      character.setFlag(FLAGS.STUNNED_TURNS, POSSESSION_DURATION + 1);
      return [`:fearful: ${this.getDisplayName(character)} possesses you, taking control of your body and stunning you for ${POSSESSION_DURATION} turns!`];
    }
  }
}

module.exports = SpiritDragonEnemy;