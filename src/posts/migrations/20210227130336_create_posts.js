exports.up = function(knex) {
  return knex.schema.createTable('timesheet', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.date('time').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('timesheet');
};
