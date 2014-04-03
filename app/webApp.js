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
                    <button ng-click="solve()">Solve</button>\
                    <div ng-show="ngTests.length>0">\
                      <button type="button" ng-click="prevTest()" ng-disabled="activeTestNum==0"><< Prev</button>\
                      <button type="button" ng-click="nextTest()" ng-disabled="activeTestNum==ngTests.length-1">>> Next</button>\
                      <button type="button" ng-click="openTests=false">Close Tests</button>\
                    </div>\
              </div>',
    link: function(scope,element,attr) {
      scope.activeTestNum = 0;
      scope.activeTestContent = "";
      var goodAnswers = [];
      
      // highlighting each test code (TODO look for another way, or at least only run highlight within the lesson)
      var someFn = function() {
        $(element).find("pre code").each(function(i,e){
          hljs.highlightBlock(e);
        });
      }
      
      var parseTest = function() {
        var rawCode = "";
        var currentTest = $.isPlainObject(scope.ngTests[scope.activeTestNum]) ? scope.ngTests[scope.activeTestNum] : null;

        if (currentTest) {
          rawCode = currentTest.code;
          rawCode = rawCode.replace(/\[br\]/g,'<br>');
        
         // parse questions
          var takeouts = currentTest.takeouts[JSD.level];
          var inputs = [];
          
          $.each(takeouts, function(i,pos){
            // had to add an empty tt-ett to keep track of the number of fields, so we can successfully use the Nth Match tool!
            inputs.push({index:pos, textField:"<input ng-model=\"answers[" + pos + "]\" class=\"input-code-test user-answer\" id=\"" + currentTest.name + "-answer-"+pos+"\" type=\"text\"/><span class=\"hidden\"></span>[tt][ett]"});
          });
          $.each(inputs, function(i,input){
            var regPat = /(\[tt\].*?\[ett\])/;
            
            goodAnswers.push(returnNthMatch(rawCode,regPat,input.index).replace("[tt]","").replace("[ett]",""));
            rawCode = replaceNthMatch( rawCode,regPat,input.index, input.textField);
          });
        }
        scope.parsedCode = $sce.trustAsHtml("<pre><code>" + rawCode + "</code></pre>");
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
      
      scope.solve = function () {
        // would have been nice with dynamic models ... but ... WHATEVER
        element.find(".user-answer").each(function(i,e){
          var userAnswer = $(e).val();
          console.log("user answer #",i,$(e).val(), goodAnswers[i] == userAnswer);
        });
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