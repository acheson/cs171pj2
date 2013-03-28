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



var svg = d3.select("div#map-chart").append("svg")
	.attr("width", width)
	.attr("height", height);

// This would append graticule marks to the map
// var graticule = d3.geo.graticule();
// svg.append("path")
	// .datum(graticule)
	// .attr("class", "graticule")
	// .attr("d", path);

d3.json("../data/world-50m.json", function(error, world) {
	svg.insert("path", ".mark")
	// svg.append("path")
		.datum(topojson.object(world, world.objects.land))
		.attr("id", "land")
		.attr("d", path);

	svg.insert("path", ".mark")
	// svg.append("path")
		.datum(topojson.mesh(world, world.objects.countries, function(a , b) { return a !== b; }))
		.attr("id", "boundary")
		.attr("d", path);
});


function updateMap() {

	console.log("updateMap");

	// get the keys so D3 can use object as array
	// var keys = Object.keys(sites);
 	
	// dumpObject(keys);
	// TODO make this work, better :)
	// TODO change "mark" to "map-mark"

	// var max = d3.min(sites.forEach.);
	// console.log(max);

	svg.selectAll("circle")
		.data(sites)
			.enter().append("circle")
			.attr("class", "mark")
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("r", function(d) {return d.views/100000;})
			// .attr("r", 2)
			.style("opacity", 0.2)
			.style("fill", "red")
			.on("mouseover", handleMouseOver);
}


// TODO - Implement a tooltop on hover


// svg.selectAll("path")
// 	.on("mouseover", handleMouseOver);

function handleMouseOver(e) {
	console.log("poop");
	// e.attr("fill", "#A0A");
}


// selectAll the state elements, and then use .on("mouseover"),
// .on("mouseout") and .on("mousemove") to bind event listeners:
