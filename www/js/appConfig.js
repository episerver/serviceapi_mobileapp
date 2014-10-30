define([
], function (
) {

	return function appConfig(rootPath, _accessToken, _itemPerPage) {
		this.rootPath = rootPath || "https://partnerforum2014.azurewebsites.net"; // including protocol
		this.servicePath = this.rootPath + "/episerverapi/";
		this.accessToken = _accessToken || ""; // get from episerverapi/token
		this.itemPerPage = _itemPerPage || 20;
	}

});

