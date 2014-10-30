define([
	"jquery"
], function (
	$
) {

	function appDatabase() {
		// init
		this._openDatabase();
	}

	appDatabase.prototype = {
		_db: {},
		
		addAccount: function (username, accesstoken) {
			var deferred = $.Deferred();
			this._db.transaction($.proxy(function (tx) {
				var sql = "INSERT INTO ACCOUNT (username, accesstoken) VALUES ('{0}', '{1}')";
				sql = sql.replace("{0}", this._escape_string(username))
					.replace("{1}", this._escape_string(accesstoken));
				tx.executeSql(sql);
				//console.log(sql);
			}, this), deferred.reject, deferred.resolve);

			return deferred.promise();
		},
		
		updateAccount: function (username, accesstoken) {
			var deferred = $.Deferred();
			this._db.transaction($.proxy(function (tx) {
				var sql = "UPDATE ACCOUNT SET username='{0}', accesstoken='{1}' WHERE username='{2}'";
				sql = sql.replace("{0}", this._escape_string(username))
					.replace("{1}", this._escape_string(accesstoken))
					.replace("{2}", this._escape_string(username));
				//console.log(sql);
				tx.executeSql(sql);
			}, this), deferred.reject, deferred.resolve);

			return deferred.promise();
		},
		
		getAccount: function (username) {
			var deferred = $.Deferred();
			this._db.transaction($.proxy(function(tx) {
				var sql = "SELECT * FROM ACCOUNT WHERE username='{0}'";
				sql = sql.replace("{0}", this._escape_string(username));
				//console.log(sql);
				tx.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length;
				    //console.log("ACCOUNT table: " + len + " rows found.");
				    if (results.rows.length > 0) {
				    	deferred.resolve(results.rows.item(0));
				    } else {
				    	deferred.resolve(null);
				    }
				}, deferred.reject);
			}, this), deferred.reject);

			return deferred.promise();
		},
		
		getAccounts: function () {
			var deferred = $.Deferred();
			this._db.transaction(function(tx) {
				var sql = "SELECT * FROM ACCOUNT";
				//console.log(sql);
				tx.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length;
				    //console.log("ACCOUNT table: " + len + " rows found.");
				    if (results.rows.length > 0) {
				    	deferred.resolve(results.rows);
				    } else {
				    	deferred.resolve(null);
				    }
				}, deferred.reject);
			}, deferred.reject);

			return deferred.promise();
		},
		
		// private
		_openDatabase: function () {
			this._db = window.openDatabase("onlinestore", "1.0", "Online Store Database", 2000000); // 2MB
			this._db.transaction(this._populateDB10, this._errorCB, this._successCB);
		},

		// populate database schema version 1.0
		_populateDB10: function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS ACCOUNT (username, accesstoken)');
		},

		_errorCB: function (err) {
			console.log("Error processing SQL: " + err.code);
		},

		_successCB: function() {
			//console.log("DB sql executes success!");
		},

		_escape_string: function(str) {
		    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (c) {
		        switch (c) {
		            case "\0":
		                return "\\0";
		            case "\x08":
		                return "\\b";
		            case "\x09":
		                return "\\t";
		            case "\x1a":
		                return "\\z";
		            case "\n":
		                return "\\n";
		            case "\r":
		                return "\\r";
		            case "\"":
		            case "'":
		            case "\\":
		            case "%":
		                return "\\"+c; // prepends a backslash to backslash, percent,
		                                  // and double/single quotes
		        }
		    });
		}
	};

	return appDatabase;
});