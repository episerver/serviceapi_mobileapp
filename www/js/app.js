define([ 
  "jquery",
  "backbone",
  "jqm",
  "routers/appRouter",
  "appConfig",
  "database",
  "serviceAPI",
  "xhrWrapper"
   ], 
function( 
  $,
  Backbone, 
  jqm, 
  appRouter,
  appConfig,
  appDatabase,
  serviceAPI,
  xhrWrapper
  ) {

    function app() {

    }

    app.prototype = {
        loginDeferred: null,

        // Application Constructor
        initialize: function(appConfig) {
            // create the Xhr wrapper, with the login action:
            xhrWrapper($.proxy(this.showLogin, this));
            this.appConfig = appConfig;
            this.serviceAPI = new serviceAPI(this.appConfig);
            this.bindEvents();
            $(document).ready($.proxy(this.documentReady, this));
        },

        bindEvents: function() {
            document.addEventListener('deviceready', $.proxy(this.onDeviceReady, this), false);
        },
        // deviceready Event Handler
        onDeviceReady: function() {
            this.receivedEvent('deviceready');
        },
        receivedEvent: function(id) {
            // read access token from database
            this.appDatabase = new appDatabase();
            $.when(this.appDatabase.getAccounts()).then($.proxy(function (results) {
                if (results && results.length > 0) {
                    this.appConfig.accessToken = results.item(0).accesstoken;
                }
                // Initiate the router
                this.router = new appRouter({
                    serviceAPI: this.serviceAPI
                });
            }, this), $.proxy(function () {
                // Initiate the router
                this.router = new appRouter({
                    serviceAPI: this.serviceAPI
                });
            }, this));
        },
        documentReady: function () {
            //$.mobile.page.prototype.options.domCache = false;
            $.support.cors = true;
            $.mobile.allowCrossDomainPages = true;
            $(document).on("click", "[name='loginButton']", $.proxy(this._login, this));
        },
        showLogin: function () {
            $.mobile.changePage("#loginPage");
            if (!this.loginDeferred) {
                this.loginDeferred = $.Deferred();
            }

            return this.loginDeferred.promise();
        },
        _login: function () {
            $.mobile.loading("show");
            $("[name='loginErrorMessage']").hide();
            var username = $("[name='username']").val();
            var password = $("[name='password']").val();

            try {
                $.when(this.serviceAPI.getToken(username, password)).then($.proxy(function (data) {
                    $.mobile.loading("hide");
                    // login succussful
                    this._updateAccessTokenRecore(username, data.access_token); // save it to DB
                    this.appConfig.accessToken = data.access_token;
                    this.loginDeferred.resolve(data.access_token);
                    this.loginDeferred = null;
                }, this), function (jqXHR, error, textStatus) {
                    // login failed
                    $.mobile.loading("hide");
                    $("[name='loginErrorMessage']").show();
                });
            } catch (ex) {
                console.error(ex.stack);
                $.mobile.loading("hide");

                // login failed
                $("[name='loginErrorMessage']").show();
            }
        },
        _updateAccessTokenRecore: function (username, accessToken) {
            $.when(this.appDatabase.getAccount(username)).then($.proxy(function (record) {
                if (record) {
                    this.appDatabase.updateAccount(username, accessToken);
                } else {
                    this.appDatabase.addAccount(username, accessToken);
                }
            }, this));
        }
    }

    return app;

} );