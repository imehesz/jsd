var webApp = angular.module("webApp",[]);

webApp.directive("webappTestDirective", function(){
  return {
    restrict: "C",
    replace: true,
    scope:{
      ngTest: "="
    },
    template: "<div>{{ngTest.name}}</div>",
    link: function(scope,element,attr) {
      // directive logic will come here ...
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
  $scope.activeTestNum = 0;
  $scope.activeTestContent = "";
  
  if (typeof JSD != "undefined") {
    $scope.lessons = JSD.lessons;
  }
  
  $scope.loadLesson = function(lName) {
    console.log("lName", lName);
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
  
  $scope.nextTest = function() {
    if ($scope.activeLesson && $scope.activeLesson.tests) {
      if ($scope.activeTestNum != $scope.activeLesson.tests.length) $scope.activeTestNum++;
    }
  }
  
  $scope.prevTest = function() {
    if($scope.activeTestNum > 0) $scope.activeTestNum--;
  }  
});