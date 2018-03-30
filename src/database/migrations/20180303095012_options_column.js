exports.up = function(knex) {
    return knex.schema.table('host', function(table) {
        table.text('options')
            .nullable()
            .after('alias');
    });
};

exports.down = function(knex) {
    return knex.schema.table('host', function(table) {
        table.dropColumn('options');
    });
};
