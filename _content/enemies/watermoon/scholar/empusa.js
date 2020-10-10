"use strict";

const mix                 = require('mixwith').mix;
const WatermoonEnemy      = require('@app/content/enemies/watermoon').WatermoonEnemy;
const WatermoonReputation = require('@mixins/enemy/reputation/watermoon').WatermoonReputation;
const FuriousAction       = require('@mixins/enemy/actions/furious').FuriousAction;
const DrainLifeAction     = require('@mixins/enemy/actions/drain_life').DrainLifeAction;
const BurnAction          = require('@mixins/enemy/actions/burn').BurnAction;
const StunAction          = require('@mixins/enemy/actions/stun').StunAction;
const DropsMoondrop       = require('@mixins/enemy/loot/moondrop').DropsMoondrop;

const FLAGS = require('@constants').FLAGS;

const KissAction = DrainLifeAction(20, {
  dodgeText: ":dash: %s attempts to kiss you, but you dodge!",
  missText: "%s attempts to kiss you, but misses!",
  attackText: ":lips: %s rushes in and kisses you deeply, briefly paralysing you before she bites you with razor-sharp teeth, dealing %s damage and gaining %s health from you.%s"
});

const FlamingHairAction = BurnAction(20, {
  dodgeText: ":dash: %s reaches into her flaming hair and hurls a bundle of it at you, but you dodge!",
  missText: "%s reaches into her flaming hair and hurls a bundle of it at you, but misses!",
  attackText: ":fire: %s reaches into her flaming hair and hurls a bundle of it at you, dealing %s damage and burning you.%s"
});

const TerrorScreamAction = StunAction(
  10,
  2,
  ":dash: %s screams at you, but you manage to block it out!",
  "%s screams as you, but it just isn't scary...",
  ":tired_face: %s screams at you, terrifying you to your core, dealing %s damage and stunning you for %d turns!%s"
);

class EmpusaEnemy extends mix(WatermoonEnemy).with(
  FuriousAction(20),
  KissAction,
  FlamingHairAction,
  TerrorScreamAction,
  DropsMoondrop(3),
  WatermoonReputation(50)
) {
  constructor() {
    super({
      type: 'watermoon-scholar-empusa',
      displayName: "Empusa",
      description: __("Over seven feet tall, this terrifying woman would be gorgeous if it weren't for her purple skin, bat wings, and bright, flaming hair.  She stands in the center of the crossroads, aggressively blocking your way further into the labyrinth."),
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

    character.track('Empusa Defeated');

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

module.exports = EmpusaEnemy;