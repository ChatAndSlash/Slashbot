"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

const SpitBooze = DazeAction(15, {
  dodgeText: ":dash: %s spits noxious booze at your face, but you dodge!",
  missText: "%s spits noxious booze at your face, but misses!",
  attackText: ":dizzy_face: %s spits noxious booze at your face, dealing %s damage %s dazing you for %d turns.%s"
});

const SmashBottle = StunAction(10, {
  dodgeText: ":dash: %s attacks, but you dodge!",
  missText: "%s attacks, but misses!",
  attackText: "%s attacks you, dealing %s damage and stunning you for %d turns!%s"
});

const SpitFlame = BurnAction(10, {
  multiplier: 1.5,
  isRanged: true,
  dodgeText: ":dash: %s takes a swig of booze, lights a match, and spits flame at you but you dodge!",
  missText: "%s takes a swig of booze, lights a match, and spits flame at you but misses!",
  attackText: ":fire: %s takes a swig of booze, lights a match, and spits flame at you, dealing %s damage and burning you.%s"
});

class DrunkenMasterEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  SpitBooze,
  SmashBottle,
  SpitFlame,
  DropsMoondrop(100, 1),
  WatermoonReputation(50)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-drunken_master',
      displayName: "Drunken Master",
      description: "Swaying and stumbling, this red-faced woman has clearly had too much to drink. And yet, she seems to have embraced this state of being, and uses her unpredictability and aggression to her advantage.",
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

    character.track('Drunken Master Defeated');
    messages.push(__("As you land the final hit, she rolls back out of the way, and smacks her head squarely on a brick wall, knocking herself unconscious."));

    return super.doFightSuccess(character, messages);
  }
}

module.exports = DrunkenMasterEnemy;