/*  
	map.js
	03/24/13
	author: Rob Acheson

*/

/* 
	Adapted from examples
	http://bl.ocks.org/mbostock/3734333
	http://www.schneidy.com/Tutorials/MapsTutorial.html
	http://stackoverflow.com/questions/10261992/d3-js-add-a-circle-in-d3-geo-path

*/

var width = 880;
var height = 460;

var projection = d3.geo.mercator()
	.scale(140)
	.translate([width / 2, 300])
	.precision(.1);

var path = d3.geo.path()
	.projection(projection);

var map = d3.select("div#map-chart").append("svg")
	.attr("width", width)
	.attr("height", height);

// This would append graticule marks to the map
// var graticule = d3.geo.graticule();
// map.append("path")
	// .datum(graticule)
	// .attr("class", "graticule")
	// .attr("d", path);

d3.json("../data/world-50m.json", function(error, world) {
	map.insert("path", ".map-mark")
	// map.append("path")
		.datum(topojson.object(world, world.objects.land))
		.attr("id", "land")
		.attr("d", path);

	map.insert("path", ".map-mark")
	// map.append("path")
		.datum(topojson.mesh(world, world.objects.countries, function(a , b) { return a !== b; }))
		.attr("id", "boundary")
		.attr("d", path);
});


function updateMap() {


	console.log("updateMap");

	// console.log(d3.min(function(sites, i) { return sites[i].views ;}));
	var mapMax = d3.max(sites, function(d) { return d.views;});	

	// linear scale  - input:domain as output:range
	var area = d3.scale.linear()
		.domain([1, mapMax])
		.range([2, 100]);

	var selection = map.selectAll("circle")
		.data(sites);

	selection.enter().append("circle")
			.attr("class", "map-mark")
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("r", function(d) {return area(d.views);})
			.on("mouseover", handleMouseOver);

	selection.exit()
		.transition()
		.duration(500)
			.style("opacity", 0)
			.remove();


}


// TODO - Implement a tooltop on hover


// map.selectAll("path")
// 	.on("mouseover", handleMouseOver);

function handleMouseOver(e) {
	// dumpObject(e);
	console.log(e.name + " " + e.views);

	// var mapModal = map.select("div #map-modal");
	// mapModal.append("div")
	// 	.attr("id", "map-modal")

	// e.attr("fill", "#A0A");
}


// selectAll the state elements, and then use .on("mouseover"),
// .on("mouseout") and .on("mousemove") to bind event listeners:




