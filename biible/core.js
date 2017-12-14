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

app.controller("mainController", function ($scope, $http, $location, $sce) {


    // Progress variable
    $scope.progress = 0;
    // thr result
    $scope.result = null;

    $scope.checked = false;

    $scope.getSize = function () {
        if ($scope.englishChapter != null) return new Array($scope.englishChapter.size)
        return new Array(0);
    }

    var jpnver = getParameterByName('jpnver');
    if (!jpnver && typeof JPNVER !== 'undefined') jpnver = JPNVER;
    var engver = getParameterByName('engver');
    if (!engver && typeof ENGVER !== 'undefined') engver = ENGVER;
    var book = getParameterByName('book');
    var chapter = getParameterByName('chapter');
    var isFurigana = getParameterByName('furigana');

    $scope.getChapter = function (book, chapter) {
        if (!book || !chapter) {
            book = 'john';
            chapter = 3;
        }
        if (!jpnver) {
            jpnver = 'jpn';
        }
        if (!engver) {
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
            .success(function (japaneseChapter) {
                if(isFurigana) {
                    $http.get('kanji.json').success(function (kanjiData) {
                        $scope.kanjiData = kanjiData;
                        for (var i = 1; i <= japaneseChapter.size; i++) {
                            var kanjiVerse = japaneseChapter.verses[i].replace(/[\u4e00-\u9faf\u3400-\u4dbf]+/g, function (str) {
                                if (str) return '<ruby>' + str + '<rt>' + kanjiData[str] + '</rt></ruby>';
                            });
                            japaneseChapter.verses[i] = kanjiVerse;
                        }
                        $scope.japaneseChapter = japaneseChapter;
                    })
                } else {
                    $scope.japaneseChapter = japaneseChapter;
                }
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }

    $scope.goNext = function () {
        window.scrollTo(0, 0);
        $scope.getChapter($scope.nextPage[0], $scope.nextPage[1]);
    }

    $scope.goPrev = function () {
        window.scrollTo(0, 0);
        $scope.getChapter($scope.prevPage[0], $scope.prevPage[1]);
    }

    $scope.goTo = function (book, chapter) {
        window.scrollTo(0, 0);
        $scope.getChapter(book, chapter);
        $scope.toggle();
    }

    $scope.toggle = function () {
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

app.filter('trustAsHtml', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);