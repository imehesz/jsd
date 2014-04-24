var webApp = angular.module("webApp",["hljs"]);

webApp.directive("webappTestsDirective", function($sce,$compile,$timeout,awardFactory){
  return {
    restrict: "C",
    replace: true,
    template: '<div>\
                  <h3>{{ngTests[activeTestNum].label}}</h3>\
                    <div ng-bind-html="parsedCode"></div>\
                    <button ng-click="solve()">Solve</button>\
                    <div ng-show="ngTests.length>0">\
                      <!-- <button type="button" ng-click="prevTest()" ng-disabled="activeTestNum==0"><< Prev</button> -->\
                      <button type="button" ng-click="nextTest()" ng-disabled="activeTestNum==ngTests.length-1||!isSolved">Next</button>\
                      <button type="button" ng-click="restartTest()" ng-disabled="!isSolved">Redo</button>\
                      <button type="button" ng-click="openTests=false">Close Tests</button>\
                    </div>\
              </div>',
    link: function(scope,element) {
      scope.activeTestNum = 0;
      scope.activeTestContent = "";
      scope.isSolved = false;
      scope.ngTests = scope.lesson.tests;
      
      var goodAnswers = [];
      var points = 0;
      var percent = 0;
      
      scope.$watch("openTests", function(nVal,oVal) {
        if (oVal !== nVal) {
          if (nVal) scope.timer.start();
          else scope.timer.stop();
        }
      });
      
      scope.$watch("userLevel", function(){
        parseTest();
      });
      
      // highlighting each test code (TODO look for another way, or at least only run highlight within the lesson)
      var someFn = function() {
        $(element).find("pre code").each(function(i,e){
          hljs.highlightBlock(e);
        });
      }
      
      var parseTest = function() {
        var rawCode = "";
        var currentTest = $.isPlainObject(scope.ngTests[scope.activeTestNum]) ? scope.ngTests[scope.activeTestNum] : null;
        goodAnswers = [];

        if (currentTest) {
          rawCode = currentTest.code;
          rawCode = rawCode.replace(/\[br\]/g,'<br>');
        
         // parse questions
          var takeouts = currentTest.takeouts[scope.userLevel];
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
        scope.parsedCode = $sce.trustAsHtml("<pre><code>" + rawCode.replace(/\[tt\]/g,"").replace(/\[ett\]/g,"") + "</code></pre>");
        setTimeout(someFn, 0);
      }

      scope.$watch("activeTestNum", function(o,n) {
        if ( o !== n) { parseTest(); }
      });
  
      scope.nextTest = function() {
        if (scope.ngTests) {
          scope.isSolved = false;
          if (scope.activeTestNum != scope.ngTests.length) scope.activeTestNum++;
          // scope.userPoints.currentTestPercent = 0;
        }
        
        awardFactory.addAward(JSD.awards.firstTestAward);
      }
      
      scope.restartTest = function() {
        scope.isSolved = false;
        element.find(".user-answer").removeClass("wrong").removeClass("correct").attr("disabled", false);
        parseTest();
      }
      
      scope.prevTest = function() {
        if(scope.activeTestNum > 0) scope.activeTestNum--;
      }
      
      scope.solve = function () {
        scope.isSolved = true;
        // would have been nice with dynamic models ... but ... WHATEVER
        element.find(".user-answer").each(function(i,e) {
          var userAnswer = $(e).val();
          var goodAnswer = goodAnswers[i];
          console.log("user answer #",i,$(e).val(), " vs good: ", goodAnswer, goodAnswer == userAnswer);
          $(e).attr("title", goodAnswer);
          $(e).attr("disabled", "true");
          if(goodAnswer == userAnswer) {
            $(e).addClass("correct");
            
            // looking for the lessonPointsObject on the current level
            var lessonPointsObj = _.find(scope.userPoints.lessonPoints, function(lessonObj) { return lessonObj.name == scope.activeLesson.name && lessonObj.level == scope.userLevel; });
            if (lessonPointsObj) {
              // if we got it, we just simply increase the points
              lessonPointsObj.points++;
            } else {
              // if not, we got a lotta stuff to do :/
              // 1) we have to figure out what the max points available on this level
              var maxPoints = 0;
              _.each(scope.activeLesson.tests, function(curTest, idx){
                if (curTest.takeouts[scope.userLevel]) {
                  maxPoints += curTest.takeouts[scope.userLevel].length;
                } else {
                  maxPoints += _.last(curTest.takeouts.length);
                }
              });
              
              lessonPointsObj = {
                name: scope.activeLesson.name,
                level: scope.userLevel,
                points: 1,
                maxPoints: maxPoints
              };
              
              // insert the new lessonObject
              scope.userPoints.lessonPoints.push(lessonPointsObj);
            }
            
            scope.userPoints.currentTestPercent = Math.round((lessonPointsObj.points/lessonPointsObj.maxPoints)*100);
          } else {
            $(e).addClass("wrong");
          }
        });
      }
      
      parseTest();
    }
  }
});

webApp.factory("awardFactory", function() {
  var userAwards = [];
  return {
    addAward: function(awardObj) {
      userAwards.push({
        dateTime: _.now(),
        awardObj:awardObj
      });
    },
    getAwards: function() {
      return userAwards;
    }
  }
});

webApp.controller("AppController", function($scope, $sce, awardFactory) {
  // angular goodness will come here ...
  $scope.lessons = [];
  $scope.activeLesson = null;
  $scope.activePageContent = "";
  $scope.activePageNum = 0;
  $scope.lessonNotFound = "";
  $scope.openTests = false;
  // TODO refactor user stuff to be under one object
  $scope.userAwards = awardFactory.getAwards();
  $scope.userLevel = JSD.level || 1;
  $scope.userPoints = {
    lessonPoints: [],
    currentTest: 0,
    currentTestPercent: 0
  }
  
  $scope.timer = {
    running: false,
    time: 0,
    start: function() {
      $scope.timer.timeVar = setInterval(function(){
        $scope.timer.time++;
        $scope.$apply();
      }, 1000);
    },
    stop: function() {
      clearInterval($scope.timer.timeVar);
    },
    reset: function() {
      $scope.timer.stop();
      $scope.timer.time = 0;
    }
  };
  
  $scope.$watch("timer.time", function(nVal, oVal){
    if (nVal !== oVal) {
      if (nVal == 30) {
        awardFactory.addAward(JSD.awards.thirtySecondsAward);
      }
    }
  });
  
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
    
    // looks like we have to manually pause the `timer`
    $scope.timer.stop();
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