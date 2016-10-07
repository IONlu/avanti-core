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

}

export default Database;
