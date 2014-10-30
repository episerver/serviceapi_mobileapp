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
        el: $("#nodePage"), // content placeholder

        render: function() {
            var node = this.model;
            var $page = $(this.el);
            $page.find("ul[name='nodeList']").html(this.nodeListTemplate(node.Children));
            $page.find("ul[name='entryList']").html(this.entryListTemplate(node.Entries));
            $page.title = node.Name;
            this.makeUp($page);
            return this;
        }
    });

    return nodeView;
});