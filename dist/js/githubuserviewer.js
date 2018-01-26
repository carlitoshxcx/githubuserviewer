/**
 * githubuserviewer - GitHub User Viewer - Desbravador Front-End Test
 * @author Carlos Eduardo Gomes <carlitoshxcx@gmail.com>
 * @link https://github.com/carlitoshxcx/githubuserviewer/
 * @version v0.0.1
 */
(function() {
    "use strict";

    var _githubuserviewer = this;

    var checkStatus = function(response){
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    };

    var parseJSON = function(response) {
        return response.json();
    };

    var init = function() {
        fetch('https://api.github.com/users/zurb/repos')
            .then(checkStatus)
            .then(parseJSON)
            .then(function(data) {
                console.log('request succeeded with JSON response', data);
            }).catch(function(error) {
                console.log('request failed', error);
            });
    };
    _githubuserviewer.init = init;

    // INIT
    _githubuserviewer.init();

}.call(this))