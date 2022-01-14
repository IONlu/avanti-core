exports.up = function(knex) {
    return knex.schema.table('host', function(table) {
        table.boolean('ssl')
            .nullable()
            .defaultTo(false)
            .after('alias');
    });
};

exports.down = function(knex) {
    return knex.schema.table('host', function(table) {
        table.dropColumn('ssl');
    });
};
