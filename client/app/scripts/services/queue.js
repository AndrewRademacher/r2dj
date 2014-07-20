'use strict';

/**
 * @ngdoc service
 * @name clientApp.Channel
 * @description
 * # Channel
 * Service in the clientApp.
 */
angular.module('clientApp')
    .service('Queue', function Queue($resource, ApiUrl) {
        return $resource(ApiUrl + '/channel/queue/:id', {}, {
            vote: {
                method: 'PUT'
            }
        });
    });