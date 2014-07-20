'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
    .module('clientApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'LocalStorageModule',
        'config',
        'trackFilters'
    ])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .state('channels', {
                abstract: true,
                url: '/channels',
                templateUrl: 'views/channels.html',
                controller: 'ChannelIndexCtrl'
            })
            .state('channels.list', {
                url: '',
                templateUrl: 'views/channels.list.html'
            })
            .state('channels.new', {
                url: '/new',
                templateUrl: 'views/channels.new.html',
                controller: 'ChannelNewCtrl'
            })
            .state('channels.detail', {
                url: '/{channelId}',
                templateUrl: 'views/channels.detail.html',
                controller: 'ChannelDetailCtrl'
            })
            .state('channels.search', {
                url: '/{channelId}/search',
                templateUrl: 'views/channels.search.html',
                controller: 'ChannelSongSearchCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            });

        $httpProvider.interceptors.push('LoginInterceptor');
    }).run(function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });