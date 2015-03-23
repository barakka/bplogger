/* global angular */
/* global Firebase */

var bploggerApp = angular.module("bplogger", [
  "firebase",
  "ngRoute",
  "bplogger.newmeasurement",
  "bplogger.history"
]);

var ref = new Firebase("https://bplogger.firebaseio.com/");

bploggerApp.factory("measurements", ["$firebaseArray",
  function($firebaseArray) {
    return $firebaseArray(ref.child("measurements"));
  }
]);

bploggerApp.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/newmeasurement', {
        templateUrl: 'components/newmeasurement/newmeasurement.html',
        controller: 'NewmeasurementController as newmeasurement',        
    }).when('/history/:historyType', {
        templateUrl: 'components/history/history.html',
        controller: 'HistoryController as history',
//        resolve: {
//          measurements: ['$firebaseArray', function ($firebaseArray) {
//            return $firebaseArray(ref.child("measurements"));
//          }]
//        }        
    }).otherwise({
        redirectTo: '/newmeasurement'
    });
  }
]);

bploggerApp.controller('MainController', [MainController]);

function MainController() {
  
}