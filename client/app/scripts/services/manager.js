'use strict';

/**
 * @ngdoc service
 * @name clientApp.Manager
 * @description
 * # Manager
 * Service in the clientApp.
 */
angular.module('clientApp')
    .service('Manager', function Manager($resource, ApiUrl) {
        return $resource(ApiUrl + '/manager', {}, {
            save: {
                method: 'POST'
            }
        });
    });
