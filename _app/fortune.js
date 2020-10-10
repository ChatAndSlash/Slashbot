"use strict";

const FLAGS = require('@constants').FLAGS;
const STATS = require('@constants').STATS;

const ITEM_LYSTONE = 'quest-watermoon-lystone';

/**
 * Get a fortune for the provided character, giving a hint of where to go.
 *
 * @param {Character} character - The character to get a fortune for.
 *
 * @return {string}
 */
module.exports = function (character) {
  let fortune = '';

  // Post Watermoon

  if (character.hasKilledRedDragon() && character.hasKilledBlackDragon() && character.hasKilledNecrodragon()) {
    // Has Lystone?
    if (character.inventory.has(ITEM_LYSTONE)) {
      fortune += "Watermoon has been cleared of hostile dragons, but your journey is not yet complete.  More dragons are out there, and patience will reveal them to you.";
    }
    // Has spoken with all guild leaders?
    else if (ifAllLeadersSpokenWith(character)) {
      fortune += "Sometimes you must seek the council of your elders.  Including your elder dragons.  Your elder, golden dragons.";
    }
    // Haven't spoke with guild leaders yet
    else {
      fortune += "To learn the truth, speak with those you trust.  The Guild Leaders of Watermoon can tell you what you need to know.";
    }
  }

  // Watermoon

  else if (character.hasKilledBrownDragon()) {
    fortune += "The following tasks in Watermoon still require your attention:";

    // Rumble District

    if ( ! character.hasKilledRedDragon()) {
      if ( ! character.hasKilledEnemy('watermoon-rumble-shadow_lesser')) {
        fortune += "\n- The gangs of the Rumble District await your attention.";
      }
      else if ( ! character.hasKilledEnemy('watermoon-rumble-drunken_master')) {
        fortune += "\n- The Alleyway in the Rumble District awaits your attention.";
      }
      else if ( ! character.hasKilledEnemy('watermoon-rumble-jackie_mann')) {
        fortune += "\n- The Back Lot in the Rumble District awaits your attention.";
      }
      else if ( ! character.hasKilledEnemy('watermoon-rumble-shadow_greater')) {
        fortune += "\n- The Yard in the Rumble District awaits your attention.";
      }
      else {
        fortune += "\n- The Red Dragon awaits in the Rumble District!";
      }
    }

    // Scholar District

    if ( ! character.hasKilledBlackDragon()) {
      if ( ! character.hasKilledEnemy('watermoon-scholar-empusa')) {
        fortune += "\n- A lady of flame and wing awaits in the Scholar District.";
      }
      else if ( ! character.hasKilledEnemy('watermoon-scholar-minotaur')) {
        fortune += "\n- A horned monster of myth and legend awaits in the Scholar District.";
      }
      else if ( ! character.hasKilledEnemy('watermoon-scholar-gorgon')) {
        fortune += "\n- A lady of snake and stone awaits in the Scholar District.";
      }
      else {
        fortune += "\n- The Black Dragon awaits in the Scholar District!";
      }
    }

    // Mystic District

    if ( ! character.hasKilledNecrodragon()) {
      if ( ! character.hasKilledEnemy('watermoon-mystic-faith-boss')) {
        fortune += "\n- You must yet test your faith in the Mystic District.";
      }
      else if ( ! character.hasKilledEnemy('watermoon-mystic-shadow-boss')) {
        fortune += "\n- You must still delve into shadows in the Mystic District.";
      }
      else if ( ! character.hasKilledEnemy('watermoon-mystic-death-boss')) {
        fortune += "\n- You must face certain death in the Mystic District.";
      }
      else {
        fortune += "\n- The Necrodragon awaits in the Mystic District!";
      }
    }
  }

  // Scatterslide

  else if (character.hasKilledGreenDragon()) {

    if (character.hasFlag(FLAGS.UNDERDRIFT_DOOR_UNLOCKED)) {
      fortune += "The Brown Dragon is elusive, but with effort, you can track him down.";
    }
    else if (character.hasFlag(FLAGS.MINE_ELEVATOR_FIXED)) {
      fortune += "The key to your progress can only be found when sufficient light is shone on the matter.";
    }
    else if (character.hasFlag(FLAGS.QUARRY_BLOWN_UP)) {
      fortune += "You must pass deep into the earth.  The wheels of your chariot are broken, however.  Seek new ones.";
    }
    else if (character.hasStat(STATS.SCATTERSLIDE_INTRO)) {
      fortune += "The earth herself blocks your way.  But with enough raw, explosive power, anything can be moved.";
    }
    else {
      fortune += "Your fortune lies at the Scatterslide mine, go and seek those who would need your help.";
    }

    // Rebuilding

    if (character.hasFlag(FLAGS.QUARRY_BLOWN_UP) && ! character.hasStat(STATS.SCATTERSLIDE_ARTIFICER_BUILT)) {
      fortune += "\n\nKeep an eye out for cast-off metal during your travels.  There are those that can put such things to great use.";
    }
    if (character.hasStat(STATS.SCATTERSLIDE_INTRO) && ! character.hasStat(STATS.SCATTERSLIDE_BLACKSMITH_BUILT)) {
      fortune += "\n\nThe Scatterslide Blacksmith could do good work, if only there were enough stones brought back to rebuild the smithy.";
    }
  }

  // Tyrose

  else {
    if (character.hasFlag(FLAGS.GREEN_LAIR_DISCOVERED)) {
      fortune += "The Green Dragon's secret lair is exposed.  Gather your courage and slay the beast!";
    }
    else if (character.hasFlag(FLAGS.FOREST_CAVE_DISCOVERED)) {
      fortune += "The cave has a secret deep within that can only be discovered by those bright enough to find it.";
    }
    else {
      fortune += "Deep in the forest is a cave.  Think deeply and you will find it.";
    }
  }

  // Has Lystone?  Report on progress
  if (character.inventory.has(ITEM_LYSTONE)) {
    // Don't use getChipCount, because character might not be in a Watermoon Location
    const chipCount = character.getFlag(FLAGS.LYSTONE_CHIP_COUNT, 0);

    // If you have the 10th sekrit chip, don't need to say anything.

    // Have all 9 boss chips?
    if (9 === chipCount) {
      fortune += "\n\nYour Lystone is complete, yet inactive.  Perhaps there is someone who can help activate it.";
    }
    // Missing any boss chips?
    else if (chipCount < 9) {
      const missingRumble = ! (character.hasKilledEnemy('watermoon-rumble-the_one')
        && character.hasKilledEnemy('watermoon-rumble-crane_and_dragon')
        && character.hasKilledEnemy('watermoon-rumble-the_ox'));
      const missingScholar = ! (character.hasKilledEnemy('watermoon-scholar-gorvil')
        && character.hasKilledEnemy('watermoon-scholar-maze_master')
        && character.hasKilledEnemy('watermoon-scholar-minotaur_king'));

      // TODO: Report how many chips are needed, what districts they're in.
      fortune += "\n\nYour Lystone remains incomplete.  Seek what remains in the Watermoon Districts.";

      if (missingRumble) {
        fortune += "\n\nConsider checking the Rumble District.";
      }
      else if (missingScholar) {
        fortune += "\n\nConsider checking the Scholar District.";
      }
      else {
        fortune += "\n\nConsider checking the Mystic District.";
      }
    }
  }

  return fortune;
};

/**
 * If the character has spoken with all the leaders.
 *
 * @param {Character} character - The character to check.
 *
 * @return {boolean}
 */
function ifAllLeadersSpokenWith(character) {
  return character.hasFlag(FLAGS.ASKED_BELTARA_AURETH)
    && character.hasFlag(FLAGS.ASKED_NICHOLAS_AURETH)
    && character.hasFlag(FLAGS.ASKED_BARAD_AURETH);
}
