var app = angular.module('myApp', ['tweetsService']);

app.controller('MainController', ['$scope', '$interval', '$sce', '$window', 'tweetsService', function ($scope, $interval, $sce, $window, tweetsService) {
  $scope.searching = false;
  $scope.showBanned = false;
  $scope.banned = '';

  // css according url param
  var cssName = $window.location.href.split('/#/')[1];

  if (cssName)
    document.getElementById('mainCss').href = 'css/' + cssName + '.css';

  // function helper to format data as follow: yyyy-mm-dd || should i use a time library ?
  function formatDate (date) {
    var year, month, day;

    year = date.getFullYear();
    month = date.getMonth() + 1;
    if (month < 10)
      month = '0' + month;
    day = date.getDate();
    if (date < 10)
      date = '0' + date;

    return year + '-' + month + '-' + day;
  }

  // treating tweet function
  function treatTweets (tweets) {
    var date, when, colors, delta, n;

    tweets.forEach(function (tweet, i) {
      n = 0;
      date = new Date(tweet.created_at);
      tweet.freshness = new Date().getTime() - date.getTime();
      delta = tweet.freshness / 1000;

      // format date in a 'x minutes ago' style
      when = Math.ceil(delta / 60);
      tweet.when = $sce.trustAsHtml('Il y a <strong>' + when + '</strong> minute' + (when > 1 ? 's' : '') + '.');

      // accept html in text
      tweet.text = tweet.text.replace(/(http[s]?:\/\/t.co\/[0-9a-zA-Z]{10})/g, '<a target="_blank" href="$1">$1</a>');
      tweet.text = $sce.trustAsHtml(tweet.text);

      // tweet bgcolor
      if (config.deleteOldTweets)
        tweet.bgcolor = 'hsla(' + parseInt(120 - 120 / 20 * when) + ', 100%, 50%, 0.7)';
      else
        // need estimate correct bgcolor
        tweet.bgcolor = 'hsla(' + parseInt(120 - 120 / 100 * when) + ', 100%, 50%, 0.7)';

      // delete tweet from current streamer ---- TEMP: nameCSS?, ['KayaneFR', 'Sparadrap'], exclude list ?
      var banned = $scope.banned.split(' ');

      banned.forEach(function (name) {
        if (tweet.user.screen_name === name)
          delete tweets[i];
      });

      if (config.deleteOldTweets) {
        // delete tweet if older than config.sinceXSeconds
        date.setMinutes(date.getMinutes() + config.sinceXSeconds / 60);
        tweet.howManyDeltas = 1;

        if (date < new Date()) {
          delete tweets[i];
        }
      }
      else {
        // check how much config.sinceXSeconds has passed and store it in the tweet object
        delta = Math.floor(delta);
        while (delta > 0) {
          delta -= config.sinceXSeconds;
          n++;
        }
        tweet.howManyDeltas = n;
      }
    });

    return _.compact(tweets);
  }

  function sortTweets (tweets) {
    return _.sortBy(tweets, function (o) {
      var weight = o.freshness / 100000 + (o.retweet_count * -5) / o.howManyDeltas + (o.favorite_count * -1) / config.favoriteWeight;
      return weight;
    });
  }

  function searchTweets () {
    console.log('searching ' + $scope.query + '...');
    tweetsService.search($scope.query, 'since:' + formatDate(new Date())).then(function (tweets) {
      // delete older than `config.sinceXSeconds` tweets
      // sort them by prevalence
      // format date
      // add a color for tweet background according time elapsed
      tweets = sortTweets(treatTweets(tweets));

      $scope.tweets = tweets;
    }, function (error) { console.error(error);});
  }

  $scope.search = function () {
    $scope.searching = true;
    searchTweets();

    // repeat operation every config.searchInterval seconds
    $scope.interval = $interval(function () {
      searchTweets();
    }, config.searchInterval * 1000);
  };

  $scope.stopSearch = function () {
    $interval.cancel($scope.interval);
    $scope.searching = false;
  };

}]);