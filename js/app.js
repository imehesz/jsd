(function($){

  if( typeof(JSD) == 'undefined' ) {
    alert("Oops, JSD missing!");
    return;
  }

  function loadLesson( lessonID, pageID ){
    var result = $.grep(JSD.lessons, function(lesson){ return lesson.name == lessonID; });
    if( result[0] ){
      var lesson = result[0];
      if( !pageID ){
        pageID = 0;
      }
      updatePageMiddle( lesson.pages[pageID].content );
    }
  } 

  function updatePageMiddle( str, append ){
    $("#zen-intro").hide();
    if( append ){
      $("#page-middle").append(str);
    } else {
      $("#page-middle").html(str);
    }
  }

  var lessons=JSD.lessons;
  var t=lessons[0].tests[0];
  var $testCode = $('.test-code');
  var code = t.code;
  var goodCode = code.replace(/\[tt\]|\[ett\]/g,"");
  var goodCodeShow = goodCode.replace(/\[br\]/g,"\r");
  goodCode = goodCode.replace(/\[br\]/g,"");

  $(".test-name").html( t.label );
  $(".good-code").html( goodCodeShow );

  $testCode.html(code);

  // parse questions
  var takeouts = t.takeouts[JSD.level];
  $.each(takeouts, function(i,pos){
    // had to add an empty tt-ett to keep track of the number of fields, so we can successfully use the Nth Match tool!
    JSD.inputs.push({index:pos, textField:"<input class=\"input-code-test\" id=\"solution-"+pos+"\" type=\"text\"/><span class=\"hidden\"></span>[tt][ett]"});
  });

  Rainbow.color();

  $testCode.html( $testCode.html().replace(/\[br\]/g,'<br>') );  

  $.each(JSD.inputs, function(i,input){
    $testCode.html( replaceNthMatch( $testCode.html(),/(\[tt\].*?\[ett\])/,input.index, input.textField) );  
  });

  // lessons menu stuff
  var classLinkTemplate = $("#class-links").html();
  var classLinksOut = "";
  $.each(lessons, function(i,lesson){
    classLinksOut += classLinkTemplate.replace("{{classID}}",lesson.name).replace("{{className}}",lesson.label);
  });
  $("#class-links-container").html(classLinksOut);

  $testCode.html( $testCode.html().replace(/\[tt\]|\[ett\]/g,"") );  

  $(".load-class").on("click", function(e){
    //console.log(e.currentTarget.id);
    loadLesson(e.currentTarget.id);
  });

  $('#checkCode').on('click', function(){
    var goodCodeText = $('<div/>').html(goodCode).text();
    var testCodeText = $testCode.text();

    if( goodCodeText != testCodeText ) {
      $(".good-code").removeClass("hidden");
      alert( "Meek! WRONG! Try again!" );
    } else {
      alert( "YAAAY! Good JOB!" );
    }
  });

  $(document).on( "keyup", ".input-code-test", function(e){
    $el = $(e.currentTarget);
    $(e.currentTarget.nextSibling).text( $el.val() );
  });

})(jQuery);
