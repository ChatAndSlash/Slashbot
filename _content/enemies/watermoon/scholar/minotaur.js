"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const BerserkAction       = require('@mixins/enemy/actions/berserk').BerserkAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

class MinotaurEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(30),
  BerserkAction(10),
  ConcussAction(10),
  DropsMoondrop(3),
  WatermoonReputation(50)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-minotaur',
      displayName: __("Minotaur"),
      description: __("At first you wonder how a bull got loose in the labyrinth, but then the Minotaur stands up to his full 8 foot height and flexes his broad shoulder and chest muscles.  He has the body of a strong, imposing man, and the head of an angry bull, and is coming right for you!"),
      isBoss: true,
      stats: {
        base: {
          maxHp: 75,
          force: 7,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 45,
          force: 2,
          goldMin: 20,
          goldMax: 25
        }
      },
      fightActions: {
        bash: 20,
        gore: 20,
        charge: 10,
      },
    });
  }

  /**
   * Bashes the character with its hooves for 2x damage.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  bash(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 1.5);
      const critText   = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("%s bashes you with his hooves for %s damage!%s", this.getDisplayName(character), attackText, critText)];
    });
  }

  /**
   * Gores the character with its horns for 3x damage.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  gore(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 2);
      const critText   = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("%s gores you with its horns for %s damage!%s", this.getDisplayName(character), attackText, critText)];
    });
  }

  /**
   * Charges the character and pins them against the wall for 4x damage.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array}
   */
  charge(character) {
    return this.attackHelper(character, (attackInfo) => {
      const damage = Math.ceil(attackInfo.damage * 2.5);
      const critText   = attackInfo.didCrit && damage > 0 ? __(' _Critical hit!_') : '';
      const attackText = damage > 0 ? `*${damage}*` : __('no');

      character.decreaseHp(damage);

      return [__("%s charges you and pins you against the wall for %s damage!%s", this.getDisplayName(character), attackText, critText)];
    });
  }

  /**
   * Set a flag indicating this boss has been defeated.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    character.setFlag(FLAGS.BOSS_DEFEATED_ + this.type);

    character.track('Minotaur Defeated');

    return super.doFightSuccess(character, messages);
  }

  /**
   * Do any extra actions required when running.
   *
   * @param {Character} character - The character doing the running.
   * @param {array} message - The previously-generated messages.
   *
   * @return {array}
   */
  doFightRun(character, messages) {
    messages = super.doFightRun(character, messages);

    this.leaveLabyrinth(character);
    messages.push(__("The %s chases you right out of the Labyrinth!", this.getDisplayName(character)));

    return messages;
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
    messages = super.doFightFailure(character, messages);

    this.leaveLabyrinth(character);
    messages.push(__("As you pass into unconsciousness, you can feel your body being dragged out of the Labyrinth.", this.getDisplayName(character)));

    return messages;
  }

  /**
   * Move the character out of the Labyrinth into the quad.
   *
   * @param {Character} character - The character being moved out of the Labyrinth.
   */
  leaveLabyrinth(character) {
    const Locations = require('@app/content/locations').Locations;
    character.location = Locations.new('watermoon-scholar-quad');
  }
}

module.exports = MinotaurEnemy;