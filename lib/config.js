import path from 'path';
import fs from 'fs';

/* Get the list of all modules from the config. */
/**
 * @typedef Module
 * @property {string} migrationsDir
 */

export class Config {

  static readConfig() {
    /* Read the config file. */
    let config;
    try {
      config = require(path.resolve('./schemate.json'));
    }
    catch(_) {
      throw new Error('`schemate.json` not found');
    }

    /* Validate config */
    if(!config.knexPath)
      throw new Error('No `knexPath` provided in the config file');

    if(!config.modules || typeof config.modules !== 'object')
      throw new Error('Invalid `modules` in the config file');

    // TODO: Validate module migrations directories.

    /* Get the knex instance from the given path in the config. */
    /** @type {import('knex')} */
    let knex = require(path.resolve(`./${config.knexPath}`));
    if(knex.default)
      knex = knex.default;

    Config._knex = knex;

    /* Get the list of all modules from the config. */
    /** @type {Object<string, Module>} */
    Config._modules = config.modules;

    Config._config = config;
  }

  /**
   * @returns {Object<string, Module>}
   */
  static get modules() {
    if(!Config._modules)
      Config.readConfig();

    return Config._modules;
  }

  /**
   * @returns {import('knex')}
   */
  static get knex() {
    if(!Config._knex)
      Config.readConfig();

    return Config._knex;
  }

  static init({ knexPath = '', modules = {} }) {

    if(fs.existsSync('./schemate.json'))
      return console.log('Config file already exists.');;

    if(!knexPath)
      throw new Error('No knex instance path provided.');

    const configContent = {
      knexPath,
      modules,
    };

    fs.writeFileSync('./schemate.json', JSON.stringify(configContent, null, 2));
    return true;
  }

  static addModule(moduleName, migrationsDir) {
    if(!moduleName)
      throw new Error('No module name provided.');

    if(!migrationsDir)
      throw new Error('No migrations directory provided.');

    if(!fs.existsSync(migrationsDir))
      throw new Error('Given migrations directory does not exist.');

    if(!Config._config)
      Config.readConfig();

    if(Object.entries(Config.modules).some(([_moduleName, _module]) =>
      _moduleName === moduleName ||
      _module.migrationsDir === migrationsDir
    ))
      throw new Error('Given module name or migrations directory is already defined.');

    Config._config.modules[moduleName] = { migrationsDir };
    fs.writeFileSync('./schemate.json', JSON.stringify(Config._config, null, 2));
  }
}
