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
var barMargin = {top:0, left:50, bottom: 100, right:0};
var barWidth = barChartWidth - (barMargin.left + barMargin.right);
var barHeight = barChartHeight - (barMargin.top + barMargin.bottom);


var barChart = d3.select("div#bar-chart")
	.append("svg")
		.attr("class", "bar-chart")
		.attr("width", barChartWidth)
		.attr("height", barChartHeight)
	.append("g")
		.attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

function updateBar() {
	
	var barMax = d3.max(sites, function(d) { return d.views;});	

	var x = d3.scale.linear()
		.domain([0, 1])
		.range([0, barWidth/sites.length]);

	var y = d3.scale.sqrt()
		.domain([1, barMax])
		.rangeRound([0, barHeight]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(sites.length);

	var yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(5);

	var selection = barChart.selectAll("rect")
		.data(sites, function(d) {return d.name;});
		// .data(sites);

	selection.enter().append("rect")
		.attr("class", "bar-mark")
		.attr("x", barWidth)
		.attr("y", barHeight)
		.style("fill", "red")
		.style("fill-opacity", 0.2)
		.style("stroke", "red")			
		.style("stroke-opacity", 0.3)
		.style("stroke-width", 1.0)
		.transition()
			.duration(500)
			.attr("x", function(d,i) { return x(i) - 0.5; })
			.attr("y", function(d) {return barHeight - y(d.views) - 0.5;})
			.attr("width", barWidth/sites.length)
			.attr("height", function(d) {return y(d.views);})
			
  	selection.on("mouseover", handleMouseOverBar);
	selection.on("mouseout", handleMouseOut);  // this function is in map.js

	selection.transition()
		.duration(500)
		.attr("x", function(d,i) { return x(i) - 0.5; })
		.attr("y", function(d) {return barHeight - y(d.views) - 0.5;})
		.attr("width", barWidth/sites.length)
		.attr("height", function(d) {return y(d.views);});

	selection.exit()
		.transition()
			.duration(500)
			.attr("x", barWidth)
			.style("opacity", 0)
			.remove();

	var barLabels =  barChart.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(xAxis)
        .selectAll("text")  
           .data(sites);

           barLabels.text(function(d, i) {return d.name;})
            .style("text-anchor", "end")
            .style("font-size", "13px")
            .attr("y", function(d,i) {return x(i);})
            .attr("transform", function(d) {
                return "rotate(-90)" 
                });

    
	// text = barChart.selectAll("text")
	// 	.data(sites);
	// text.enter()
	// 	.append("text")
	// 	.text(function(d) {return d.name;})
	// 	.style("text-anchor", "end")
	// 	.attr("transform", "rotate(-90)")
	// 	.attr("x", function(d,i) { return x(i) - 0.5; })
	// 	.attr("y", function(d) {return barHeight;})
}

function handleMouseOverBar(e) {
	var currentBarMark = d3.select(this);
	highlightBar(e, currentBarMark);

	// make selection and highlight the map
	var mapCircle = d3.selectAll(".map-mark")
		.filter( function(d) { 
			if (d.name == e.name) {
				// console.log("match")
				return this;
			}
		});
	highlightMap(e, mapCircle);
}

// function handleMouseOutBar(e) {
// 	var selection = barChart.selectAll("rect")
// 		.transition()
// 			.duration(250)
// 			.style("fill", "red")
// 			.style("fill-opacity", 0.2)
// 			.style("stroke", "red")	
//   			.style("stroke-opacity", 0.3);

// 	handleMouseOutMap(e);
// }

function highlightBar(e, obj) {
	// dim others
	var selection = barChart.selectAll("rect")
		.transition()
			.duration(250)
			.style("fill", "#888")
			.style("fill-opacity", 0.2)
			.style("stroke", "#888")	
  			.style("stroke-opacity", 0.3);
  	// highlight current	
  	obj.transition()
  		.duration(250)
		.style("fill", "red")
		.style("fill-opacity", 0.5)
		.style("stroke", "red")
		.style("stroke-opacity", 1.0);
		
	
}





