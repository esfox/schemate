import knex from '../database/connection';
import path from 'path';
import fs from 'fs';
import { settings } from '../settings';
import { getConfig, getMigrationsDirectory, validateModule } from './helpers';

// TODO: Change operation returns to proper returns.
// TODO: Implement config.
export const Migrations = new class {

  /**
   * Creates a migration file.
   *
   * @param {string} moduleName
   * @param {string} migrationName
   */
  create(moduleName, migrationName) {
    validateModule(moduleName);
    return knex.migrate.make(migrationName, getConfig(moduleName));
  }

  /**
   * Lists the migrations files of a given module.
   *
   * @param {string} moduleName
   */
  list(moduleName) {
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
  migrate(moduleName) {
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
  async rollback(moduleName) {

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
  async up(moduleName, migrationName) {

    let migrationFiles = this.list(moduleName);
    migrationFiles = migrationFiles.sort((a, b) => a.localeCompare(b));

    const migrationResults = [];
    for(const migrationFile of migrationFiles) {

      migrationResults.push(await this._migrateOne(moduleName, migrationFile));
      if(migrationFile === migrationName)
        break;
    }

    return migrationResults;
  }

  /**
   * Migrates down a given module or specific migration file.
   *
   * @param {string} moduleName
   * @param {string} migrationName
   */
  async down(moduleName, migrationName) {

    validateModule(moduleName);
    let [migrationFiles] = await knex.migrate.list(getConfig(moduleName));
    migrationFiles = migrationFiles.sort((a, b) => b.localeCompare(a));

    const migrationResults = [];
    for(const migrationFile of migrationFiles) {

      migrationResults.push(await this._migrateOne(moduleName, migrationFile, false));
      if(migrationFile === migrationName)
        break;
    }

    return migrationResults;
  }

  /**
   * Migrates up or down a given module or specific migration file.
   *
   * @private
   * @param {string} moduleName
   * @param {string} migrationName
   * @param {boolean} [doUp]
   */
  _migrateOne(moduleName, migrationName, doUp = true) {
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
};
