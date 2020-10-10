"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DazeAction          = require('@mixins/enemy/actions/daze').DazeAction;
const DefendAction        = require('@mixins/enemy/actions/defend').DefendAction;
const PowerAttackAction   = require('@mixins/enemy/actions/power_attack').PowerAttackAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

const ShadowKick = DazeAction(10, {
  duration: 2,
  cooldown: 3,
  dodgeText: ":dash: %s briefly turns shadowy and shoots forward to kick you, but you dodge!",
  missText: "%s briefly turns shadowy and shoots forward to kick you, but misses!",
  attackText: ":dizzy_face: %s briefly turns shadowy and shoots forward to kick you squarely in the head, dealing %s damage %s dazing you for %d turns.%s"
});

const ShadowFist = PowerAttackAction(20, {
  text: "%s briefly turns shadowy and punches you for %s damage!%s"
});

class ShadowLesserEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  ShadowKick,
  DefendAction(10),
  ShadowFist,
  DropsMoondrop(100, 1),
  WatermoonReputation(50)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-shadow_lesser',
      displayName: "Shadow \"The Great\"",
      description: "Before you stands Shadow \"The Great\", a scrawny man in a loosely-belted black robe.  He's standing in what it's obvious he hopes is a confident, intimidating stance, but since he can't quite pull it off, it just kind of looks silly.",
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

    character.track('Shadow Lesser Defeated');
    messages.push(__("Before you can deliver the final blow, Shadow \"The Great\" stumbles back and starts running away.\n\"I'll be back!\" he yells as he runs.  \"I'll train and I'll practice and you'll regret this!\""));

    return super.doFightSuccess(character, messages);
  }
}

module.exports = ShadowLesserEnemy;