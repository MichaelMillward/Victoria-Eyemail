var screenWidth = window.innerWidth || document.body.clientWidth;
var screenHeight = (window.innerHeight || document.body.clientHeight) - 40;

// Variables invovled with Navigational Panel
var numOfMsg = 8;
var inboxMsgX = (3/16)*screenWidth;
var inboxMsgY = 0;
var inboxMsgWidth = 0.3125*screenWidth; 
var inboxMsgHeight = (screenHeight/numOfMsg)-5;
var textPaddingX = 15;
var textPaddingY = 30;
var additionalPaddingY = 40;

// Variables involved in Selected Panel
var displayMsgX = 0.5*screenWidth;
var displayMsgY = 0;
var displayMsgWidth = 0.5*screenWidth;
var displayMsgHeight = screenHeight-5;

// Svg holder used 
var svg;

// Different Panels
var modePanel;
var navigationPanel;
var selectionPanel;

// Elements within panels
var messageList;

// Emails in a dataset
var dataset;

/** First method to be called, only ever called from DrawDisplay 
    Then sets up the modePanel and calls importPage    */
function expandDisplay(svgArg){
  svg = svgArg;
  navigationPanel = svg.append("g")
                       .attr("x", 0)
                       .attr("y", 0)
                       .attr("width", (screenWidth-8))
                       .attr("height", screenHeight);

  selectionPanel = svg.append("g")
                      .attr("x", 0)
                      .attr("y", 0)
                      .attr("width", (screenWidth-8))
                      .attr("height", screenHeight);

  modePanel = svg.append("g")
                 .attr("x", 0)
                 .attr("y", 0)
                 .attr("width", (screenWidth-8))
                 .attr("height", screenHeight)
  addToModePanel();
  importPage();

}

function importPage(){  
  // Emails in a dataset, in future will load this in from another file
  dataset = importPageOfEmails();
  setNavigationPanel();
}

/** Adds elements to the Mode Panel */
function addToModePanel(){
  // Different modes avaliable
  var modesdata = ["Inbox", "Sent", "Simple"];

  // Puts the modes into containers.
  var modes = modePanel.selectAll("g")
                       .data(modesdata)
                       .enter()
                       .append("g")
                       .attr("x", 60)
                       .attr("y", function(d, i){
                        return 330 + (i *50);
                       })
                       .attr("width", (inboxMsgX-40))
                       .attr("height", 40)
                       .on("click", function(d){
                          if(d == "Simple"){
                            return changeDisplay(d);
                          }
                          navigationPanel.selectAll("*")
                                         .remove();
                          selectionPanel.selectAll("*")
                                         .remove();
                          // Now change the currentMode to what has been selected
                          setMode(d);
                          importPage();
                       });

  // Draws a light rectangle for each mode.
  modes.append("rect")
       .attr("x", 0)
       .attr("y", function(d, i){
        return 295 + (i*60);
       })
       .attr("width", (inboxMsgX-40))
       .attr("height", 45)
       .attr("fill", "rgb(50,50,50)");

  // Adds text to each rectangle.
  modes.append("text")
       .attr("x", 50)
       .attr("y", function(d, i){
        return 330 + (i*60);
       })
       .attr("width", (inboxMsgX-60))
       .attr("height", 40)
       .attr("font-family", "century gothic")
       .attr("font-size", "37px")
       .attr("fill", "white")
       .text(function(d){
        return d;
       })

}

/** Sets up the messageList in the navigation, must be seperate to addToNavigationPanel, 
    so addToNavigationPanel can be called without removing the messageList */
function setNavigationPanel(){
  // Create a container for each message
  messageList = navigationPanel.selectAll("g")
                          .data(dataset)
                          .enter()
                          .append("g")
                          .attr("x", inboxMsgX)
                          .attr("y", function(d, i){
                            return ((i+1)*(screenHeight/numOfMsg));
                          })
                          .attr("width", inboxMsgWidth)
                          .attr("height", inboxMsgHeight)
                          .on("click", function(d, i){
                              d.unread = false;
                              // Now remove what the selectionPanel currently shows
                              selectionPanel.selectAll("*")
                                            .remove();
                              // Also remove navigation panel, as now shows unread messages
                              navigationPanel.selectAll("x")
                                             .remove();
                              // Now redisplay navigational panel
                              addToNavigationPanel();
                              // Now display message
                              addToSelectionPanel(d);
                          });  

  // Starts off with displaying inbox
  addToNavigationPanel();
}


/** Add the elements to the navigational panel */
function  addToNavigationPanel(){  
  // Rectangles which are binded to the containers
  messageList.append("rect")
          .attr("x", inboxMsgX)
          .attr("y", function(d, i){
             return ((i+1)*(screenHeight/numOfMsg));
          })
          .attr("width", inboxMsgWidth)
          .attr("height", inboxMsgHeight)
          .attr("fill", "rgb(25, 25, 25)");

  // Text which is featured over corresponding rectangle, which is a shortened version of email.
  messageList.append("text")
     .attr("x", inboxMsgX + textPaddingX)
        .attr("y", function(d, i){
          return ((i+1)*(screenHeight/numOfMsg)+textPaddingY+additionalPaddingY);
        })
        .attr("font-family", "century gothic")
        .attr("fill", "white")
        .attr("font-size", "45px")
        .attr("font-weight", function(d){
          if(d.unread){
            return "bold";
          }
        })
        .text(function(d){
          // text function shortens email length so it fits on the page
           var count = 0;
           var communicatorsEmail = d.communicator.split("").reverse();
           var printedEmail = [];
           // Only allows 14 letters of the email in the print.
           for(count; count<14; count++){
              printedEmail.push(communicatorsEmail.pop());
           }
           printedEmail = printedEmail.join("");
           return printedEmail + "...";
        });

  // Text which is featured over corresponding rectangle, which is current date
  // Eventually if it is current day should feature time
  messageList.append("text")
     .attr("x", displayMsgX - 140)
        .attr("y", function(d, i){
          return ((i+1)*(screenHeight/numOfMsg)+textPaddingY+additionalPaddingY);
        })
        .attr("font-family", "century gothic")
        .attr("font-size", "45px")
        .attr("fill", "white")
        .attr("font-weight", function(d){
          if(d.unread){
            return "bold";
          }
        })
        .text(function(d){
          // text function shortens email length so it fits on the page
           var count = 0;
           var messageDate = d.date.split("").reverse();
           var printedDate = [];
           for(count; count<5; count++){
              printedDate.push(messageDate.pop());
           }
           return printedDate.join("");
        });

    // The scroll up button
    // Had to svg, using inbox altered the user interaction incorrectly.
    svg.append("rect")
          .attr("x", inboxMsgX)
          .attr("y", inboxMsgHeight/2)
          .attr("width", inboxMsgWidth)
          .attr("height", inboxMsgHeight/2)
          .attr("fill", "rgb(40, 40, 40)")
          .on("click", function(){
            // go to previous set of messages.
            var prevPage = getPrevPage();
            if(prevPage != null){
              // Removes everything from navigationPanel
              navigationPanel.selectAll("*")
                             .remove();
              dataset = prevPage;
              setNavigationPanel();
            }
          });

    // The scroll down button
    // Had to svg, using inbox altered the user interaction incorrectly.
    // Also, the arrows are permanant so having them in svg is a good thing.
    svg.append("rect")
          .attr("x", inboxMsgX)
          .attr("y", function(d, i){
             return (7*(screenHeight/numOfMsg));
          })
          .attr("width", inboxMsgWidth)
          .attr("height", inboxMsgHeight/2)
          .attr("fill", "rgb(40, 40, 40)")
          .on("click", function(){
            var nextPage = getNextPage();
            if(nextPage != null){
              navigationPanel.selectAll("*")
                             .remove();
              dataset = nextPage;
              setNavigationPanel();
            }
          });
}

/** Adds elements to selectPanel, elements are the email itself */
function addToSelectionPanel(selectedMessage){ 
  // Display of sender details
  selectionPanel.append("text")
                .attr("x", displayMsgX + textPaddingX)
                .attr("y", 50)
                .attr("font-family", "century gothic")
                .attr("font-size", "40px")
                .attr("fill", "white")
                .text(function(){
                  if(getCurrentMode() == "Inbox"){
                    return "from: " + selectedMessage.communicator;
                  }
                  else {
                    return "to: " + selectedMessage.communicator;
                  } 
                });

  // Display recieved date and time
  selectionPanel.append("text")
                .attr("x", displayMsgX + textPaddingX)
                .attr("y", 100)
                .attr("font-family", "century gothic")
                .attr("font-size", "40px")
                .attr("fill", "white")
                .text(function(){
                  if(getCurrentMode == "Inbox"){
                    return "recieved: " + selectedMessage.time + " on " + selectedMessage.date;
                  }
                  else {
                    return "sent: " + selectedMessage.time + " on " + selectedMessage.date;
                  } 
                });

  // Display of actual message
  selectionPanel.append("text")
                .attr("x", 0) // Should not be a number
                .attr("y", 0)
                .attr("font-family", "century gothic")
                .attr("font-size", "90px")
                .attr("fill", "white")
                .call(wrap, selectedMessage.message, (displayMsgWidth - (textPaddingX*2)), 120)
                .attr("transform", "translate(" + (displayMsgX + textPaddingX) + ", " + 85 + ")");

}
