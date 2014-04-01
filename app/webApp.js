var webApp = angular.module("webApp",["hljs"]);

webApp.directive("webappTestsDirective", function($sce,$compile,$timeout){
  return {
    restrict: "C",
    replace: true,
    scope:{
      ngTests: "=",
      openTests: "="
    },
    template: '<div>\
                  <h3>{{ngTests[activeTestNum].label}}</h3>\
                    <div ng-bind-html="parsedCode"></div>\
                    <div ng-show="ngTests.length>1">\
                      <pre><code>var d=5;</code></pre>\
                      <button type="button" ng-click="prevTest()" ng-disabled="activeTestNum==0"><< Prev</button>\
                      <button type="button" ng-click="nextTest()" ng-disabled="activeTestNum==ngTests.length-1">>> Next</button>\
                      <button type="button" ng-click="openTests=false">Close Tests</button>\
                    </div>\
              </div>',
    link: function(scope,element,attr) {
      scope.activeTestNum = 0;
      scope.activeTestContent = "";
      
      // highlighting each test code (TODO look for another way, or at least only run highlight within the lesson)
      var someFn = function() {
        $(element).find("pre code").each(function(i,e){
          hljs.highlightBlock(e);
        });
      }
      
      var parseTest = function() {
        var rawCode = "";
        rawCode = typeof scope.ngTests != "undefined" ? scope.ngTests[scope.activeTestNum].code : "";
          
        if (rawCode) {
          rawCode = rawCode.replace(/\[br\]/g,'<br>');
        }
        scope.parsedCode = $sce.trustAsHtml( "<pre><code>" + rawCode + "</code></pre>");
        setTimeout(someFn, 0);
      }

      scope.$watch("activeTestNum", function(o,n) {
        if ( o !== n) { parseTest(); }
      });
  
      scope.nextTest = function() {
        if (scope.ngTests) {
          if (scope.activeTestNum != scope.ngTests.length) scope.activeTestNum++;
        }
      }
      
      scope.prevTest = function() {
        if(scope.activeTestNum > 0) scope.activeTestNum--;
      }
      
      parseTest();
    }
  }
});

webApp.controller("AppController", function($scope, $sce){
  // angular goodness will come here ...
  $scope.lessons = [];
  $scope.activeLesson = null;
  $scope.activePageContent = "";
  $scope.activePageNum = 0;
  $scope.lessonNotFound = "";
  
  if (typeof JSD != "undefined") {
    $scope.lessons = JSD.lessons;
  }
  
  $scope.loadLesson = function(lName) {
    $scope.activePageNum = 0;
    var lesson = _.find($scope.lessons,function(rw){ return rw.name == lName });
    if (lesson) {
      $scope.activeLesson = lesson;
      setActivePageContent();
    } else {
      $scope.lessonNotFound = "Lesson Not Found :/";
    }
  }
  
  $scope.nextPage = function() {
    if ($scope.activeLesson && $scope.activeLesson.pages) {
      if ($scope.activePageNum != $scope.activeLesson.pages.length) $scope.activePageNum++;
      setActivePageContent();
    }
  }
  
  $scope.prevPage = function() {
    if($scope.activePageNum > 0) $scope.activePageNum--;
    setActivePageContent();
  }
  
  var setActivePageContent = function() {
    $scope.activePageContent = "";
    
    if ($scope.activeLesson && $scope.activeLesson.pages && $scope.activeLesson.pages[$scope.activePageNum].content) {
      $scope.activePageContent = $sce.trustAsHtml($scope.activeLesson.pages[$scope.activePageNum].content);
    }
  }
});