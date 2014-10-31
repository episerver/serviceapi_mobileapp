define([
  "jquery",
  "backbone",
  "views/catalogView",
  "views/nodeView",
  "views/entryView"
], function (
    $,
    Backbone,
    catalogView,
    nodeView,
    entryView
) {
    var appRouter = Backbone.Router.extend({
        serviceAPI: null,

        // The Router constructor
        initialize: function() {
            $.extend(this, arguments[0]);
            this.catalogView = new catalogView();
            this.nodeView = new nodeView();
            this.entryView = new entryView({ serviceAPI: this.serviceAPI });

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();
        },

        routes: {
            "node/*href": "loadNode",
            "entry/*href": "loadEntry",
            //":route/:action": "loadView",
            "": "home"
        },

        loadNode: function (href) {
            this._loadPage(this.serviceAPI.getNode(href), $.proxy(function (node) {
                this.nodeView.model = node;
                this.nodeView.render(); // TODO this should be triggered automatically
                return this.nodeView.el;
            }, this));
        },

        loadEntry: function (href) {
            this._loadPage(this.serviceAPI.getEntry(href), $.proxy(function (entry) {
                this.entryView.model = entry;
                this.entryView.serviceAPI = this.serviceAPI;
                this.entryView.render(); // TODO this should be triggered automatically
                return this.entryView.el;
            }, this));
        },

        home: function () {
            this._loadPage(this.serviceAPI.getCatalogs(), $.proxy(function (catalogs) {
                this.catalogView.model = catalogs[0];
                this.catalogView.render(); // TODO this should be triggered automatically
                return this.catalogView.el;
            }, this));
        },

        _loadPage: function (getDataPromise, renderAction) {
            $.mobile.loading("show");
            $.when(getDataPromise).then($.proxy(function (data) {
                $.mobile.changePage($(renderAction(data)));
                $.mobile.loading("hide");
            }, this));
        }
    });

    return appRouter;
});

