/*  
	bar.js
	03/26/13
	author: Rob Acheson

	Adapted from 
	http://mbostock.github.com/d3/tutorial/bar-1.html

*/

var barWidth = 880;
var height = 220;

var barChart = d3.select("div#bar-chart").append("svg")
		.attr("class", "bar-chart")
		.attr("width", barWidth)
		.attr("height", height);

function updateBar() {

	var barMax = d3.max(sites, function(d) { return d.views;});	

	var x = d3.scale.linear()
		.domain([0, 1])
		.range([0, barWidth/sites.length]);

	var y = d3.scale.sqrt()
		.domain([1, barMax])
		.rangeRound([0, height]);

	var selection = barChart.selectAll("rect")
		.data(sites);

	selection.enter().append("rect")
		.attr("x", barWidth)
		.attr("y", height)
		.transition()
			.duration(500)
			.attr("x", function(d,i) { return x(i) - 0.5; })
			.attr("y", function(d) {return height - y(d.views) - 0.5;})
			.attr("width", barWidth/sites.length)
			.attr("height", function(d) {return y(d.views);});
	selection.on("mouseover", handleMouseOverBar);
	selection.on("mouseout", handleMouseOutBar);

	selection.transition()
		.duration(500)
		.attr("x", function(d,i) { return x(i) - 0.5; })
		.attr("y", function(d) {return height - y(d.views) - 0.5;})
		.attr("width", barWidth/sites.length)
		.attr("height", function(d) {return y(d.views);});

	selection.exit()
		.transition()
			.duration(500)
			.attr("x", barWidth)
			.style("opacity", 0)
			.remove();
}

function handleMouseOverBar(e) {
	console.log(e.name + " " + e.views);
	didMouseOverBar(e);
	// var mapCircle = d3.selectAll(".map-mark")
	// 	.filter( function(d,i) { 
	// 		if (e.name == d.name) {
	// 			console.log("match")
	// 			return this;
	// 		}
	// 	})
		
	// // 	.style("fill", "blue");

	// 	handleMouseOverMap(mapCircle[0]);
	
}

function handleMouseOutBar(e) {
	console.log(e.name + " " + e.views);
	// didMouseOutBar(e);
	handleMouseOutMap(e);
}

