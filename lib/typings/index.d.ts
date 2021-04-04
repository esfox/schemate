declare module 'schemate' {

  import knex from 'knex';

  interface Module {
    migrationsDir: string;
  }

  class Config {
    modules: { key: string, module: Module };
    knex: knex;
    init(args: { knexPath: string, migrationsDir?: string }): void;
    addModule(moduleName: string, migrationsDir: string): void;
  }

  class Migrations {
    create(moduleName: string, migrationName: string): string;
    list(moduleName?: string): string[];
    migrate(moduleName?: string): Promise<any>;
    rollback(moduleName?: string): Promise<any>;
    up(moduleName: string, migrationName?: string): Promise<[]>;
    down(moduleName: string, migrationsName?: string): Promise<[]>;
  }

  class Utils {
    getMigrationsDirectory(moduleName: string): string;
    config(moduleName: string | string[]): knex.MigratorConfig;
    validateModule(moduleName: string): void;
  }
}

