define([
  "jquery",
  "backbone",
  "doT",
  "views/baseView",
  "text!views/templates/storeList.html"
], function (
    $,
    Backbone,
    doT,
    _baseView,
    storeListTemplateString
) {

    var storeView = _baseView.extend({
        el: $("#storesContainer"), // content placeholder

        page: $('#storesPage'),

        map: null,

        events: {
          'change select[name="storeSelector"]': 'storeChange'
        },

        initialize: function() {
            _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

            this.storeListTemplate = doT.template(storeListTemplateString);

            this.bind("reset", this.resetView);            this.model = new Backbone.Model();
            this.model.bind('change', this.render); // render the view when model changed

            $(this.el).append('<div style="width:100%;height:400px" class="mapCanvas"></div>')
                        .append('<div class="storeListContainer"></div>');
        },

        destroy: function () {
            if (this.map) {
                this.map.off(); // remove all event listener
                this.map.remove(); // Destroy the map completely
                this.map = null;
                delete this.map;
            }

            this.undelegateEvents();
            this.$el.removeData().unbind(); 
            this.$el.empty();
        },

        render: function() {
            this.page.title = "Find nearest store";

            if (!this.map) {
                this.initMap($(this.el).find(".mapCanvas")[0]);
            } else {
                this.renderStores(this.model);
            }

            return this;
        },

        initMap: function (mapContainer) {
            try {
                // Initialize the map plugin
                this.map = plugin.google.maps.Map.getMap(mapContainer);
                this.map.setMapTypeId(plugin.google.maps.MapTypeId.ROADMAP);
                this.map.setZoom(8);
                this.map.setMyLocationEnabled(true);
                this.map.on(plugin.google.maps.event.MAP_READY, $.proxy(function () {
                    this.renderStores(this.model);
                }, this));
            }  catch (ex) {
                alert(ex);
            }
        },

        renderStores: function (stores) {
            // render store dropdownbox
            $(this.el).find(".storeListContainer").html(this.storeListTemplate(stores));
            this.makeUp(this.page);

            try {
                // get current location and add it on map
                this.map.getMyLocation($.proxy(function (location) {
                    this.map.setCenter(location.latLng);
                    this.map.animateCamera({
                      'target': location.latLng,
                      'zoom': 12
                    });
                }, this), function (errorMessage) {
                    alert("Error when getting current location: " + errorMessage);
                });
            }  catch (ex) {
                alert(ex);
            }

            // add stores to map
            $.each(stores, $.proxy(function (index, value) {
                try {
                    this.map.addMarker({
                        'position': { lat: value.Latitude, lng: value.Longitude },
                        'title': value.Name,
                        'snippet': value.Address,
                        'storeIndex': index
                    }, $.proxy(function (marker) { // when marker has been rendered
                        // listen for storeChange event to open the appropriated marker
                        this.map.on("storeChange", $.proxy(function (storeIndex) {
                            if (storeIndex === -1) {
                                return;
                            }
                            if (marker.get("storeIndex") == storeIndex) {
                                this.map.animateCamera({
                                    'target': marker.get('position'),
                                    'zoom': 12
                                });
                                marker.showInfoWindow();
                            }
                        }, this));
                    }, this));
                }  catch (ex) {
                    alert(ex);
                }
            }, this));
        },

        storeChange: function () {
            var selectedIndex = $(this.el).find("select[name='storeSelector']").val();
            if (this.map) {
                this.map.trigger("storeChange", selectedIndex);
            }
        }
    });

    return storeView;
});