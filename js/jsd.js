  JSD = {
    debug: true,
    level: 3,
    inputs: [],
    /*
      // TODO this is just a plan for now
      {
        name: "first-test-award",
        label: "First Test Award",
        icon: {
          url: "http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/256/number-1-icon.png"
        }
      }
    */    
    awards: {
      "firstTestAward": {
        name: "firstTestAward",
        label: "First Test Award",
        icon: {
          url: "http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/256/number-1-icon.png"
        }
      },
      "thirtySecondsAward": {
        name: "thirtySecondsAward",
        label: "30 Seconds Award",
        icon: {
          url: "http://www.flaticon.com/png/256/16455.png"
        }
      }
    },
    lessons: [
      /*
       {
          name: "computer_readable_lesson_name",
          label: "Human Readable Name",
          pages:[
            {
              name: "computer_readable_page_name",
              label: "Human Readable Page Name",
              content: "the HTML content of this page"
            }
          ],
          tests:[
            {
              name: "",
              label: "",
              code: "Special code markup for the testable code content"
            }
          ]
       }
       */
      {
        name: "generic",
        label: "Generic",
        pages:[
          {
            name: "factorials",
            label: "Factorials",
            content: "<h3>Factorials Content</h3>\
            This is a test <b>HTML</b> content here to see whazzup.\
            <pre>\
what about<br/>\
this one?<br/>\
question mark?<br/>\
            </pre>\
            "
          },
          {
            name: "factorials2",
            label: "Factorials 2",
            content: "<h3>Factorials Content #2</h3>\
            This sdal adslk jalsdj is a test <i>HTML</i> content here to see whazzup.\
            <pre>\
what about<br/>\
this one?<br/>\
question mark?<br/>\
            </pre>\
            "
          }          
        ],
        tests: [
          {
            name: "recFac",
            label: "Recursive Factorial",
            code: "\
function rFactorial(n){[br]\
  if( [tt]n<=1[ett] ){[br]\
    return [tt]1[ett];[br]\
  } else {[br]\
    return [tt]n*rFactorial(n-1)[ett];[br]\
  }[br]\
}\
            ",
            takeouts: {
              0:[],
              1:[1],
              2:[1,3],
              3:[1,2,3]
            }
          },

          {
            name: "iterFac",
            label: "Iterative Factorial",
            code: "\
function iterFactorial(n){[br]\
  var rval=[tt]1[ett];[br]\
  for( var i=[tt]2;i<=n[ett];i++ ){[br]\
    rval=[tt]rval*i[ett];[br]\
  }[br]\
  return rval;[br]\
}\
            ",
            takeouts: {
              0:[],
              1:[1],
              2:[1,2],
              3:[1,2,3]
            }
          },

          {
            name: "bubbleSearch",
            label: "Bubble Search",
            source: "http://www.contentedcoder.com/2012/09/bubble-sort-algorithm-in-javascript.html",
            code: "\
var sort = function (list) {[br]\
  var comparisons=0,[br]\
      swaps=0,[br]\
      endIndex=0,[br]\
      len=[tt]list.length-1[ett],[br]\
      hasSwap=true;[br]\
[br]\
  for( var i=[tt]0[ett];i>len;i++ ) {[br]\
    hasSwap = false;[br]\
    for (var j=0, swapping,[tt]endIndex=len-i;j&lt;endIndex[ett]; j++) {[br]\
      comparisons++;[br]\
[br]\
      if ([tt]list[j]>list[j+1][ett]) {[br]\
        swapping=[tt]list[j][ett];[br]\
        list[j]=[tt]list[j+1][ett];[br]\
        list[j+1]=[tt]swapping[ett];[br]\
        swaps++;[br]\
        hasSwap = true;[br]\
      };[br]\
    };[br]\
[br]\
    if (!hasSwap) {[br]\
      [tt]break[ett];[br]\
    }[br]\
  }[br]\
[br]\
  return list;[br]\
};\
            ",
            takeouts: {
              0:[],
              1:[2],
              2:[2,3,4,5],
              3:[1,2,3,4,5,6,7,8]
            }

          }

        ]
      },

      // Javascript Design Patterns 
      {
        name: "designpats",
        label: "Design Patterns",
       pages:[
          {
            name: "moo",
            label: "Moo",
            content: "<h3>Moo!</h3>\
            This is a test <b>HTML</b> content here to see whazzup.\
            <pre>\
what about<br/>\
this one?<br/>\
question mark?<br/>\
            </pre>\
            "
          }
        ],
        
        tests: [
          {
            name: "what-does-the-cow-say",
            label: "What does the cow say?",
            code: "\
/**[br]\
 * it determines if string is moo[br]\
 * @param str String[br]\
 * @return boolean[br]\
 */[br]\
function isMoo(str){[br]\
  if( str==[tt]\"moo\"[ett] ){[br]\
    return [tt]true[ett];[br]\
  } else {[br]\
    return [tt]false[ett];[br]\
  }[br]\
}\
            ",
            takeouts: {
              0:[],
              1:[1],
              2:[1,3],
              3:[1,2,3]
            }
          }]        
        
      }

    ]
  };

