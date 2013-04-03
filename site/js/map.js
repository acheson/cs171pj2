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

function handleMouseOverMap(d) {
	// in case the mouseOut missed
	var selection = map.selectAll("circle")
		.transition()
			.duration(250)
			.style("fill-opacity", 0.2)
			.style("stroke", "red")
			.style("stroke-opacity", 0.2);
	
	var currentMapMark = d3.select(this)
		.transition()
			.duration(250)
			.style("fill-opacity", 0.5)
			.style("stroke", "black")
			.style("stroke-opacity", 1.0);

	var div =d3.select("div#map-chart").append("div")   
    	.attr("class", "tooltip")               
    	.style("opacity", 0);

    div.transition()        
        .duration(250)      
        .style("opacity", .9);      
    div.html("<h3>" + d.name + "</h3><br/>" + d.views)  
        .style("left", (d3.event.pageX ) + "px")     
        .style("top", (d3.event.pageY - 28) + "px");    
}


function handleMouseOutMap(d) {
	d3.select(this)
		.transition()
			.duration(250)
			.style("fill-opacity", 0.2)
			.style("stroke", "red")
			.style("stroke-opacity", 0.2);

	var div = d3.selectAll(".tooltip")   
	div.transition()        
        .duration(250)      
        .style("opacity", 0)
        .remove();


}

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

	var div = d3.select("body").append("div")   
    	.attr("class", "tooltip")               
   	 .style("opacity", 0);

	selection.enter().append("circle")
			.attr("class", "map-mark")
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("r", function(d) {return area(d.views);})
			.style("fill", "red")
			.style("fill-opacity", 0.2)
			.style("stroke", "red")
			.style("stroke-opacity", 0.2)
			.style("stroke-width", 0.5)
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






