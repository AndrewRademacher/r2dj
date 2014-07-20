'use strict';

/**
 * @ngdoc service
 * @name clientApp.Channel
 * @description
 * # Channel
 * Service in the clientApp.
 */
angular.module('clientApp')
    .service('Channel', function Channel($resource, ApiUrl) {
        return $resource(ApiUrl + '/channel/:id', {
            id: '@id'
        });
    });