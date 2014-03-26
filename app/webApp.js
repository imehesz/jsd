var webApp = angular.module("webApp",[]);

webApp.controller("AppController", function($scope){
  // angular goodness will come here ...
  $scope.lessons = [];
  $scope.activeLesson = null;
  $scope.lessonNotFound = "";
  
  if (typeof JSD != "undefined") {
    $scope.lessons = JSD.lessons;
  }
  
  $scope.loadLesson = function(lName) {
    console.log("lName", lName);
    var lesson = _.find($scope.lessons,function(rw){ return rw.name == lName });
    if (lesson) {
      $scope.activeLesson = lesson;
    } else {
      $scope.lessonNotFound = "Lesson Not Found :/";
    }
  }
});