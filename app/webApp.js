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
                    <div ng-bind-html="parsedCode">{{parsedCode}}</div>\
                    <div ng-show="ngTests.length>1">\
                      <pre><code>var d=5;</code></pre>\
                      <button type="button" ng-click="prevTest()" ng-disabled="activeTestNum==0"><< Prev</button>\
                      <button type="button" ng-click="nextTest()" ng-disabled="activeTestNum==ngTests.length-1">>> Next</button>\
                      <button type="button" ng-click="openTests=false">Close Tests</button>\
                    </div>\
              </div>',
    compile: function compile(tElement, tAttrs, transclude) {
        console.log("running once ...");
            
        var someFn = function() {
          $("pre code").each(function(i,e){
            hljs.highlightBlock(e);
          });
        }
        var t = setTimeout(someFn, 0);
        
        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {
            scope.parsedCode =  $sce.trustAsHtml("<pre><code>var d=25;</code></pre>");
          },
          post: function postLink(scope, iElement, iAttrs, controller) {
            console.log("post");
          }
        }
        // or
        // return function postLink( ... ) { ... }
    },
    link: function(scope,element,attr) {
      console.log("im not running anymore :/");
      scope.activeTestNum = 0;
      scope.activeTestContent = "";      
      // directive logic will come here ...
      
      scope.$watch("activeTestNum", function(o,n){
        var rawCode = "";
        rawCode = typeof scope.ngTests != "undefined" ? scope.ngTests[scope.activeTestNum].code : "";
        
        if (rawCode) {
          rawCode = rawCode.replace(/\[br\]/g,'<br>');
        }
        //scope.parsedCode = $sce.trustAsHtml( "<pre hljs>" + rawCode + "</pre>");
        scope.parsedCode = $sce.trustAsHtml('<pre hljs>var d=20;</pre>');
        // $compile(scope.parsedCode)(scope);
      });
  
      scope.nextTest = function() {
        if (scope.ngTests) {
          if (scope.activeTestNum != scope.ngTests.length) scope.activeTestNum++;
        }
      }
      
      scope.prevTest = function() {
        if(scope.activeTestNum > 0) scope.activeTestNum--;
      }
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