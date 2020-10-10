"use strict";

const Log = require('@util/log');
const fs  = require('fs');

/**
 * Load content recursively from a directory, returning a keyed object with all content.
 *
 * @param {string} dir - The directory to read.
 * @param {string} prefix - The prefix directory to chop off when assigning values.
 * @param {object} content - The content already read, new content is appended here.
 */
function loadContent(dir, prefix, content) {
  fs.readdirSync(dir).forEach((file) => {
    // Skip .DS_Store files
    if ('.DS_Store' === file) {
      return;
    }

    // Recurse into the directory
    if (fs.statSync(dir + file).isDirectory()) {
      this.loadContent(dir + file + '/', prefix, content);
      // Save the file keyed by the filename (without ".js")
    }
    else {
      content[dir.replace(prefix, '').replace(/\//g, '-') + file.substr(0, file.length - 3)] = require(dir + file);
    }
  });
}

/**
 * Get the names of all the content, keyed by its type, for quick reference.
 *
 * @param {object} content - The content to extract names from.
 * @param {object} names - Names are placed in here.
 */
function getNames(content, names) {
  for (const type in content) {
    try {
      const obj = new content[type]();
      names[type] = obj._displayName;
    }
    catch (err) {
      Log.error(`Error trying to get names for content of type: '${type}'.`);
      throw err;
    }
  }
}

/**
 * Get the types of all the content, keyed by its name, for quick reference.  Include aliases!
 *
 * @param {object} content - The content to extract types from.
 * @param {object} types - Types are loaded into here.
 *
 * @return {object}
 */
function getTypes(content, types) {
  for (let type in content) {
    let obj = new content[type]();
    for (let name of obj.allNames) {
      types.set(name.toLowerCase(), type);
    }
  }
}

module.exports = {
  loadContent,
  getNames,
  getTypes
};