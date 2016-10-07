class Database {

    constructor(db) {
        this.db = db;
    }

    async run(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    async get(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, function(err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async all(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

}

export default Database;
