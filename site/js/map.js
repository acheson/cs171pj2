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
	http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
*/

var mapWidth = 880;
var mapHeight = 460;

var projection = d3.geo.mercator()
	.scale(140)
	.translate([mapWidth / 2, 300])
	.precision(.1);

var path = d3.geo.path()
	.projection(projection);

var map = d3.select("div#map-chart").append("svg")
	.attr("width", mapWidth)
	.attr("height", mapHeight);

d3.json("../data/world-50m.json", function(error, world) {
	map.insert("path", ".map-mark")
		.datum(topojson.object(world, world.objects.land))
		.attr("id", "land")
		.attr("d", path);

	map.insert("path", ".map-mark")
		.datum(topojson.mesh(world, world.objects.countries, function(a , b) { return a !== b; }))
		.attr("id", "boundary")
		.attr("d", path);
});

function updateMap() {
	
	console.log("update map");
	var mapMax = d3.max(sites, function(d) {return d.views;});	

	// linear scale  - input:domain as output:range
	var area = d3.scale.linear()
		.domain([1, mapMax])
		.range([2, 100]);

	// Sort sites so that smaller ones always appear on top of larger
	// create a copy of sites to sort
	var sortedSites = sites.slice(0);
	sortedSites.sort(function(a, b) {
    	return d3.descending(a.views, b.views);
    });

	var selection = map.selectAll("circle")
		.data(sortedSites);

	var div = d3.select("body").append("div")   
    	.attr("class", "tooltip")               
   		.style("opacity", 0);

	selection.enter().append("circle")
			.attr("class", "map-mark")
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("display", function(d) { 
				if (d.lon == undefined) { return "none"; }
			})
			.attr("r", function(d) {return area(d.views);})
			.style("fill", "red")
			.style("fill-opacity", 0.2)
			.style("stroke", "red")
			.style("stroke-opacity", 0.3)
			.style("stroke-width", 1.0)
			.on("mouseover", handleMouseOverMap)
			.on("mouseout", handleMouseOutMap);
	
	selection.transition()
		.duration(500)
		.attr("r", function(d) {return area(d.views);})

	selection.exit()
		.transition()
		.duration(500)
			.style("opacity", 0)
			.remove();
}

function handleMouseOverMap(d,i) {
	var currentMapMark = d3.select(this);
	highlightMap(d, currentMapMark);
}

function handleMouseOutMap(d) {
	var selection = map.selectAll("circle")
		.transition()
			.duration(250)
			.style("fill", "red")
			.style("fill-opacity", 0.2)
			.style("stroke", "red")
			.style("stroke-opacity", 0.3);

	var div = d3.selectAll(".tooltip")   
	div.transition()        
        .duration(250)      
        .style("opacity", 0)
        .remove();
}

function highlightMap(e,obj) {
	
	console.log(e);

	var currentProjection = projection([e.lon,e.lat]);

	// in case the mouseOut missed
	var selection = map.selectAll("circle")
		.transition()
			.duration(250)
			.style("fill", "#888")	
			.style("fill-opacity", 0.2)
			.style("stroke", "#888")
			.style("stroke-opacity", 0.3);

	// var currentMapMark = d3.select(obj)
		obj.transition()
			.duration(250)
			.style("fill", "red")
			.style("fill-opacity", 0.5)
			.style("stroke", "red")
			.style("stroke-opacity", 1.0);
  
	var div = d3.select("div#map-chart").append("div")   
    	.attr("class", "tooltip")               
    	.style("opacity", 0);

    div.transition()        
        .duration(250)      
        .style("opacity", .9);

    /*    formats views in the thousands/millions with commas 
    	-- change d.views to viewsFormat(d.views)     */
    // var viewsFormat = d3.format(",");

    div.html("<h3>" + e.name + "</h3>" + e.views + " views</br>" + countryNameForCode(e.country))  
        .style("left", (currentProjection[0] - 130) + "px")   
        .style("top", (currentProjection[1] - 80) + "px");  
}








