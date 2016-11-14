var sentimentAnalysis=angular.module("starter", ["ionic","ngCordova"]);

sentimentAnalysis.factory('dataService', function() {
  var _dataObj = '';
  return {
    dataObj: _dataObj
  };
})
sentimentAnalysis.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

sentimentAnalysis.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
.state("start", {
        url: "/start",
        templateUrl: "templates/start.html",
        controller: "startController",
        cache: false
  })  
.state("input", {
        url: "/input",
        templateUrl: "templates/input.html",
        controller: "homeController"
  })     
  .state("home", {
        url: "/home",
        templateUrl: "templates/home.html",
        controller: "homeController"
  })
  .state('result', {
        url: '/result',
        templateUrl: 'templates/result.html',
        controller: 'homeController'
  })
    .state('map', {
        url: '/map',
        templateUrl: 'templates/map.html',
        controller: 'mapController'
  });
    $urlRouterProvider.otherwise('/start');
})
