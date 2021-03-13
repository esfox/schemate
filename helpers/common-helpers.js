import { settings } from '../settings';

export function validateModule(moduleName) {
  if(!settings.INSTALLED_MODULES.includes(moduleName))
    throw new Error(`${moduleName} is not available in current modules in src.`);
};

export function getMigrationsDirectory(moduleName) {
  return `./src/${moduleName}/migrations/`;
}

/**
 * @param {string | string[]} moduleName Name/s of the module/s to migrate.
 */
export function getConfig(moduleName) {
  /** @type {import('knex').MigratorConfig} */
  const config =
  {
    // TODO: Make dynamic later
    directory: Array.isArray(moduleName)
      ? moduleName.map(getMigrationsDirectory)
      : getMigrationsDirectory(moduleName),

    disableMigrationsListValidation: true,
  };

  return config;
}
