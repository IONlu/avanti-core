exports.up = function(knex) {
    return knex.schema.table('host', function(table) {
        table.string('ftpasswd', 64)
            .nullable()
            .after('alias');
    });
};

exports.down = function(knex) {
    return knex.schema.table('host', function(table) {
        table.dropColumn('ftpasswd');
    });
};
