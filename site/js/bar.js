/*  
	bar.js
	03/26/13
	author: Rob Acheson

	Adapted from 
	http://mbostock.github.com/d3/tutorial/bar-1.html

*/

var width = 880;
var height = 220;

function updateBar() {

	var barMax = d3.max(sites, function(d) { return d.views;});	

	// var area = d3.scale.linear()
	// 	.domain([1, mapMax])
	// 	.range([2, 100]);

	var x = d3.scale.linear()
		.domain([0, 1])
		.range([0, width/sites.length]);

	var y = d3.scale.linear()
		.domain([0, barMax])
		.rangeRound([0, height]);

	// var x = d3.scale.linear()
	// 	.domain([0, d3.max(sites, function(d) { return d.views})])

	// var barMax = d3.max(sites, function(d) { return d.views});

	var barChart = d3.select("div#bar-chart").append("svg")
		.attr("class", "bar-chart")
		.attr("width", width)
		.attr("height", height);

	
	barChart.selectAll("rect")
		.data(sites)
			.enter().append("rect")
				.attr("x", function(d,i) { return x(i) - 0.5; })
				.attr("y", function(d) {return height - y(d.views) - 0.5;})
				.attr("width", width/sites.length)
				.attr("height", function(d) {return y(d.views);});
}