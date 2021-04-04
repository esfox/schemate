import path from 'path';

import { modules } from './config';

export class Utils {

  /**
   * Gets the path of the migrations directory of the given module.
   *
   * @param {string} modulesName Name of the module to get the migrations directory of.
   */
  static getMigrationsDirectory(moduleName) {
    Utils.validateModule(moduleName);
    return path.resolve(modules[moduleName].migrationsDir);
  };

  /**
   * Creates a migration config.
   *
   * @param {string | string[]} moduleName Name/s of the module/s to migrate.
   * @returns {import('knex').MigratorConfig}
   */
  static config(moduleName) {

    if(!moduleName)
      moduleName = Object.keys(modules);
    else
      Utils.validateModule(moduleName);

    return ({
      directory: Array.isArray(moduleName)
        ? moduleName.map(Utils.getMigrationsDirectory)
        : Utils.getMigrationsDirectory(moduleName),

      disableMigrationsListValidation: true,
    });
  }

  /**
   * Validates if a module directory is existing.
   *
   * @param {string} moduleName Name of the module to validate.
   */
  static validateModule(moduleName) {
    if(!modules[moduleName])
      throw new Error(`The module '${moduleName}' is not available in the modules specified in the config file.`);
  }
}
