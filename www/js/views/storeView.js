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

    var storeView = _baseView.extend({
        el: $("#map_canvas"), // content placeholder

        page: $('#storesPage'),

        map: null,

        initialize: function() {
            _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

            this.bind("reset", this.resetView);            this.model = new Backbone.Model();
            this.model.bind('change', this.render); // render the view when model changed
        },

        render: function() {
            this.page.title = "Find nearest store";
            this.makeUp(this.page);

            if (!this.map) {
                this.initMap();
            } else {
                this.renderMarkers(this.model);
            }

            return this;
        },

        initMap: function () {
            try {
                // Initialize the map plugin
                this.map = plugin.google.maps.Map.getMap(this.el);
                this.map.setMapTypeId(plugin.google.maps.MapTypeId.ROADMAP);
                this.map.setZoom(8);
                this.map.on(plugin.google.maps.event.MAP_READY, $.proxy(function () {
                    this.renderMarkers(this.model);
                }, this));
            }  catch (ex) {
                alert(ex);
            }
        },

        renderMarkers: function (stores) {
            try {
                // get current location and add it on map
                this.map.getMyLocation($.proxy(function (location) {
                    this.map.setCenter(location.latLng);
                    this.map.animateCamera({
                      'target': location.latLng,
                      'zoom': 12
                    });
                    this.map.addMarker({
                        'position': location.latLng,
                        'title': "You are here",
                        'icon' : 'www/img/marker.png'
                    });
                }, this), function (errorMessage) {
                    alert("Error when getting current location: " + errorMessage);
                });

                $.each(stores, $.proxy(function (index, value) {
                    this.map.addMarker({
                        'position': { lat: value.Latitude, lng: value.Longitude },
                        'title': value.Name + "\n" + value.Address
                    });
                }, this));
            }  catch (ex) {
                alert(ex);
            }
        }
    });

    return storeView;
});