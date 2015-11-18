angular.module('tweetsService', [])
  .factory('tweetsService', ['$http', '$q', function tweetsServiceFactory ($http, $q) {
    return {
      search: function (tag, since) {
        var base = config.baseUrl + '/twitter/search/?query=';
        var params = tag + ' ' + since + ' -RT';

        url = base + window.encodeURIComponent(params);

        var deferred = $q.defer();

        $http({
          method: 'get',
          url: url
        })
        .success(function (tweets) {
          deferred.resolve(tweets.statuses);
        })
        .error(function (error) {
          console.log(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
    };
  }]);