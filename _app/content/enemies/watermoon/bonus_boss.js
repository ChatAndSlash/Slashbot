"use strict";

const { fromArray }      = require('@util/random');
const { WatermoonEnemy } = require("@app/content/enemies/watermoon");
const { pluralize }      = require('@util/text');

const { FLAGS, STATS, LYSTONE_CHIP_MAX } = require('@constants');

/**
 * Watermoon bonus boss.
 */
class WatermoonBonusBossEnemy extends WatermoonEnemy {
  constructor(info) {
    super(info);

    this.isBoss = true;
    this.scales = 2;

    this.stats.base.maxHp     = _.get(info, 'stats.base.maxHp', 50);
    this.stats.base.minDamage = _.get(info, 'stats.base.minDamage', 3);
    this.stats.base.maxDamage = _.get(info, 'stats.base.maxDamage', 5);
    this.stats.base.force     = _.get(info, 'stats.base.force', 5);
    this.stats.base.defence   = _.get(info, 'stats.base.defence', 5);
    this.stats.base.goldMin   = _.get(info, 'stats.base.goldMin', 50);
    this.stats.base.goldMax   = _.get(info, 'stats.base.goldMax', 50);

    this.stats.perLevel.maxHp     = _.get(info, 'stats.perLevel.maxHp', 150);
    this.stats.perLevel.minDamage = _.get(info, 'stats.perLevel.minDamage', 1.4);
    this.stats.perLevel.maxDamage = _.get(info, 'stats.perLevel.maxDamage', 1.4);
    this.stats.perLevel.force     = _.get(info, 'stats.perLevel.force', 1.8);
    this.stats.perLevel.defence   = _.get(info, 'stats.perLevel.defence', 1.8);
    this.stats.perLevel.goldMin   = _.get(info, 'stats.perLevel.goldMin', 20);
    this.stats.perLevel.goldMax   = _.get(info, 'stats.perLevel.goldMax', 25);

    this.bossFlag = '';
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
    messages = super.doFightSuccess(character, messages);

    if (this.isFirstKill(character)) {
      character.incrementFlag(FLAGS.LYSTONE_CHIP_COUNT);

      messages.push(":gem: While collecting your loot, you notice a green glint.  Sure enough, it's a chip of Lystone.  You pick it up and slot it into its matching spot on your Lystone, where it fuses instantly.");

      // Found all the chips?
      const chipCount = character.getFlag(FLAGS.LYSTONE_CHIP_COUNT);
      if (chipCount === LYSTONE_CHIP_MAX) {
        messages.push(`:bangbang: You have all ${LYSTONE_CHIP_MAX} Lystone chips!  Maybe if you bring it back to Aureth, the two of you can figure out something to do with it.`);
      }
      else {
        // Still more chips to collect in this district?
        const remainingBosses = this.getRemainingBosses(character);
        const collectedChips = 3 - remainingBosses.length;
        if (remainingBosses.length > 0) {
          messages.push(`:thinking_face: Having collected ${collectedChips} ${pluralize("chip", collectedChips)}, you deduce that there are ${remainingBosses.length} remaining in this district.`);
        }
        // Done with this district.
        else {
          messages.push(":exclamation: Having collected 3 chips, you deduce that you are done with this district.  Time to check out the other districts!");
        }
      }
    }

    // Gotta define this in here to avoid circular content file references
    const Locations = require('@app/content/locations').Locations;
    character.location = Locations.new('watermoon-fountain');

    messages.push("You retrace your steps out of the district, and make your way back to the Fountain.");

    character.track('Bonus Boss Killed');

    this.setNextBoss(character);

    character.setFlag(FLAGS.IN_CUTSCENE);
    character.slashbot.tellStory(messages, character);

    return [];
  }

  /**
   * If this is the first time this character has killed this bonus boss.
   *
   * @param {Character} character - The character to check.
   *
   * @return {boolean}
   */
  isFirstKill(character) {
    return 1 === character.getStat(STATS.ENEMIES_KILLED, this.type);
  }

  /**
   * Get the bosses that remain to have been killed their first time that can still drop lystone
   * chips.
   *
   * @return {array}
   */
  getRemainingBosses(character) {
    return this.districtBosses.filter(bossType => ! character.hasStat(STATS.ENEMIES_KILLED, { subType: bossType }));
  }

  /**
   * Set the next boss this character has to face.
   *
   * Face all 3 bosses at least once, then face any at random.
   *
   * @param {Character} character - The character to set the next boss for.
   */
  setNextBoss(character) {
    const remainingBosses = this.getRemainingBosses(character);
    const bossChoices  = remainingBosses.length
      ? remainingBosses
      : this.districtBosses;

    character.setFlag(this.bossFlag, fromArray(bossChoices));
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

module.exports = {
  WatermoonBonusBossEnemy
};