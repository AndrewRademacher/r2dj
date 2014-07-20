angular.module('trackFilters', [])
    .filter('duration', ['$window',
        function($window) {
            return function(input) {
                if (!input) return '';

                var seconds = parseInt(input);

                if (seconds % 60 < 10)
                    return '' + Math.floor(seconds / 60) + ':0' + seconds % 60;
                else
                    return '' + Math.floor(seconds / 60) + ':' + seconds % 60;
            };
        }
    ])