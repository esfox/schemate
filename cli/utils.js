import { settings } from '../settings';

export class Utils {

  /**
   * Gets the path of the migrations directory of the given module.
   *
   * @param {string} modulesName Name of the module to get the migrations directory of.
   */
  static getMigrationsDirectory = moduleName => `./src/${moduleName}/migrations/`;

  /**
   * Creates a migration config.
   *
   * @param {string | string[]} moduleName Name/s of the module/s to migrate.
   * @returns {import('knex').MigratorConfig}
   */
  static get(moduleName) {

    if(!moduleName)
      moduleName = settings.INSTALLED_MODULES;

    // TODO: Make dynamic later
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
    if(!settings.INSTALLED_MODULES.includes(moduleName))
      throw new Error(`${moduleName} is not available in current modules in src.`);
  }
}
