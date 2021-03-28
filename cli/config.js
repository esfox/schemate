import path from 'path';

/* Read the config file. */
let config;
try {
  config = require(path.resolve('./schemate.json'));
}
catch(_) {
  throw new Error('`schemate.json` has not been found');
}

/* Validate config */
if(!config.knexPath)
  throw new Error('No `knexPath` provided in the config file');

if(!config.modules || typeof config.modules !== 'object')
  throw new Error('Invalid `modules` in the config file');

/* Get the knex instance from the given path in the config. */
let knex = require(path.resolve(`./${config.knexPath}`));
if(knex.default)
  knex = knex.default;

/* Get the list of all modules from the config. */
/**
 * @typedef Module
 * @property {string} path
 */
/** @type {Object<string, Module>} */
const modules = config.modules;

export { knex, modules };
