/*  
	map.js
	03/24/13
	authors: Rob Acheson, Jeff Fontas  

*/

/* 
	Adapted from examples
	http://bl.ocks.org/mbostock/3734333

*/

var width = 880;
var height = 460;

var projection = d3.geo.mercator()
	.scale(140)
	.translate([width / 2, 300])
	.precision(.1);

var path = d3.geo.path()
	.projection(projection);

// var graticule = d3.geo.graticule();

var svg = d3.select("div#map-chart").append("svg")
	.attr("width", width)
	.attr("height", height);

svg.append("path")
	// .datum(graticule)
	// .attr("class", "graticule")
	// .attr("d", path);

d3.json("../data/world-50m.json", function (error, world) {
	svg.insert("path", ".graticule")
		.datum(topojson.object(world, world.objects.land))
		.attr("class", "land")
		.attr("d", path);

	svg.insert("path", ".graticule")
		.datum(topojson.mesh(world, world.objects.countries, function(a , b) { return a !== b; }))
		.attr("class", "boundary")
		.attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");