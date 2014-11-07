// Sets the require.js configuration for your application.
require.config( {

  // 3rd party script alias names
  paths: {
      // Core Libraries
      "jquery": "libs/jquery.min",
      "jqm": "libs/jquery.mobile-1.4.4.min",
      "backbone": "libs/backbone-min",
      'text': 'libs/text',
      "doT": "libs/doT.min",
      "linq": "libs/linq.min",
      "underscore": "libs/underscore-min"
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
      "backbone": {
            "deps": [ "underscore", "jquery" ],
            "exports": "Backbone"  //attaches "Backbone" to the window object
      }

  } // end Shim Configuration

} );

// Includes File Dependencies
require([ 
  "jquery"
   ], 
function( 
  $
  ) {

  $( document ).one( "mobileinit", function() {
    // disable jqm hyperlink handling in order to make backbone router works
    // Prevents all anchor click handling
    $.mobile.linkBindingEnabled = false;

    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;
  });

  $( document ).on( "pagecreate", function() {
      $( "body > [data-role='panel']" ).panel();
      $( "body > [data-role='panel']" ).trigger("create");
      $( "body > [data-role='panel'] [data-role='listview']" ).listview();
      $( document ).on( "swipeleft swiperight", function( e ) {
          // We check if there is no open panel on the page because otherwise
          // a swipe to close the left panel would also open the right panel (and v.v.).
          // We do this by checking the data that the framework stores on the page element (panel: open).
          if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
              if ( e.type === "swipeleft" ) {
                  $( "#right-panel" ).panel( "open" );
              } else if ( e.type === "swiperight" ) {
                  $( "#left-panel" ).panel( "open" );
              }
          }
      });
  });
  $( document ).one( "pageshow", function() {
      $( "body > [data-role='header']" ).toolbar();
      $( "body > [data-role='header'] [data-role='navbar']" ).navbar();
  });


  require([ 
    "app",
    "appConfig"
     ], 
  function( 
    app,
    appConfig
    ) {

    // create and init appplication
    this.app = new app();
    this.app.initialize(new appConfig());
  } );
} );