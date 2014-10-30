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
        el: $("#catalogPage"), // content placeholder

        nodeListTemplateString: ' {{~it :value:index}}\
                            <li>\
                                <a href="#node/{{=value.Href}}" data-node-href="{{=value.Href}}" name="nodeDetailLink" >\
                                    <h2>{{! value.Title}}</h2>\
                                </a>\
                            </li>\
                            {{~}}',

        entryListTemplateString: '{{~it :value:index}}\
                                    <li>\
                                        <a href="#entry/{{=value.Href}}" data-entry-href="{{=value.Href}}" name="entryDetailLink" >\
                                            <img class="ui-li-thumb" src="{{? value.Assets && value.Assets[0]}}{{=value.Assets[0].Title}}{{??}}img/thumbnail-placeholder.png{{?}}" alt="{{! value.Title}}" />\
                                            <h2>{{! value.Title}}</h2>\
                                        </a>\
                                    </li>\
                                    {{~}}',

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
            var $page = $(this.el);
            $page.find("ul[name='nodeList']").html(this.nodeListTemplate(catalog.Nodes));
            $page.find("ul[name='entryList']").html(this.entryListTemplate(catalog.Entries));
            $page.title = catalog.Name;
            this.makeUp($page);
            return this;
        }
    });

    return catalogView;
});