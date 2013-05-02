/*  
    bar.js
    03/26/13
    author: Rob Acheson

    Adapted from 
    http://mbostock.github.com/d3/tutorial/bar-1.html
    http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html

*/
var barChartWidth = 880;
var barChartHeight = 220;
var barMargin = {top:10, left:0, bottom: 100, right:0};
var barWidth = barChartWidth - (barMargin.left + barMargin.right);
var barHeight = barChartHeight - (barMargin.top + barMargin.bottom);


/********************* UI *********************/

function handleMouseOverBar(e) {
    
    var currentBarMark = d3.select(this);
    highlightBar(e, currentBarMark);

    // make selection and highlight the map
    var mapCircle = d3.selectAll("circle." + mapClasses[currentSection])
        .filter( function(d) { 
            if (d.name == e.name) {
                return this;
            }
        });
    highlightMap(e, mapCircle);

    if (currentSection == 0) {
        console.log(0);
        var currentTextMark = barChartSites.selectAll("text")
        .filter( function(d) { 
            if (d.name == e.name) {
                return this;
            }
        });
    highlightText(e, currentTextMark);
    }
    else if (currentSection == 2) {
        console.log(2);
        var currentTextMark = barChartViewers.selectAll("text")
        .filter( function(d) { 
            if (d.name == e.name) {
                return this;
            }
        });
    highlightText(e, currentTextMark);
    };
}

function handleMouseOverText(e) {
    console.log("handleMouseOverText");
    var currentTextMark = d3.select(this);
    highlightText(e, currentTextMark);

    var currentBarMark = d3.selectAll(".bar-mark")
        .filter( function(d) { 
            if (d.name == e.name) {
                return this;
            }
        });
    highlightBar(e, currentBarMark);

    // make selection and highlight the map
    var mapCircle = d3.selectAll("circle." + mapClasses[currentSection])
        .filter( function(d) { 
            if (d.name == e.name) {
                return this;
            }
        });
    highlightMap(e, mapCircle);
}

function highlightBar(e, obj) {
    // dim others
    // var selection = barChartSites.selectAll("rect")
    //     .transition()
    //         .duration(250)
    //         .style("fill", "#888")
    //         .style("fill-opacity", 0.2)
    //         .style("stroke", "#888")    
    //           .style("stroke-opacity", 0.3);

    var selection;
    if (currentSection == 0) {
        selection = barChartSites.selectAll("rect")
    }
    else if (currentSection == 2) {
        selection = barChartViewers.selectAll("rect")
    }
     
    selection.transition()
            .duration(250)
            .style("fill", "#888")
            .style("fill-opacity", 0.2)
            .style("stroke", "#888")    
              .style("stroke-opacity", 0.3);

      
      // highlight current    
      obj.transition()
          .duration(250)
        .style("fill", colors[currentSection])
        .style("fill-opacity", 0.5)
        .style("stroke", colors[currentSection])
        .style("stroke-opacity", 1.0);
}

function highlightText(e, obj) {
    // dim others
    // var selection = barChartSites.selectAll("text")
        // .transition()
        //     .duration(250)
        //     .style("fill", "#888");
      
    var selection;
    if (currentSection == 0) {
        selection = barChartSites.selectAll("text")
    }
    else if (currentSection == 2) {
        selection = barChartViewers.selectAll("text")
    }  
    selection.transition()
            .duration(250)
            .style("fill", "#888");

      // highlight current    
      obj.transition()
        .duration(250)
        .style("fill", "black");
}


/*************** Sites Bar Chart ***************/

var barChartSites = d3.select("div#bar-chart-sites")
    .append("svg")
        .attr("class", "bar-chart-sites")
        .attr("width", barChartWidth)
        .attr("height", barChartHeight)
    .append("g")
        .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

var sitesAxisDrawn = 0;

function drawSitesBar(sites) {
    
    if (sites.length     == 0) { $("#bar-chart-sites").fadeOut();}
    else { $("#bar-chart-sites").fadeIn();}

    var sortedSites = sites.slice(0);
    sortedSites.sort(function(a, b) {
        return d3.descending(a.views, b.views);
    });

    var barMax = d3.max(sortedSites, function(d) { return d.views;});

    var x = d3.scale.ordinal()
        .domain(d3.range(sortedSites.length))
        .rangeBands([40,barWidth]);

    var y = d3.scale.linear()
        .domain([1, barMax])
        .domain([1, ((barMax*10)/9)])
        .range([1, barHeight]);

    var yInverse = d3.scale.linear()
        .domain([1, barMax])
        .domain([1, ((barMax*10)/9)])
        .range([barHeight, 1]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(sortedSites.length);

    var yAxis = d3.svg.axis()
        .scale(yInverse)
        .orient("left")
        .ticks(5)
        .tickFormat(d3.format("s"))
        .tickSubdivide(2)
        .tickSize(6, 4, 2);

    var selection = barChartSites.selectAll("rect")
        .data(sortedSites, function(d) {return d.name;});

    selection.enter().append("rect")
        .attr("class", "bar-mark")
        .attr("x", barWidth)
        .attr("y", barHeight)
        .style("fill", colors[0])
        .style("fill-opacity", 0.2)
        .style("stroke", colors[0])            
        .style("stroke-opacity", 0.3)
        .style("stroke-width", 1.0)
            
    selection.on("mouseover", handleMouseOverBar);
    selection.on("mouseout", handleMouseOut);  // this function is in map.js

    selection.transition()
        .duration(500)
        .attr("x", function(d,i) {  return x(i) - 0.5; })
        .attr("y", function(d) {return barHeight - y(d.views) - 0.5;})
        .attr("width", barWidth/sortedSites.length - 5)
        .attr("height", function(d) {return y(d.views);});

    selection.exit()
        .transition()
            .duration(500)
            .attr("x", barWidth)
            .style("opacity", 0)
            .remove();

    var textSelection = barChartSites.selectAll("text")
        .data(sortedSites, function(d) {return d.name;});

    textSelection.enter().append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", function(d, i) {  return "translate(" + (x(i) + (barWidth/sortedSites.length)/2)  + "," + (barHeight + 10) + ") rotate(-65)";})
        .text(function(d, i) { return d.name;})   
        .style("font-size", "13px")
        .style("opacity", 0);
    textSelection.on("mouseover", handleMouseOverText);
    textSelection.on("mouseout", handleMouseOut);  // this function is in map.js

    textSelection.transition()
        .duration(500)
        .attr("transform", function(d, i) {  return "translate(" + (x(i) + (barWidth/sortedSites.length)/2)  + "," + (barHeight + 2) + ") rotate(-65)";})
        .style("opacity", 1);

    textSelection.exit()
        .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

    //draw y axis -- draws first then transitions afterwards
    if (sitesAxisDrawn == 0) {
   
        barChartSites.append("g")
            .attr("class", "barAxisSites")
            .attr("transform", "translate(" + (x(0)-0.5) + "," + (y(0)- 1.5) + ")")
            .call(yAxis);

        sitesAxisDrawn = 1;

    } else {
        //transitions for axis
        barChartSites.select(".barAxisSites")
            .transition()
            .duration(0)
            .call(yAxis); 
    }
}


/*************** Viewers Bar Chart ***************/
var barChartViewers = d3.select("div#bar-chart-viewers")
    .append("svg")
        .attr("class", "bar-chart-viewers")
        .attr("width", barChartWidth)
        .attr("height", barChartHeight)
    .append("g")
        .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

var viewersAxisDrawn = 0;

function drawViewersBar(viewers) {
    if (viewers.length == 0) { $("#bar-chart-viewers").fadeOut();}
    else { $("#bar-chart-viewers").fadeIn();}

    var sortedViewers = viewers.slice(0);
    sortedViewers.sort(function(a, b) {
        return d3.descending(a.viewers, b.viewers);
    });

    var barMax = d3.max(sortedViewers, function(d) { return d.viewers;});

    var x = d3.scale.ordinal()
        .domain(d3.range(sortedViewers.length))
        .rangeBands([40,barWidth]);

    var y = d3.scale.linear()
        .domain([1, barMax])
        .domain([1, ((barMax*10)/9)])
        .range([1, barHeight]);

    var yInverse = d3.scale.linear()
        .domain([1, barMax])
        .domain([1, ((barMax*10)/9)])
        .range([barHeight, 1]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(sortedViewers.length);

    var yAxis = d3.svg.axis()
        .scale(yInverse)
        .orient("left")
        .ticks(5)
        .tickFormat(d3.format("s"))
        .tickSubdivide(2)
        .tickSize(6, 4, 2);

    var selection = barChartViewers.selectAll("rect")
        .data(sortedViewers, function(d) {return d.name;});

    selection.enter().append("rect")
        .attr("class", "bar-mark")
        .attr("x", barWidth)
        .attr("y", barHeight)
        .style("fill", colors[2])
        .style("fill-opacity", 0.2)
        .style("stroke", colors[2])            
        .style("stroke-opacity", 0.3)
        .style("stroke-width", 1.0)
            
    selection.on("mouseover", handleMouseOverBar);
    selection.on("mouseout", handleMouseOut);  // this function is in map.js

    selection.transition()
        .duration(500)
        .attr("x", function(d,i) {  return x(i) - 0.5; })
        .attr("y", function(d) {return barHeight - y(d.viewers) - 0.5;})
        .attr("width", barWidth/sortedViewers.length - 5)
        .attr("height", function(d) {return y(d.viewers);});

    selection.exit()
        .transition()
            .duration(500)
            .attr("x", barWidth)
            .style("opacity", 0)
            .remove();

    var textSelection = barChartViewers.selectAll("text")
        .data(sortedViewers, function(d) {return d.name;});

    textSelection.enter().append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", function(d, i) {  return "translate(" + (x(i) + (barWidth/sortedViewers.length)/2)  + "," + (barHeight + 10) + ") rotate(-65)";})
        .text(function(d, i) { return d.name;})   
        .style("font-size", "12px")
        .style("opacity", 0);
    textSelection.on("mouseover", handleMouseOverText);
    textSelection.on("mouseout", handleMouseOut);  // this function is in map.js

    textSelection.transition()
        .duration(500)
        .attr("transform", function(d, i) {  return "translate(" + (x(i) + (barWidth/sortedViewers.length)/2)  + "," + (barHeight + 2) + ") rotate(-65)";})
        .style("opacity", 1);

    textSelection.exit()
        .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

    //draw y axis -- draws first then transitions afterwards
    if (viewersAxisDrawn == 0) {
   
        barChartViewers.append("g")
            .attr("class", "barAxisViewers")
            .attr("transform", "translate(" + (x(0)-0.5) + "," + (y(0)- 1.5) + ")")
            .call(yAxis);

        viewersAxisDrawn = 1;

    } else {
        //transitions for axis
        barChartViewers.select(".barAxisViewers")
            .transition()
            .duration(0)
            .call(yAxis); 
    }
}






