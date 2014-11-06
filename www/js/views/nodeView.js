define([
  "jquery",
  "backbone",
  "doT",
  "views/catalogView"
], function (
    $,
    Backbone,
    doT,
    catalogView
) {

    var nodeView = catalogView.extend({
        el: $("#nodePageContainer"), // content placeholder

        page: $('#nodePage'),

        render: function() {
            var node = this.model;
            var $el = $(this.el);
            $el.append(this.nodeListTemplate(node.Children)).append(this.entryListTemplate(node.Entries));
            this.page.title = node.Name;
            this.makeUp(this.page);
            return this;
        }
    });

    return nodeView;
});