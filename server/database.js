const Database = require("better-sqlite3");
const db = new Database(".data/db.sqlite3");
const mod = module.exports;

void function(){
	mod.create = function(name){
		const stmt = db.prepare(`CREATE TABLE IF NOT EXISTS ${name}(`
			+ `id TEXT,`
			+ `key TEXT,`
			+ `value TEXT,`
			+ `UNIQUE(id, key)`
		+ `)`);

		stmt.run();
	}

	mod.upsert = function(table, id, key, value){
		const stmt = db.prepare(`INSERT INTO ${table}(id, key, value) `
			+ `VALUES(?, ?, ?) ON CONFLICT (id, key) DO `
			+ `UPDATE SET value = ?`
		);

		stmt.run(id, key, value, value);
	}

	mod.select = function(table, id, key){
		const stmt = db.prepare(`SELECT * FROM ${table} WHERE `
			+ `id = ? `
			+ `AND key = ?`
		);

		const data = stmt.get(id, key);
		if(!data)
			return null;

		return data.value;
	}

	mod.selectAll = function(table, id){
		const stmt = db.prepare(`SELECT * FROM ${table} WHERE `
			+ `id = ?`
		);
		const res = {};
		for(const { key, value } of stmt.all(id)){
			if(res[key]){
				if(res[key] instanceof Array)
					res[key].push(value);
				else
					res[key] = [ res[key], value ];
			}

			res[key] = value;
		}

		return res;
	}

	mod.delete = function(table, id, key){
		const stmt = db.prepare(`DELETE FROM ${table} WHERE `
			+ `id = ? `
			+ `AND key = ?`
		);

		stmt.run();
	}

	mod.wipe = function(table, id, key){
		const stmt = db.prepare(`DELETE FROM ${table} WHERE `
			+ `id = ? `
		);

		stmt.run();
	}
}();