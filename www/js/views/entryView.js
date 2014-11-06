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
        el: $("#entryDetailContainer"), // content placeholder

        page: $('#entryDetailPage'),

        entryDetailTemplateString: '<img class="thumbnail stack" src="{{? it.Assets && it.Assets[0]}}{{=it.Assets[0].Title}}{{??}}img/thumbnail-placeholder.png{{?}}" alt="{{! it.Name}}" />\
                                    <h1>{{! it.Name}}</h1>\
                                    <p>Price: <a class="price">{{? it.Prices && it.Prices[0]}}{{=it.Prices[0].Title}}{{?}}</a></p>\
                                    <p>Inventory: <a name="inventory">{{? it.WarehouseInventories && it.WarehouseInventories[0]}}{{=it.WarehouseInventories[0].Title}}{{?}}</a></p>\
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
                                    <a id="storeLookup" href="#entry/{{=it.Code}}/stores" data-role="button">Find nearest store</a>\
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
            var $el = $(this.el);
            $el.append(this.entryDetailTemplate(entry));
            this.page.title = entry.Name;
            this.makeUp(this.page);

            if (this.model.EntryType == "Product") {
                this.variantChange();
            }
            return this;
        },

        makeOrder: function () {

            var email = $(this.el).find("[name='emailAddress']").val();
            var code = "";

            if (this.model.EntryType == "Variation") {
                code = this.model.Code;
            }
            else {
                var selectedIndex = $(this.el).find("select[name='select-variant']").val();
                var variant = this.model.ChildCatalogEntries[selectedIndex];
                code = variant.Properties[0].Value;
            }
            
            try {
                var my = this;
                $.when(this.serviceAPI.makeOrder(code, email)).then($.proxy(function (data) {
                    $(this.el).find("[name='makeOrderStatus']").html(data).show();

                    $.when(this.serviceAPI.getInventory(null, code)).then($.proxy(function (data) {
                        $(this.el).find("[name='inventory']").html(data[0].WarehouseCode + " - " + data[0].InStockQuantity).show();
                    }, this));

                }, this), function (data) {
                    $(my.el).find("[name='makeOrderStatus']").html(data[0].responseJSON.Message).show();
                }, this);
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
            if (!variant) {
                $("#storeLookup").hide();
                return;
            }
            $("#storeLookup").show().attr("href", "#entry/" + variant.Properties[0].Value + "/stores");

            var thumbnailUrl = "img/thumbnail-placeholder.png";
            if (variant.Properties.length > 1 && variant.Properties[1].Value) {
                thumbnailUrl = variant.Properties[1].Value.replace("/thumbnail", "");
            }
            $(this.el).find("img.thumbnail").attr("src", thumbnailUrl);
            this.changeTitle(variant.Title);

            $.when(this.serviceAPI.getEntry(variant.Href)).then($.proxy(function (data) {
                $(this.el).find("[name='inventory']").html(data.WarehouseInventories[0].Title).show();
                $(this.el).find(".price").html(data.Prices[0].Title).show();
            }, this));
        }
    });

    return entryView;
});