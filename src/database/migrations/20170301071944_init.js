exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('client', function(table) {
            table.string('client', 100).notNullable().primary();
            table.string('user', 100).notNullable();
            table.string('path', 200).notNullable();
        }),
        knex.schema.createTableIfNotExists('host', function(table) {
            table.string('host', 100).notNullable().primary();
            table.string('client', 100).notNullable();
            table.string('user', 100).notNullable();
            table.string('path', 200).notNullable();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('user'),
        knex.schema.dropTable('host')
    ]);
};
