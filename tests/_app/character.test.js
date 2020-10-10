/*eslint-env mocha */
"use strict";

const Character = require('@app/character').Character;
const FLAGS     = require('@constants').FLAGS;

// -- Tests ----------------------------------------------------------------------------------------

describe('Character', () => {

  describe('getLoadQuery()', () => {
    it('should put together correct query for params', () => {
      let character = new Character();
      expect(character.getLoadQuery({ id: 5 })).toEqual([
        'SELECT * FROM characters WHERE id = ?',
        [5]
      ]);

      expect(character.getLoadQuery({ id: 2, email: 'bob@bob.com' })).toEqual([
        'SELECT * FROM characters WHERE id = ? AND email = ?',
        [2, 'bob@bob.com']
      ]);
    });
  });

  describe('load()', () => {
    // ensure connection.release() is called even when a problem occurs
    // this probably means we need to try/catch everything and provide a finally
    // where we connection.release()

    // need to do this for save() as well
  });

  describe('create()', () => {
    // For some reason, this function doesn't end when done?
    // I thought it was not relasing DB connection and may still not be?
    // Odds are good that we're not ending the pool with DB_POOL.end() at the end of all
    // tests.  Since jest doesn't have any way to teardown after all tests are finished,
    // this probably means we'll have to re-architect the global database pool thing
    // to be within a class or something where we can end/recreate where needed.
  });

  describe('addXp()', () => {

    it('should add the xp to the character', () => {
      let character = new Character();

      character.setValues({ level: 1, xp: 0 });
      character.addXp(100);

      expect(character.xp).toBe(100);
    });

    it('should have the required amount of XP after level up', () => {
      let character = new Character();

      character.setValues({ level: 7, xp: 3490 });
      character.addXp(100);

      expect(character.xp).toBe(90);
    });

    it('should call levelUp() the right number of times', () => {
      let character = new Character();
      const spy = jest.spyOn(character, 'levelUp');

      character.setValues({ level: 1, xp: 0 });
      character.addXp(1600);

      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe('levelUp()', () => {

    it('should add the correct HP when leveling up', () => {
      let character = new Character();

      character.setValues({ max_hp: 100, level: 7, xp: 3490 });
      character.addXp(100);

      expect(character.maxHp).toBe(105);
    });

    it('should add the correct HP when leveling up under curse', () => {
      let character = new Character();

      character.setValues({ max_hp: 100, level: 7, xp: 3490 });
      character.setFlag(FLAGS.CHEST_CURSE_FRAILTY);
      character.addXp(100);

      expect(character._maxHp).toBe(105);
    });

    it('should provide correct level up text', () => {
      let character = new Character();

      character.setValues({ max_hp: 100, level: 7, xp: 3490 });
      const response = character.addXp(100);

      expect(response).toEqual(["```You have reached level 8!\n\nYour AP refills and you gain: 5 Max. HP, 1 Force, 1 Technique, 1 Defence.```"]);
    });
  });

  describe('learnSpell()', () => {
    it('should add spells to the start of spell list', () => {
      let character = new Character();
      character.setValues({ known_spells: ["first", "second", "third"] });

      character.learnSpell("new");
      expect(character.knownSpells).toEqual([
        'new',
        'first',
        'second',
        'third'
      ]);
    });
  });

  describe('hasStat()', () => {
    it('should have a stat when a subtype isn\'t set to check for', () => {
      let character = new Character();
      character.setValues({
        stats: {
          encounter_goblin_child: { walk_away: 1 },
        },
      });

      expect(character.hasStat('encounter_goblin_child', { subType: 'walk_away' })).toBe(true);
      expect(character.hasStat('encounter_goblin_child')).toBe(true);
    });
  });
});