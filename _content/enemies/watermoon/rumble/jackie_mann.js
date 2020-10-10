"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const ConcussAction       = require('@mixins/enemy/actions/concuss').ConcussAction;
const BlindAction         = require('@mixins/enemy/actions/blind').BlindAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

const TrashCan = ConcussAction(15, {
  text: "%s scoops up a trash can and beans you in the head, dealing %s damage and concussing you!%s"
});

const Sand = BlindAction(15, {
  blindText: ":astonished: %s attacks you and tosses sand from the ground in your eyes, dealing %s damage %s blinding you for %d turns.%s"
});

const Chair = StunAction(10, {
  dodgeText: ":dash: %s attacks you with a wooden folding chair, but you dodge!",
  missText: "%s attacks you with a wooden folding chair, but misses!",
  attackText: "%s attacks you with a wooden folding chair you, dealing %s damage and stunning you for %d turns!%s"
});

class JackieMannEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  TrashCan,
  Sand,
  Chair,
  DropsMoondrop(100, 2),
  WatermoonReputation(50)
) {
  constructor() {
    super({
      type: 'watermoon-rumble-jackie_mann',
      displayName: "Jackie Mann",
      description: "A shorter, somewhat unassuming looking fellow.  When you first see him, he's lounging casually against a wall, but when he sees you, he picks up a nearby ladder - of all things - and starts attacking you with it!",
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

    character.track('Jackie Mann Defeated');
    messages.push(__("You finally corner Jackie Mann, with no improvised weapons or tricks to defend himself with.  He smiles sheepishly while walking backwards with his hands high, then turns and leaps onto the wall, finding impossible handholds that he uses to scale it and flee."));

    return super.doFightSuccess(character, messages);
  }
}

module.exports = JackieMannEnemy;