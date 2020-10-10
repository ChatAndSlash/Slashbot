"use strict";

const PetsOwned   = require('@app/petsOwned');
const Log         = require('@util/log');
const Actions     = require('slacksimple').Actions;
const Command     = require('@app/content/commands').Command;
const Items       = require('@app/content/items').Items;
const Pet         = require('@app/content/items/equipment/pets');
const Attachments = require('slacksimple').Attachments;
const Options     = require('slacksimple').Options;

const COLORS = require('@constants').COLORS;

const ACTION_BUY    = 'buy';
const ACTION_CHANGE = 'change';

const STEP_LIST    = 'list';
const STEP_CONFIRM = 'confirm';

/**
 * Buy and manage pets.
 */
class PetsCommand extends Command {
  /**
   * Execute the command.
   */
  async execute() {
    if (this.info.action === ACTION_BUY) {
      if (this.info.step === STEP_LIST) {
        await this.showPetsForSale();
      }
      else if (this.info.step === STEP_CONFIRM) {
        await this.buyPet();
      }
      else {
        Log.error(this.info, "Invalid step.");
      }
    }
    else if (this.info.action === ACTION_CHANGE) {
      if (this.info.step === STEP_LIST) {
        await this.showPets();
      }
      else if (this.info.step === STEP_CONFIRM) {
        await this.changePet();
      }
      else {
        Log.error(this.info, "Invalid step.");
      }
    }
    else {
      Log.error(this.info, "Invalid action.");
    }
  }

  /**
   * Show all pets available for sale in this location that this character hasn't purchased.
   */
  async showPetsForSale() {
    const character = this.character;
    const location  = character.location;

    const petsOwned = await PetsOwned.load(character);

    let description = location.getDescription(character)
            + character.location.getShopDescription(character, 'pets')
            + __('\nYou review the pets on offer:');
    let actions = new Actions();
    let options = new Options();

    const petsForSale = location.getUnownedShopPets(character, petsOwned);

    if (petsForSale.length === 0) {
      return await this.updateLast({
        attachments: Attachments.one({
          title: __(':warning: There are no pets for sale at this time.'),
          color: COLORS.WARNING,
        }),
        doLook: true,
      });
    }

    for (const petType of petsForSale) {
      const pet = Items.new(petType, { character });
      const canBuyText = pet.canBePurchasedBy(character) ? '✓' : '✗';

      options.add(
        `${pet.getDisplayName(character)} ${canBuyText}`,
        { action: ACTION_BUY, step: STEP_CONFIRM, pet: pet.type }
      );
      description += `\n>- ${pet.getDisplayName(character)} (${pet.getCostDescription(character)}): ${pet.getShopDescription(character)}`;
    }

    actions.addSelect(__("Pets"), "pets", options.getCollection());

    actions.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({
      description,
      attachments: Attachments.one({
        title: __('Which do you want to bring home?'),
        actions,
      })
    });
  }

  /**
   * Buy a specific pet.
   */
  async buyPet() {
    const character = this.character;
    const newPet    = Items.new(this.info.pet);

    const petsOwned = await PetsOwned.load(character);

    let title = '';

    // If character can't afford the pet
    if ( ! newPet.canBePurchasedBy(character)) {
      title = __(":warning: You can't afford that.");

      // If character can afford the pet
    }
    else {
      const oldPet = character.pet;

      newPet.subtractCostFrom(character);

      // First pet?
      if (oldPet.type === Pet.NO_PET) {
        title = __("You invite %s to your party.", newPet.getDisplayName(character));
        // All subsequent pets
      }
      else {
        title = __(
          "You put %s back into the stable for now, and welcome %s to your party.",
          oldPet.getDisplayName(character),
          newPet.getDisplayName(character)
        );
      }

      // If getting free pet from Karl
      if (character.inventory.has('quest-pet_collar') && character.location.type === 'tyrose-shoppes-pets') {
        title += __(" Karl happily takes back Honey's collar.");
        character.inventory.remove('quest-pet_collar');
      }

      // Equip new pet
      newPet.equipTo(character);

      // Add new pet to list of owned pets
      petsOwned.owned.push({
        id: false,
        type: this.info.pet
      });
    }

    await petsOwned.save(character);
    await this.updateLast({
      attachments: Attachments.one({ title }),
      doLook: true
    });
  }

  /**
   * Show all owned pets that can be switched to.
   */
  async showPets() {
    const character = this.character;

    let attachments = new Attachments().add({ title: __('Which one do you want to switch to?') });

    const petsOwned = await PetsOwned.load(character);

    let options = new Options();
    let description = character.location.getDescription(character)
            + __('\nThese are the pets you can switch to:');

    for (let petType of _.map(petsOwned.owned, 'type')) {
      const pet = Items.new(petType);
      options.add(
        `${pet.getDisplayName(character)}`,
        { action: ACTION_CHANGE, step: STEP_CONFIRM, pet: pet.type }
      );
      description += `\n>- *${pet.getDisplayName(character)}:* ${pet.getShopDescription(character)}`;
    }

    attachments.addSelect(__("Pets"), "pets", options.getCollection());
    attachments.addButton(__("Cancel"), "look", { params: { resetDescription: "true" } });

    await this.updateLast({ description, attachments });
  }

  /**
   * Change to a different pet.
   */
  async changePet() {
    let character = this.character;

    const oldPet = character.pet;
    const newPet = Items.new(this.info.pet);

    newPet.equipTo(character);

    await this.updateLast({
      attachments: Attachments.one({
        title: __(
          "You put %s back into the stable for now, and welcome %s to your party.",
          oldPet.getDisplayName(character),
          newPet.getDisplayName(character)
        ),
      }),
      doLook: true,
    });
  }
}

module.exports = PetsCommand;