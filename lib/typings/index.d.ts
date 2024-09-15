declare module 'schemate' {

  import knex from 'knex';

  interface Module {
    migrationsDir: string;
  }

  class Config {
    public static modules: { key: string, module: Module };
    public static knex: knex;
    public static init(args: { knexPath: string, migrationsDir?: string }): void;
    public static addModule(moduleName: string, migrationsDir: string): void;
  }

  class Migrations {
    public static create(moduleName: string, migrationName: string): string;
    public static list(moduleName?: string): string[];
    public static migrate(moduleName?: string): Promise<any>;
    public static rollback(moduleName?: string): Promise<any>;
    public static up(moduleName: string, migrationName?: string): Promise<[]>;
    public static down(moduleName: string, migrationsName?: string): Promise<[]>;
  }

  class Utils {
    public static getMigrationsDirectory(moduleName: string): string;
    public static config(moduleName: string | string[]): knex.MigratorConfig;
    public static validateModule(moduleName: string): void;
  }
}

