exports.up = function(knex) {
    return knex.schema.table('host', function(table) {
        table.text('alias')
            .after('path');
    });
};

exports.down = function(knex) {
    return knex.schema.table('host', function(table) {
        table.dropColumn('alias');
    });
};
