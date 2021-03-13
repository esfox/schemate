import knex from '../database/connection';
import path from 'path';
import fs from 'fs';
import { settings } from '../settings';
import { getConfig, getMigrationsDirectory, validateModule } from '../helpers/common-helpers';

// TODO: Change operation returns to proper returns.
// TODO: Implement config.
export class Migrations {

  /**
   * Creates a migration file.
   *
   * @param {string} moduleName
   * @param {string} migrationName
   */
  static create(moduleName, migrationName) {
    validateModule(moduleName);
    return knex.migrate.make(migrationName, getConfig(moduleName));
  }

  /**
   * Lists the migrations files of a given module.
   *
   * @param {string} moduleName
   */
  static list(moduleName) {
    if(!moduleName)
      throw new Error('Module name is not given.');

    const directory = getMigrationsDirectory(moduleName);
    if(!fs.existsSync(directory))
      throw new Error(`Directory of '${moduleName}' is not existing`);

    return fs.readdirSync(directory);
  }

  /**
   * Migrates a given module, if provided.
   * If not, migrates all modules.
   *
   * @param {string} [moduleName]
   */
  static migrate(moduleName) {
    let moduleToMigrate = settings.INSTALLED_MODULES;

    if(moduleName) {
      validateModule(moduleName);
      moduleToMigrate = moduleName;
    }

    return knex.migrate.latest(getConfig(moduleToMigrate));
  }

  /**
   * Rollbacks a given module, if provided.
   * If not, migrates all modules.
   *
   * @param {string} [moduleName]
   */
  static async rollback(moduleName) {

    if(moduleName) {
      validateModule(moduleName);
      return knex.migrate.rollback(getConfig(moduleName));
    }

    const config = getConfig(settings.INSTALLED_MODULES);
    let rollbackResult = await knex.migrate.rollback(config);
    let [rollbackedBatch] = rollbackResult;
    if(rollbackedBatch <= 0)
      return rollbackResult;

    let rollbackResults = [];
    while(rollbackedBatch > 0) {
      rollbackResult = await knex.migrate.rollback(config);
      [rollbackedBatch] = rollbackResult;
      rollbackResults.push(rollbackResult);
    }

    return rollbackResults;
  }

  /**
   * Migrates up a given module or specific migration file.
   *
   * @param {string} moduleName
   * @param {string} migrationName
   */
  static up(moduleName, migrationName) {
    return Migrations._migrateOne(moduleName, migrationName);
  }

  /**
   * Migrates down a given module or specific migration file.
   *
   * @param {string} moduleName
   * @param {string} migrationName
   */
  static down(moduleName, migrationName) {
    return Migrations._migrateOne(moduleName, migrationName, false);
  }

  /**
   * Migrates up or down a given module or specific migration file.
   *
   * @private
   * @param {string} moduleName
   * @param {string} migrationName
   * @param {boolean} [doUp]
   */
  static _migrateOne(moduleName, migrationName, doUp = true) {
    const config = getConfig(moduleName);

    if(migrationName) {
      migrationName = migrationName.includes('.js') ? migrationName : `${migrationName}.js`;
      if(!fs.existsSync(path.join(config.directory, migrationName)))
        throw new Error(`${migrationName} is not existing.`);

      config.name = migrationName;
    }

    return doUp
      ? knex.migrate.up(config)
      : knex.migrate.down(config);
  }
}
