define([
  "jquery",
  "backbone",
  "doT",
  "views/baseView"
], function (
    $,
    Backbone,
    doT,
    _baseView
) {

    var catalogView = _baseView.extend({
        el: $("#catalogPageContainer"), // content placeholder

        page: $('#catalogPage'),

        nodeListTemplateString: '\
                        <ul data-role="listview" name="nodeList" data-split-theme="a" data-inset="true" >\
                            {{~it :value:index}}\
                            <li>\
                                <a href="#node/{{=value.Href}}" data-node-href="{{=value.Href}}" name="nodeDetailLink" >\
                                    <h2>{{! value.Title}}</h2>\
                                </a>\
                            </li>\
                            {{~}}\
                        </ul>',

        entryListTemplateString: '\
                                <ul data-role="listview" class="ui-gridview" name="entryList" data-split-theme="a" data-inset="true" >\
                                    {{~it :value:index}}\
                                    <li>\
                                        <a href="#entry/{{=value.Href}}" data-entry-href="{{=value.Href}}" name="entryDetailLink" >\
                                            <img class="ui-li-thumb" src="{{? value.Properties.length > 1 && value.Properties[1].Value}}{{=value.Properties[1].Value}}{{??}}img/thumbnail-placeholder.png{{?}}" alt="{{! value.Title}}" />\
                                            <h2>{{! value.Title}}</h2>\
                                        </a>\
                                    </li>\
                                    {{~}}\
                                </ul>',

        initialize: function() {
            _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

            // As these templates will be used repetitively we will precompile it to a named template
            this.entryListTemplate = doT.template(this.entryListTemplateString);
            this.nodeListTemplate = doT.template(this.nodeListTemplateString);

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