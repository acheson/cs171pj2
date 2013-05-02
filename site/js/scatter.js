/*  
    scatter.js
    03/26/13
    authors: Rob Acheson
             Jeff Fontas

brush code was adapted from: http://static.cybercommons.org/js/d3/examples/brush/brush.html

brush clear functionality was adapted from this google groups post:
https://groups.google.com/forum/?fromgroups=#!topic/d3-js/FSsDuydkb5w

selecting nodes within the scatter plot code adapted from:
https://groups.google.com/forum/?fromgroups=#!topic/d3-js/iRrVcIDpodM
*/

var width = 340;
var height = 220;
var tmargin = 20;
var lmargin = 60;
var bmargin = 40;
var rmargin = 20;
var ptRadius = 3;
var updateArray = 0;
var scatter = d3.select("div#scatter-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height); 
var scatterX, scatterY;
var brushFn;
var listUpdateFlag = 1;
var ttScatter = scatter.append("g");
var scatterMouseDownFlag = false;

var axesDrawn = 0; //becomes 1 after drawing axes the first time

/* contains function that evaluates to true if array contains test value.
adapted from http://stackoverflow.com/questions/1181575/javascript-determine-whether-an-array-contains-a-value
on 04/27/13 */
function contains(val, array) {
    for( p in array) {
        if(array[p] == val){
            return true;
        }
      
    }
    return false;
}

/* list update flag = 1 if list changed prior to updating the view, else
just perform the regular update.  this flag enables preselection of values
on scatterplot */
function updateScatter() {
    
    scatterX = d3.scale
                    .linear()
                    // .pow().exponent(.50)
                    .domain([0, maxViews])
                    .range([ (0 + lmargin), (width - rmargin)]);

    scatterY = d3.scale
                    .linear()
                    // .pow().exponent(.50)
                    .domain([0, maxRatings])
                    .range([ (height - bmargin), (0 + tmargin)]);
   
    // this section draws the scatter axes at the first call 
    if (axesDrawn == 0) {

        //define axes
        var scatterYAxis = d3.svg.axis()
                            .scale(scatterY)
                            .orient("left")
                            .tickFormat(d3.format("s"))
                            .ticks(5)
                            .tickSubdivide(4)
                            .tickSize(6, 3, 3);

        var scatterXAxis = d3.svg.axis()
                            .scale(scatterX)
                            .orient("bottom")
                            .tickFormat(d3.format("s"))
                            .ticks(6)
                            .tickSubdivide(4)
                            .tickSize(6, 3, 3);

        //draw axes
        scatter.append("g")
            .attr("class", "x scatterAxis")
            .attr("transform", "translate(0.5," + (scatterY(0) + 0.5) + ")")
            .call(scatterXAxis);

        scatter.append("g")
            .attr("class", "y scatterAxis")
            .attr("transform", "translate(" +  (scatterX(0)+ 0.5) + ", 0.5)")
            .call(scatterYAxis);

        //add labels
        scatter.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width/2 + rmargin)
            .attr("y", height - 2)
            .text("Total views on 1channel.ch");

        scatter.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle") 
            .attr("transform", "rotate(-90, " + (lmargin/2 - 10 )+ ", " + height/2 + ")")           
            .attr("x", lmargin/2)
            .attr("y", height/2)
            
            .text("Total ratings on IMDB");


        //define brushing function, call it
        brushFn = d3.svg.brush()
            .x(scatterX)
            .y(scatterY)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        scatter.append("g")
            .attr("class", "brush")
            .call(brushFn);

        //add scatterplot points
        var circle = scatter.selectAll("circle")
            .data(films)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return scatterX(d.views); })
            .attr("cy", function(d) { return scatterY(d.ratings); })
            .attr("r", ptRadius)
            .attr("id", function(d) {return ("film"+d.rank);})
            .on("mouseover", scatterMouseOver)
            .on("mouseout", scatterMouseOut);
            // .on("mousedown", scatterMouseDown)
            // .on("mouseup",scatterMouseUp);

        axesDrawn = 1;


        
    }
   // alert(test);
    if (listUpdateFlag == 1) {
        var filmsFiltered = [];
        for (f in films) {
            filmsFiltered.push("film"+films[f].rank);
            
            
        }
        // alert(filmsFiltered);

        scatter.call(brushFn.clear());
        scatter.selectAll("circle").classed("selected", false);
        if (films.length == 250) {
            scatter.classed("selecting",false);
        } else {
            scatter.classed("selecting", true);
            scatter.selectAll("circle")
                .each(function(d) {
                //alert(contains((d3.select(this).attr("id")),filmsFiltered)+" "+d3.select(this).attr("id")+" "+dumpObject(filmsFiltered));

                if (contains((d3.select(this).attr("id")),filmsFiltered)) { d3.select(this).classed("selected", true); } 

                //else { d3.select(this).classed("selecting"); }
            
            });
        }
        

    }
    // clear the brush extent and formatting if there's anything going on
    scatter.selectAll(".selected").classed("none",true);
    
    function brushstart() {
        scatter.classed("selecting", true);
        listUpdateFlag = 0;
        d3.selectAll("#scatterToolTip").remove();
    }

    function brushmove() {
      var e = d3.event.target.extent();
      circle.classed("selected", function(d) { 
        return e[0][0] <= d.views && d.views <= e[1][0]
            && e[0][1] <= d.ratings && d.ratings <= e[1][1];
      });
      d3.selectAll("#scatterToolTip").remove();
    }

    function brushend() {    
        updateArray = [];  
        indicesArray = [];
        scatter.classed("selecting", !d3.event.target.empty());
        var tempArray = scatter.selectAll(".selected").data();
        if (tempArray.length > 0) {

            for (f in tempArray) {  
                updateArray.push(filmData[(tempArray[f].rank-1)]);
                indicesArray.push(tempArray[f].rank-1);
            }

            parse(updateArray);

            shouldParse = false;
            
            highlightList(indicesArray);       
            listUpdateFlag = 1;
        }
    }
   
}

function scatterMouseOver(e) {
    if (scatterMouseDownFlag == false) {
        ttScatter.append("text")
            .attr("x", scatterX(e.views))
            .attr("y", scatterY(e.ratings)-10)
            .attr("id", "scatterToolTip")
            .attr("font-size", 10)
            .attr("style", function(d) {
                if (scatterX(e.views) > (scatterX(maxViews)*2)/3) {
                    return "text-anchor:middle";
                } else if (scatterX(e.views) < (scatterX(maxViews)*3)/7) {
                    return "text-anchor:right";
                } else {
                    return "text-anchor:middle";
                }
            })
            .attr("transform", function(d) {
                if (scatterX(e.views) > (scatterX(maxViews)*2)/3)  {
                    return "translate(-"+(e.title.length*2.5+5)+",13.5)";
                } else {
                    return "translate(0,0)";
                }
            })
            .text(e.title); 
    }
}

function scatterMouseOut(e) {

    d3.selectAll("#scatterToolTip").remove();
}


// function scatterMouseDown(e) {
//     d3.selectAll("#scatterToolTip").remove();
//     scatterMouseDownFlag = true;
//     console.log("scatterMouseDown = " + scatterMouseDownFlag)
// }

// function scatterMouseUp(e) {
//     // d3.selectAll("#scatterToolTip").remove();
//     scatterMouseDownFlag = false;
//     console.log("scatterMouseDown = " + scatterMouseDownFlag)
// }
