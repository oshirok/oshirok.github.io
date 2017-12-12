// public/core.js
var app = angular.module('test', ["pageslide-directive", 'ui.bootstrap']);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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

  var jpnver = getParameterByName('jpnver');
  if(!jpnver && typeof JPNVER !== 'undefined') jpnver = JPNVER;
  var engver = getParameterByName('engver');
  if(!engver && typeof ENGVER !== 'undefined') engver = ENGVER;
  var book = getParameterByName('book');
  var chapter = getParameterByName('chapter');

  $scope.getChapter = function(book, chapter) {
    if(!book || !chapter) {
      book = 'john';
      chapter = 3;
    }
    if(!jpnver) {
      jpnver = 'jpn';
    }
    if(!engver) {
      engver = 'eng';
    }
    $http.get(engver + '/' + book + '/' + chapter + '.json')
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

    $http.get(jpnver + '/' + book + '/' + chapter + '.json')
              .success(function (data) {
                      $scope.japaneseChapter = data;
                  })
              .error(function (data) {
                      console.log('Error: ' + data);
                  });
  }

  $scope.goNext = function() {
    window.scrollTo(0, 0);
    $scope.getChapter($scope.nextPage[0], $scope.nextPage[1]);
  }

  $scope.goPrev = function() {
    window.scrollTo(0, 0);
    $scope.getChapter($scope.prevPage[0], $scope.prevPage[1]);
  }

  $scope.goTo = function(book, chapter) {
    window.scrollTo(0, 0);
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