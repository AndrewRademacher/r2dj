'use strict';

/**
 * @ngdoc service
 * @name clientApp.Channel
 * @description
 * # Channel
 * Service in the clientApp.
 */
angular.module('clientApp')
    .service('Vote', function Vote($resource, ApiUrl) {
        return $resource(ApiUrl + '/channel/queue/:id', {}, {
            save: {
                method: 'PUT'
            },
            up: {
                method: 'PUT',
                params: {
                    vote: 1
                }
            },
            down: {
                method: 'PUT',
                params: {
                    vote: -1
                }
            }
        });
    });