
/** @param {import('knex')} knex */
exports.up = function(knex)
{
  return knex.schema.createTable('timerecord', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.integer('some').notNullable();
  });
};

/** @param {import('knex')} knex */
exports.down = function(knex)
{
  return knex.schema.dropTable('timerecord');
};
