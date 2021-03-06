"use strict";

const Weapon = require("@app/content/items/equipment/weapons");

const { PROPERTIES, FLAGS, HIDDEN_DAGGERS_CRIT_BONUS } = require('@constants');

/**
 * Hidden Daggers weapon class.
 */
class HiddenDaggersWeapon extends Weapon {
  /**
   * Constructor.
   *
   * @param {object} info - The initialization information.
   */
  constructor(info) {
    super(info);

    this.properties.push(PROPERTIES.DEFEND_CRIT_CHANCE);
  }

  /**
   * Do any actions that might happen after each round of combat (regen, etc.)
   *
   * @param {Character} character - The character in combat.
   *
   * @return {array} The messages generated by these actions.
   */
  doPostRoundActions(character) {
    if (character.hasFlag(FLAGS.HAS_DAGGERS_HIDDEN)) {
      return ["Your daggers are hidden, waiting for you to unleash a sneaky attack."];
    }

    return [];
  }

  /**
   * Perform a defend action.
   *
   * @param {Character} character - The character defending.
   *
   * @return {array} The messages generated.
   */
  doDefend(character) {
    character.setFlag(FLAGS.HAS_DAGGERS_HIDDEN);

    return [`You hide your daggers, concealing the location of your next attack and gaining +${HIDDEN_DAGGERS_CRIT_BONUS}% crit chance on your next attack.`];
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
    character.clearFlag(FLAGS.HAS_DAGGERS_HIDDEN);

    return super.doFightEnd(character, messages);
  }
}

module.exports = HiddenDaggersWeapon;