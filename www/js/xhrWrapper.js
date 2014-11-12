// xhr wrapper, which supports logout error handling
define([
      "jquery"
], function (
      $
) {

      return function xhrWrapper(loginAction) {
            var _ajaxHandler = $.ajax;
            $.extend({
                  _ajaxHandler: _ajaxHandler,
                  ajax: function (url, options) {
                        var deferred = $.Deferred();
                        var urlArgument = url;
                        var optionArgument = options;
                        var xhrResult = this._ajaxHandler(urlArgument, optionArgument);

                        $.when(xhrResult).then(function(data) {
                              // succeed
                              deferred.resolve(data);
                        }, function (jqXHR, error, textStatus) {
                              // fail
                              if (jqXHR.status == "401") {
                                    // need to login
                                    $.when(loginAction()).then(function (accessToken) {
                                          // login successful, let's retry
                                          var authorizationHeader = { "Authorization": "Bearer " + accessToken };
                                          if (optionArgument) {
                                                optionArgument.headers = authorizationHeader;
                                          } else {
                                                urlArgument.headers = authorizationHeader;
                                          }
                                          $.when($._ajaxHandler(urlArgument, optionArgument)).then(deferred.resolve, deferred.reject);
                                    }, function (err) {
                                          // login failed, pass the error back to the caller
                                          deferred.reject(arguments);
                                    });
                              } else {
                                    deferred.reject(arguments);
                              }
                        });

                        return deferred.promise();
                  }
            });
      }

});