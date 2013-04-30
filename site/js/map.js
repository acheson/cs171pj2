/*  
	map.js
	03/24/13
	author: Rob Achesons
*/

/* 
	Adapted from examples
	http://bl.ocks.org/mbostock/3734333
	http://www.schneidy.com/Tutorials/MapsTutorial.html
	http://stackoverflow.com/questions/10261992/d3-js-add-a-circle-in-d3-geo-path
	http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

	// map zoom adapted from examples
	http://bl.ocks.org/d3noob/raw/5193723/
	https://groups.google.com/forum/#!topic/d3-js/-qUd_jcyGTw
	http://jqueryui.com/slider/#slider-vertical

	// changed tooltip text to SVG based on this example
	http://tributary.io/inlet/4132672/

*/

var mapWidth = 880;
var mapHeight = 460;

var projection = d3.geo.mercator()
	.scale(140)
	.translate([mapWidth / 2, 300])
	.precision(.1);

var mapCenter = projection([0,45]);

var path = d3.geo.path()
	.projection(projection);

/* array of colors accessed by current section */
var colors = ["red", "purple", "blue"];
var mapClasses = ["map-mark-sites", "map-mark-channel", "map-mark-viewers"];	

var map = d3.select("div#map-chart")
	.append("svg")
		.attr("width", mapWidth)
		.attr("height", mapHeight)

// create a container for the map itself for zooming		 
var g = map.append("g");

d3.json("../data/world-50m.json", function(error, world) {
	g.insert("path", ".map-mark")
		.datum(topojson.object(world, world.objects.land))
		.attr("id", "land")
		.attr("d", path);

	g.insert("path", ".map-mark")
		.datum(topojson.mesh(world, world.objects.countries, function(a , b) { return a !== b; }))
		.attr("id", "boundary")
		.attr("d", path);
});


function handleMouseOverMap(e) {
	var currentMapMark = d3.select(this);
	highlightMap(e, currentMapMark);

	// // find matching bar and highlight
	// var barBar = d3.selectAll(".bar-mark")
	// 	.filter( function(d) {
	// 		if (d.name == e.name) {
	// 			return this;
	// 		}
	// 	});
	// highlightBar(e, barBar);

	// var currentTextMark = barChart.selectAll("text")
 //        .filter( function(d) { 
 //            if (d.name == e.name) {
 //                return this;
 //            }
 //        });
 //    highlightText(e, currentTextMark);

 //    var currentTooltip = tt.selectAll("text") 
 //    	.filter( function(d) {
 //    		if (e.name == d.name) {
 //    			return this;
 //    		};
 //    	});
 //    	highlightTooltip(e, currentTooltip);
}

function handleMouseOut(e) {
	
	var selection = map.selectAll("circle." + mapClasses[currentSection])//	.classed(mapClasses[currentSection], true)
		.transition()
			.duration(250)
			.style("fill", colors[currentSection])
			.style("fill-opacity", 0.2)
			.style("stroke", colors[currentSection])
			.style("stroke-opacity", 0.3);

//     var selection = barChart.selectAll("rect")
// 		.transition()
// 			.duration(250)
// 			.style("fill", "red")
// 			.style("fill-opacity", 0.2)
// 			.style("stroke", "red")	
//   			.style("stroke-opacity", 0.3);

//   	var selection = barChart.selectAll("text")
// 		.transition()
// 			.duration(250)
// 			.style("fill", "black");

// 	var tooltip = tt.selectAll("text")
// 		.transition()
// 			.duration(250)
// 			.style("opacity", 0.0);
// }

// function highlightTooltip(e, obj) {
// 	var tooltip = tt.selectAll("text")
// 		.transition()
// 			.duration(250)
// 			.style("opacity", 0.0);

// 		obj.transition()
// 			.duration(250)
// 			.style("opacity", 1);			
}


function highlightMap(e,obj) {
	// var currentProjection = projection([e.lon,e.lat]);

	// deselect others
	var selection = map.selectAll("circle." + mapClasses[currentSection])//.classed(mapClasses[currentSection], true)
		.transition()
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
  
	// var currentTooltip = tt.selectAll("text") 
 //    	.filter( function(d) {
 //    		if (e.name == d.name) {
 //    			return this;
 //    		};
 //    	});
 //    	highlightTooltip(e, currentTooltip);    
}

/* Zoom functionality */

var zoom = null;
function initZoom() {
	// zoom = d3.behavior.zoom()
	// 	// .translate(projection.translate())
	// 	// .scale(projection.scale())
	// 	.scaleExtent([1, 5])
	// 	.on("zoom", function() {
	// 		g.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
	// 		tt.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");

	// 		// keep the text at same size and relative position regardless of scale
	// 		tt.selectAll(".name")
	// 			.style("font-size", function() {
	// 				return 20 / d3.event.scale;
	// 			})
	// 			.attr("y", function() {
	// 				return -50 / d3.event.scale;
	// 			});
	// 		tt.selectAll(".views")
	// 			.style("font-size", function() {
	// 				return 16 / d3.event.scale;
	// 			})
	// 			.attr("y", function() {
	// 				return -32 / d3.event.scale;
	// 			});
	// 		tt.selectAll(".country")
	// 			.style("font-size", function() {
	// 				return 16 / d3.event.scale;
	// 			})
	// 			.attr("y", function() {
	// 				return -16 / d3.event.scale;
	// 			});
		

	// 		// console.log("zoom scale" + d3.event.scale);
	// 		// console.log(d3.event.translate[0]);
	// 	});
}
initZoom();
// Make sure to re-enable this
// map.call(zoom);

d3.select("#map-reset").on("click", resetZoom);
function resetZoom() {
	// zoom.translate([0,0]).scale(0);
 //    map.selectAll("g") 
 //    	.transition()
 //    	.duration(500)
 //    	.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale + ")");
	
 //    tt.selectAll(".name")
	// 			.style("font-size", function() {
	// 				return 20;
	// 			})
	// 			.attr("y", function() {
	// 				return -50;
	// 			});
	// 		tt.selectAll(".views")
	// 			.style("font-size", function() {
	// 				return 16;
	// 			})
	// 			.attr("y", function() {
	// 				return -32;
	// 			});
	// 		tt.selectAll(".country")
	// 			.style("font-size", function() {
	// 				return 16;
	// 			})
	// 			.attr("y", function() {
	// 				return -16;
	// 			});

	// initZoom();
	// map.call(zoom);
};


/*************** 1Channel Section ******************/

// create for zooming Sites data	 
var channelContainer = map.append("g");
var channelTooltip = map.append("g");


function drawOneChannelMap(data)
{
	var area = d3.scale
		.pow().exponent(.750)
		.domain([1, totalViews])
		.range([2,250]);
	
	var selection = channelContainer.selectAll("circle")
		.data(data);

	selection.enter().append("circle")
			.attr("r", 0)	
			.attr("class", mapClasses[1])
			.attr("transform", "translate(" + mapCenter + ")")
			.style("fill", colors[1])
			.style("fill-opacity", 0.2)
			.style("stroke", colors[1])
			.style("stroke-opacity", 0.3)
			.style("stroke-width", 1.0)
			.on("mouseover", handleMouseOverMap)
			.on("mouseout", handleMouseOut);
	
	selection.transition()
		.duration(500)
			.attr("transform", function(d) {return "translate(" + mapCenter + ")";})
			.attr("r", function(d) {return area(d);});

	selection.exit()
		.transition()
			.duration(500)
			.attr("r", 0)
			.style("opacity", 0)
			.remove();
}



/*****************  Map Sites *********************/

// create for zooming Sites data	 
var sitesContainer = map.append("g");
var sitesTooltip = map.append("g");


function drawSitesMap(sites) {
	var mapMax = d3.max(sites, function(d) {return d.views;});

	var area = d3.scale
		.pow().exponent(.750)
		.domain([1, totalViews])
		.range([2,250]);

	// Sort sites so that smaller ones always appear on top of larger
	// create a copy of sites to sort
	var sortedSites = sites.slice(0);
	sortedSites.sort(function(a, b) {
    	return d3.descending(a.views, b.views);
    });

	var selection = sitesContainer.selectAll("circle")
		.data(sortedSites);

	selection.enter().append("circle")
			.attr("class", mapClasses[0])
			.style("fill", colors[0])
			.style("fill-opacity", 0.2)
			.style("stroke", colors[0])
			.style("stroke-opacity", 0.3)
			.attr("transform", function(d) {return "translate(" + mapCenter + ")";})
			.attr("display", function(d) { 
				if (d.lon == undefined) {return "none";}
			})
			.attr("r", function(d) {return area(d.views);})
			.on("mouseover", handleMouseOverMap)
			.on("mouseout", handleMouseOut);
	
	selection.transition()
		.duration(500)
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("r", function(d) {return area(d.views);});

	selection.exit()
		.transition()
			.duration(500)
			.attr("transform", function(d) {return "translate(" + mapCenter + ")";})
			.style("opacity", 0)
			.remove();

	var tooltip = sitesTooltip.selectAll("text.sites-tt-name")
		.data(sortedSites);

	tooltip.enter().append("text")
		.attr("class", "sites-tt-name")
		.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
		.attr("display", function(d) { 
			if (d.lon == undefined) {return "none";}
		})
		.text(function(d) {return d.name;})
			.attr("alignment-baseline", "middle")
	      	.attr("text-anchor", "middle")
	      	.attr("pointer-events", "none")
	      	.attr("y", -50)
	      	.style("font-size", 20)
	      	.style("opacity", 0.0);

	    tooltip.transition()
	    	.duration(500)
	    		.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
	    		.text(function(d) {return d.name;});

	    tooltip.exit()
		.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

	tooltip = sitesTooltip.selectAll("text.sites-tt-views")
		.data(sortedSites);
    
    tooltip.enter().append("text")
		.attr("class", "sites-tt-views")
		.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
		.attr("display", function(d) { 
			if (d.lon == undefined) {return "none";}
		})
		.text(function(d) {
				var formatViews = d3.format(",");
				return formatViews(d.views) + " views";
			})
			.attr("alignment-baseline", "middle")
	      	.attr("text-anchor", "middle")
	      	.attr("pointer-events", "none")
	      	.attr("y", -32)
	      	.style("font-size", 16)
	      	.style("opacity", 0.0);

	tooltip.transition()
	    .duration(500)
	    	.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
	    	.text(function(d) {
	    		var formatViews = d3.format(",");
				return formatViews(d.views) + " views";
			});

	tooltip.exit()
		.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

	tooltip = sitesTooltip.selectAll("text.sites-tt-country")
		.data(sortedSites);
    
    tooltip.enter().append("text")
		.attr("class", "sites-tt-country")
		.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
		.attr("display", function(d) { 
			if (d.lon == undefined) {return "none";}
		})
		.text(function(d) {
				var formatViews = d3.format(",");
				return countryNameForCode(d.country);
			})
			.attr("alignment-baseline", "middle")
	      	.attr("text-anchor", "middle")
	      	.attr("pointer-events", "none")
	      	.attr("y", -16)
	      	.style("font-size", 16)
	      	.style("opacity", 0.0);

	tooltip.transition()
	    .duration(500)
	    	.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
	    	.text(function(d) {return countryNameForCode(d.country);});

	tooltip.exit()
		.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

}


/**************** Viewers Map ***********************/

// create container for zooming Viewers data	 
var viewersContainer = map.append("g");
var viewersTooltip = map.append("g");

function drawViewersMap(viewers)
{
	var area = d3.scale
		.pow().exponent(.750)
		.domain([1, totalViews])
		.range([2,250]);

	// Viewers By Country
	var selection = viewersContainer.selectAll("circle")
		.data(viewers);

	selection.enter().append("circle")
			.attr("class", mapClasses[2])
			.attr("transform", function(d) {return "translate(" + mapCenter + ")";})
			.attr("display", function(d) { 
				if (d.lon == undefined) {return "none";}
			})
			.attr("r", function(d) {return area(d.viewers);})
			.style("fill", colors[2])
			.style("fill-opacity", 0.2)
			.style("stroke", colors[2])
			.style("stroke-opacity", 0.3)
			.style("stroke-width", 1.0)
			.on("mouseover", handleMouseOverMap)
			.on("mouseout", handleMouseOut);
	
	selection.transition()
		.duration(500)
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("r", function(d) {return area(d.viewers);})

	selection.exit()
		.transition()
			.duration(500)
			.attr("transform", function(d) {return "translate(" + mapCenter + ")";})
			.style("opacity", 0)
			.remove();
}

