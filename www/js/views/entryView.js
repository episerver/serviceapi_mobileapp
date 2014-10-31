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

    var entryView = _baseView.extend({
        el: $("#entryDetailPage"), // content placeholder

        entryDetailTemplateString: '<img class="thumbnail stack" src="{{? it.Assets && it.Assets[0]}}{{=it.Assets[0].Title}}{{??}}img/thumbnail-placeholder.png{{?}}" alt="{{! it.Name}}" />\
                                    <h1>{{! it.Name}}</h1>\
                                    <p>Price: <a class="price">{{? it.Prices && it.Prices[0]}}{{=it.Prices[0].Title}}{{?}}</a></p>\
                                    <p>Inventory: <a class="inventory">{{? it.WarehouseInventories && it.WarehouseInventories[0]}}{{=it.WarehouseInventories[0].Title}}{{?}}</a></p>\
                                    <label for="select-variant" class="select">Color:</label>\
                                    {{? it.ChildCatalogEntries && it.ChildCatalogEntries.length > 1}}\
                                        <select name="select-variant">\
                                            {{~it.ChildCatalogEntries :value:index}}\
                                            <option value="{{= index}}">{{= value.Title}}</option>\
                                            {{~}}\
                                        </select>\
                                    {{?}}\
                                    <input type="email" placeholder="Enter your email address" name="emailAddress" />\
                                    <p name="makeOrderStatus" style="display: none"></p>\
                                    <button id="makeOrder" data-entry-code="{{=it.Code}}">Order</button>\
                                    <p class="description">{{! it.SeoInformation[0].Description}}</p>',

        serviceAPI: null,

        events: {
          'click button#makeOrder': 'makeOrder',
          'change select[name="select-variant"]': 'variantChange'
        },

        initialize: function() {
            _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

            // As these templates will be used repetitively we will precompile it to a named template
            this.entryDetailTemplate = doT.template(this.entryDetailTemplateString);

            this.model = new Backbone.Model();
            this.model.bind('change', this.render); // render the view when model changed
        },

        render: function() {
            var entry = this.model;
            var $page = $(this.el);
            $page.find("div.entryDetail").html(this.entryDetailTemplate(entry));
            $page.title = entry.Name;
            this.makeUp($page);
            return this;
        },

        makeOrder: function () {
            var selectedIndex = $(this.el).find("select[name='select-variant']").val();
            var variant = this.model.ChildCatalogEntries[selectedIndex];
            var code = variant.Properties[0].Value;
            var email = $(this.el).find("[name='emailAddress']").val();

            try {
                this.serviceAPI.makeOrder(code, email);
                $(this.el).find("[name='makeOrderStatus']").html("Ser lovande ut").show();
            } catch (ex) {
                console.error(ex.stack);
                $.mobile.loading("hide");

                // order failed
                $(this.el).find("[name='makeOrderStatus']").html(ex.message).show();
            }
        },

        variantChange: function () {
            var selectedIndex = $(this.el).find("select[name='select-variant']").val();
            var variant = this.model.ChildCatalogEntries[selectedIndex];
            $(this.el).find("img.thumbnail").attr("src", variant.Properties[1].Value.replace("/thumbnail", ""));
            $(this.el).find(".price").text(this.model.Prices[selectedIndex].Title);
            this.changeTitle(variant.Title);
        }
    });

    return entryView;
});