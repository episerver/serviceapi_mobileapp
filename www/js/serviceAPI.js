define([
	"jquery"
], function (
	$
) {

	function serviceAPI(_appConfig) {
		this.appConfig = _appConfig;
	}

	serviceAPI.prototype = {
		getCatalogs: function () {
			return this._get(this.appConfig.servicePath + "commerce/catalogs/");
		},

		getCatalog: function (catalogName) {
			return this._get(this.appConfig.servicePath + "commerce/catalogs/" + catalogName);
		},

		getNode: function (nodeHref) {
			return this._get(this.appConfig.rootPath + nodeHref);
		},

		getEntry: function (entryHref) {
			return this._get(this.appConfig.rootPath + entryHref);
		},

		getInventory: function (inventoryHref, entryCode) {
		    if (inventoryHref != null) {
		        return this._get(this.appConfig.rootPath + inventoryHref);
		    }

		    return this._get(this.appConfig.rootPath + "/episerverapi/commerce/entries/" + entryCode + "/inventories")
		},

		makeOrder: function (variationCode, email) {
		    var params = {
		        variationCode: variationCode,
		        email: email
		    };

		    return this._post(this.appConfig.servicePath + "orders/order/", params);
		},

		getStores: function (entryCode) {
			return this._get(this.appConfig.servicePath + "storelocations/" + entryCode + "/instock/");
		},

		getToken: function (username, password) {
			var params = {
				grant_type: "password",
				username: username,
				password: password
			};
			// call the native ajax function to bypass the login check
			return this._call(this.appConfig.servicePath + "token", "POST", params, null, true);
		},

		_get: function (url, params) {
			return this._call(url, "GET", params);
		},

		_post: function (url, params) {
			return this._call(url, "POST", params);
		},

		_put: function (url, params) {
			return this._call(url, "PUT", params);
		},

		_delete: function (url, params) {
			return this._call(url, "DELETE", params);
		},

		_call: function (url, type, params, useJqueryAjax/* use native Jquery ajax function instead of our wrapper, used when sending login action */) {
			var request = {
		        type: type, //GET, POST, PUT, DELETE
		        url: url,
		        dataType: "json"
			};

			// NOTE: get english only
			request.headers = { "Accept-Language": "en" };
			if (this.appConfig.accessToken) {
				$.extend(request.headers, { "Authorization": "Bearer " + this.appConfig.accessToken });
			}
			if (params) {
				request.data = params;
			}

			if (useJqueryAjax) {
				return $._ajaxHandler(request);
			} else {
				return $.ajax(request);
			}
		}
	};

	return serviceAPI;

});