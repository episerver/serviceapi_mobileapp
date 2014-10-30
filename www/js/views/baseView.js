define([
  "jquery",
  "backbone"
], function (
    $,
    Backbone
) {

	var _baseView = Backbone.View.extend({
	    // make up jQuery mobile page
	    makeUp: function ($page) {
		    $page.trigger("create");
		    $page.find(":jqmData(role=listview)").listview("refresh");
		    this.changeTitle($page.title);
	    },

	    changeTitle: function (title) {
	    	$(".ui-title").html(title);
	    }
	});

	return _baseView;
});