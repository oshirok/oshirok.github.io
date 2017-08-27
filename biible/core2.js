// public/core.js
var app = angular.module('test', ["pageslide-directive", 'ui.bootstrap']);

app.controller("mainController",function($scope,$http,$location){

  // Progress variable
  $scope.progress = 0;
  // thr result
  $scope.result = null;

  $scope.checked = false;

  $scope.getSize = function() {
      if($scope.englishChapter != null) return new Array($scope.englishChapter.size)
      return new Array(0);   
  }

  var book = $location.search().book;
  var chapter = $location.search().chapter;

  $scope.getChapter = function(book, chapter) {
    if(!book || !chapter) {
      book = 'john';
      chapter = 3;
    }
    $http.get('eng/' + book + '/' + chapter + '.json')
              .success(function (data) {
                      $scope.englishChapter = data;

                      var next = $scope.englishChapter.next;
                      // index2.html#?book=john&chapter=3
                      $scope.nextPage = next.split(",");

                      var prev = $scope.englishChapter.prev;
                      $scope.prevPage = prev.split(",");
                      
                  })
              .error(function (data) {
                      console.log('Error: ' + data);
                  });

    $http.get('jpnsky/' + book + '/' + chapter + '.json')
              .success(function (data) {
                      $scope.japaneseChapter = data;
                  })
              .error(function (data) {
                      console.log('Error: ' + data);
                  });
  }

  $scope.goNext = function() {
    $scope.getChapter($scope.nextPage[0], $scope.nextPage[1]);
  }

  $scope.goPrev = function() {
    $scope.getChapter($scope.prevPage[0], $scope.prevPage[1]);
  }

  $scope.goTo = function(book, chapter) {
    $scope.getChapter(book, chapter);
    $scope.toggle();
  }

  $scope.toggle = function(){
      $scope.checked = !$scope.checked
  }

  $scope.getChapter(book, chapter);

  $http.get('menu.json')
              .success(function (data) {
                      $scope.menu = data;
                  })
              .error(function (data) {
                      console.log('Error: ' + data);
                  });

});