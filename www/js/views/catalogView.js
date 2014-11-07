define([
  "jquery",
  "backbone",
  "doT",
  "views/baseView",
  "text!views/templates/nodeList.html",
  "text!views/templates/entryList.html"
], function (
    $,
    Backbone,
    doT,
    _baseView,
    nodeListTemplateString,
    entryListTemplateString
) {

    var catalogView = _baseView.extend({
        el: $("#catalogPageContainer"), // content placeholder

        page: $('#catalogPage'),

        initialize: function() {
            _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

            // As these templates will be used repetitively we will precompile it to a named template
            this.entryListTemplate = doT.template(entryListTemplateString);
            this.nodeListTemplate = doT.template(nodeListTemplateString);

            this.model = new Backbone.Model();
            this.model.bind('change', this.render); // render the view when model changed
        },

        render: function() {
            var catalog = this.model;
            var $el = $(this.el);
            $el.append(this.nodeListTemplate(catalog.Nodes)).append(this.entryListTemplate(catalog.Entries));
            this.page.title = catalog.Name;
            this.makeUp(this.page);
            return this;
        }
    });

    return catalogView;
});