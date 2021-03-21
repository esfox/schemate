import { MigrationService } from './migration-service';

export const Commands = {
  create: MigrationService.create,
  list: MigrationService.list,
  migrate: MigrationService.migrate,
  rollback: MigrationService.rollback,
  up: MigrationService.up,
  down: MigrationService.down,
};
