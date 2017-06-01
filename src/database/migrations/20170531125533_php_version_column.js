exports.up = function(knex) {
    return knex.schema.table('host', function(table) {
        table.string('php', 5)
            .notNullable()
            .defaultTo('7.0')
            .after('alias');
    });
};

exports.down = function(knex) {
    return knex.schema.table('host', function(table) {
        table.dropColumn('php');
    });
};
