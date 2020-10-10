"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const CurseAction         = require('@mixins/enemy/actions/curse').CurseAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

const ShadowKick = DazeAction(10, {
  duration: 3,
  cooldown: 4,
  dodgeText: ":dash: %s becomes a living shadow and shoots forward to kick you, but you dodge!",
  missText: "%s becomes a living shadow and shoots forward to kick you, but misses!",
  attackText: ":dizzy_face: %s becomes a living shadow and shoots forward to kick you squarely in the head, dealing %s damage %s dazing you for %d turns.%s"
});

const ShadowCurse = CurseAction(10, {
  text: "%s gazes deeply in your eyes and the world turns to shadow around you.  You are _cursed!_"
});

const ShadowFist = PowerAttackAction(20, {
  multiplier: 2.5,
  text: "%s becomes a living shadow and punches you for %s damage!%s"
});

class ShadowGreaterEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ShadowKick,
  ShadowCurse,
  ShadowFist,
  DropsMoondrop(100, 3),
  WatermoonReputation(50)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-shadow_greater',
      displayName: "Shadow The Great",
      description: "Before you stands Shadow The Great, a tremendously buff man in a barely-fitting, tightly-belted black robe.  He's standing in what is obviously a confident, intimidating stance, and since he can pull it off effortlessly, it just kind of works.",
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

    character.track('Shadow Greater Defeated');
    messages.push(__("Before you can deliver the final blow, Shadow The Great stumbles back and starts running away.\n\"Okay, this sucks!\" he yells as he runs.  \"What's the point of all this training if you beat me anyway?  I'm gonna go back to eating junk food and being lazy.  I regret this!\""));

    return super.doFightSuccess(character, messages);
  }
}

module.exports = ShadowGreaterEnemy;