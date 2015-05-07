var screenWidth = window.innerWidth || document.body.clientWidth;
var screenHeight = (window.innerHeight || document.body.clientHeight) - 40;

// Variables invovled with inbox section
var numOfMsg = 8;
var messageX = (3/16)*screenWidth;
var messageY = 0;
var messageWidth = 0.70*screenWidth; 
var messageHeight = (screenHeight/numOfMsg)-5;
var simpleTextPaddingX = 15;
var simpleTextPaddingY = 30;

// Svg holder used 
var svg;

// Different Panels
var changeDisplayPanel;
var messageViewerPanel;


// Elements within panels
var messageList;

// The email - the data
var data;

// variable used in case of no unread emails.
var noUnread = false;

function simpleDisplay(svgArg){
  svg = svgArg;
  messageViewerPanel = svg.append("g")
                      .attr("x", 0)
                      .attr("y", 0)
                      .attr("width", (screenWidth-8))
                      .attr("height", screenHeight);

  changeDisplayPanel = svg.append("g")
                 .attr("x", 0)
                 .attr("y", 0)
                 .attr("width", (screenWidth-8))
                 .attr("height", screenHeight)
  
  addToChangeDisplayPanel();
  importEmail();
}

// Only used when changing modes
function importEmail(){  
  // Emails in a dataset, in future will load this in from another file
  data = importSingleEmail();
  if(data == null){
    noUnread = true;
  }
  setMessageViewerPanel();
}

/** Adds elements to the change display panel */
function addToChangeDisplayPanel(){
  console.log("adding to Modes in simple");
  // Different modes avaliable
  var modesdata = ["Expand"];

  // First clear the changeDisplayPanel before repainting over it
  changeDisplayPanel.selectAll("*")
                    .remove();

  var modes = changeDisplayPanel.append("g")
                       .attr("x", 60)
                       .attr("y", function(d, i){
                        return 330 + (i *50);
                       })
                       .attr("width", (messageX-40))
                       .attr("height", 40)
                       .on("click", function(d){
                          return changeDisplay("Expand");
                       });

  modes.append("rect")
       .attr("x", 0)
       .attr("y", function(d, i){
        return 295 + (i*60);
       })
       .attr("width", (messageX-40))
       .attr("height", 45)
       .attr("fill", "rgb(50,50,50)");

  modes.append("text")
       .attr("x", 50)
       .attr("y", function(d, i){
        return 330 + (i*60);
       })
       .attr("width", (messageX-60))
       .attr("height", 40)
       .attr("font-family", "century gothic")
       .attr("font-size", "37px")
       .attr("fill", "white")
       .text("Expand");
  displayUnread();
  console.log("Bottom of addToChangeDisplayPanel");

}

function displayUnread(){
  console.log("changing no. unread");
  changeDisplayPanel.append("text")
           .attr("x", 25)
           .attr("y", 400)
           .attr("font-family", "century gothic")
           .attr("font-size", "37px")
           .attr("fill", "white")
           .text(getNumberUnread() + " unread");
}

function setMessageViewerPanel(){
    // The scroll down button
    // Had to svg, using inbox altered the user interaction incorrectly.
    // Also, the arrows are permanant so having them in svg is a good thing.

    svg.append("rect")
          .attr("x", screenWidth - 100)
          .attr("y", function(d, i){
             return 40;
          })
          .attr("width", messageHeight - 20)
          .attr("height", screenHeight - 80)
          .attr("fill", "rgb(40, 40, 40)")
          .on("click", function(){
            var nextEmail = getNextEmail();
            if(nextEmail != null){
              messageViewerPanel.selectAll("*")
                                .remove();
              data = nextEmail;
            }
            else{
              messageViewerPanel.selectAll("*")
                                .remove();
              noUnread = true;
            }
            addToChangeDisplayPanel();
            setMessageViewerPanel();
          });

  if(noUnread == false){
        // Display of sender details
        messageViewerPanel.append("text")
                      .attr("x", messageX + simpleTextPaddingX)
                      .attr("y", 100)
                      .attr("font-family", "century gothic")
                      .attr("font-size", "45px")
                      .attr("fill", "white")
                      .text(function(){
                          return "from: " + data.communicator;
                      });

        // Display recieved date and time
        messageViewerPanel.append("text")
                      .attr("x", messageX + simpleTextPaddingX)
                      .attr("y", 160)
                      .attr("font-family", "century gothic")
                      .attr("font-size", "45px")
                      .attr("fill", "white")
                      .text(function(){
                          return "recieved: " + data.time + " on " + data.date;
                      });

        // Display of actual message
        messageViewerPanel.append("text")
                      .attr("x", 0) // Should not be a number
                      .attr("y", 0)
                      .attr("font-family", "century gothic")
                      .attr("font-size", "100px")
                      .attr("fill", "white")
                      .call(wrap, data.message, (messageWidth - (simpleTextPaddingX*2)), 120)
                      .attr("transform", "translate(" + (messageX+ simpleTextPaddingX) + ", " + 160 + ")");
  }
  else{
        // Display text saying no unread messages
        messageViewerPanel.append("text")
                      .attr("x", messageX+ simpleTextPaddingX) // Should not be a number
                      .attr("y", 380)
                      .attr("font-family", "century gothic")
                      .attr("font-size", "80px")
                      .attr("fill", "white")
                      .text("No unread messages right now.") 
  }
}

/** function wraps text so that it fits on the screen in a certain area (enters linebreaks if needed). */
function wrap(selected, message, width, lineHeight) {
    var text = selected; // This is the text element holding the tspan elements
    var words = message.split(/\s+/).reverse();
    var line = []; // This is the line that will hold the current line being added to
    var lineNumber = 0; // Needed for calculating how many lines needed to go down

    // Y starts at lineHeight so the first line of text is on screen 
    var tspan = text.append("tspan").attr("x", 0).attr("y", lineHeight).attr("dy", 0);

  while(word = words.pop()){
    line.push(word);
    tspan.text(line.join(" ")); //joins the elements in the array line together, place " " where needed
                  //then assigning that line to the selected tspan element.
    if(tspan.node().getComputedTextLength() > width){ // If the line is bigger than the width
      line.pop(); // Get rid of the last element from the line
      tspan.text(line.join(" ")); // Assign tspan the line without that last element
      line = [word]; // Now start a new line with the word that was popped.
      tspan = text.append("tspan").attr("x", 0).attr("y", lineHeight).attr("dy", ++lineNumber*lineHeight).text(word); 
      // For above statement, now make a new tspan element, assign it to text, change dy value accordingly, and add word (in case thats all there is)
    }
  }    
}