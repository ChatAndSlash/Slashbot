"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;
const Random              = require('@util/random');
const Loot                = require('@app/loot').Loot;
const LootSlot            = require('@app/loot').LootSlot;

const FlailAction = DazeAction(10, {
  dodgeText: ":dash: %s flails at you with its tentacles, but you dodge!",
  missText: "%s flails at you with its tentacles, but misses!",
  attackText: ":wavy_dash: %s flails at you with its tentacles, dealing %s damage %s dazing you for %d turns.%s"
});

const FLAGS = require('@constants').FLAGS;

const FLAG_IS_GRABBING = 'is_grabbing';

const GRAB_BONUS_DAMAGE = 2.5;

class FaithBossEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  DropsMoondrop(100, 3),
  CurseAction(15),
  FlailAction,
  WatermoonReputation(25)
) {
  constructor() {
    super({
      type: 'watermoon-mystic-faith-boss',
      displayName: 'Tentacled Demigod',
      description: "Trying to describe this horrendous beast is difficult at best, as your mind recoils when you try to focus on any specific feature.  Despite this, you can barely make out a beak, several eyes, and a whirling mass of tentacles.",
      isBoss: true,
      stats: {
        base: {
          maxHp: 75,
          force: 7,
          goldMin: 50,
          goldMax: 50
        },
        perLevel: {
          maxHp: 35,
          force: 1,
          goldMin: 20,
          goldMax: 25
        }
      },
      fightActions: {
        grab: 15
      },
      loot: new Loot(
        new LootSlot().addEntry(100, 'quest-watermoon-faith_soul_gem')
      )
    });
  }

  /**
   * Choose the fight action for this enemy.
   *
   * @param {Character} character - The character this enemy is fighting.
   *
   * @return {string}
   */
  chooseFightAction(character) {
    if (this.hasFlag(FLAG_IS_GRABBING)) {
      return 'beGrabbing';
    }

    return super.chooseFightAction(character);
  }

  /**
   * Grab character, stunning for one round.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array} Messages describing the attack.
   */
  grab(character) {
    character.setFlag(FLAGS.STUNNED_TURNS, 2);
    this.setFlag(FLAG_IS_GRABBING);

    return [__("%s grabs you with its tentacles.  You can't move!", this.getDisplayName(character))];
  }

  /**
   * 25% chance to break free w/ no damage.
   * 75% chance to get bitten for 2.5x damage, then break free.
   *
   * @param {Character} character - The character being attacked.
   *
   * @return {array} Messages describing the attack.
   */
  beGrabbing(character) {
    let messages = [];
    this.clearFlag(FLAG_IS_GRABBING);

    // Break free with no damage
    if (Random.between(1, 4) === 1) {
      messages.push(__("You break free of %s's hold!", this.getDisplayName(character)));
    }
    // Take 2.5x damage, then break free
    else {
      const attackInfo = this.getEffectAttackInfo(character);
      const critText = attackInfo.didCrit ? __(' _Critical hit!_') : '';
      attackInfo.damage = Math.ceil(attackInfo.damage * GRAB_BONUS_DAMAGE);
      const attackText = attackInfo.damage > 0 ? `*${attackInfo.damage}*` : __('no');
      messages.push(__(":scream: %s chomps down on you with its terrible beak, dealing %s damage before you can wriggle away.%s", this.getDisplayName(character), attackText, critText));

      character.decreaseHp(attackInfo.damage);
    }

    return messages;
  }

  /**
   * Character has beat the mini-boss.
   *
   * @param {Character} character - The character who won the fight.
   * @param {array} messages - Any messages that have happened so far in combat.
   *
   * @return {array}
   */
  doFightSuccess(character, messages) {
    // Define in here to prevent circular references
    const Locations = require('@app/content/locations').Locations;

    const steps = character.getFlag('steps_faith');
    character.clearFlag('steps_faith');
    character.track('Tentacled Demigod Defeated', { steps });

    character.setFlag(FLAGS.FAITH_BOSS_DEFEATED);
    character.location = Locations.new("watermoon-mystic-lodge");
    messages.push(__("With the Tentacled Demigod defeated, the Faith Plane fades around you and the Faith Portal spirals closed."));

    return messages;
  }
}

module.exports = FaithBossEnemy;