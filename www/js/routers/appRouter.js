define([
  "jquery",
  "backbone",
  "views/catalogView",
  "views/nodeView",
  "views/entryView",
  "views/storeView"
], function (
    $,
    Backbone,
    catalogView,
    nodeView,
    entryView,
    storeView
) {
    var appRouter = Backbone.Router.extend({
        serviceAPI: null,

        catalogView: catalogView,

        nodeView: nodeView,

        entryView: entryView,

        storeView: storeView,

        // The Router constructor
        initialize: function() {
            $.extend(this, arguments[0]);

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();
        },

        routes: {
            "entry/:entryCode/stores": "findNearestStore",
            "node/*href": "loadNode",
            "entry/*href": "loadEntry",
            "": "home"
        },

        loadNode: function (href) {
            this._loadPage(this.serviceAPI.getNode(href), $.proxy(function (node) {
                var nodeView = new this.nodeView();
                nodeView.model = node;
                nodeView.render(); // TODO this should be triggered automatically
                return nodeView;
            }, this));
        },

        loadEntry: function (href) {
            this._loadPage(this.serviceAPI.getEntry(href), $.proxy(function (entry) {
                var entryView = new this.entryView();
                entryView.model = entry;
                entryView.serviceAPI = this.serviceAPI;
                entryView.render(); // TODO this should be triggered automatically
                return entryView;
            }, this));
        },

        home: function () {
            this._loadPage(this.serviceAPI.getCatalogs(), $.proxy(function (catalogs) {
                var catalogView = new this.catalogView();
                catalogView.model = catalogs[0];
                catalogView.render(); // TODO this should be triggered automatically
                return catalogView;
            }, this));
        },

        findNearestStore: function (entryCode) {
            this._loadPage(this.serviceAPI.getStores(entryCode), $.proxy(function (stores) {
                var storeView = new this.storeView();
                storeView.model = stores;
                storeView.render(); // TODO this should be triggered automatically
                return storeView;
            }, this));
        },

        _loadPage: function (getDataPromise, renderAction) {
            if (this._currentView) {
                this._currentView.destroy();
                this._currentView = null;
                delete this._currentView;
            }
            $.mobile.loading("show");
            $.when(getDataPromise).then($.proxy(function (data) {
                this._currentView = renderAction(data);
                $.mobile.changePage($(this._currentView.page));
                $.mobile.loading("hide");
            }, this));
        }
    });

    return appRouter;
});

