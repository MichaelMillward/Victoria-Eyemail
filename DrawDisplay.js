var screenWidth = window.innerWidth || document.body.clientWidth;
var screenHeight = (window.innerHeight || document.body.clientHeight) - 40;

function draw(){
  // First, add an svg element to draw on
  svg = d3.select("body")
              .append("svg")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", (screenWidth-8))
              .attr("height", screenHeight);

  // Import data
  // The below method within a method is a hack but the only
  // way i can see it working.
  // Imports JSON files and then puts them in MessageClass
  // which stores them and provides useful methods to do with
  // them.
  d3.json("received.json", function(error, json) {
    if (error) {
      return console.warn(error);
    }
    importInboxMessages(json);
    // Next import sent 
    d3.json("sent.json", function(error, json) {
      if (error) {
        return console.warn(error);
      }
      importMailedMessages(json);
      simpleDisplay(svg);
    });
  });

  
}

/** Method used to change the dislay mode */
function changeDisplay(displayMode){
  // Removes svg, and creates a new one.
  d3.select("body")
          .select("svg")
          .remove();

  svg = d3.select("body")
              .append("svg")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", (screenWidth-8))
              .attr("height", screenHeight);

  if(displayMode == "Simple"){
    simpleDisplay(svg);
  }
  else{
    expandDisplay(svg);
  }
  
}


