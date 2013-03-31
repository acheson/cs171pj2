/*  
	bar.js
	03/26/13
	author: Rob Acheson

	Adapted from 
	http://mbostock.github.com/d3/tutorial/bar-1.html

*/

var width = 880;
var height = 220;

var barChart = d3.select("div#bar-chart").append("svg")
		.attr("class", "bar-chart")
		.attr("width", width)
		.attr("height", height);


function updateBar() {

	var barMax = d3.max(sites, function(d) { return d.views;});	

	var x = d3.scale.linear()
		.domain([0, 1])
		.range([0, width/sites.length]);

	var y = d3.scale.sqrt()
		.domain([1, barMax])
		.rangeRound([0, height]);

	var selection = barChart.selectAll("rect")
		.data(sites);

	selection.enter().append("rect")
		.attr("x", function(d,i) { return x(i) - 0.5; })
		.attr("y", function(d) {return height - y(d.views) - 0.5;})
		.attr("width", width/sites.length)
		.attr("height", function(d) {return y(d.views);})
		.on("mouseover", handleMouseOver)

	selection.transition()
		.duration(500)
		.attr("x", function(d,i) { return x(i) - 0.5; })
		.attr("y", function(d) {return height - y(d.views) - 0.5;})
		.attr("width", width/sites.length)
		.attr("height", function(d) {return y(d.views);});

	selection.exit()
		.transition()
		.duration(500)
		.style("opacity", 0)
		.remove();
}

function handleMouseOver(e) {
	console.log(e.name + " " + e.views);
}
