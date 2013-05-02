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

var mapCenter = projection([0,30]);

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
var g = map.append("g").classed("zoom", true);

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
	
	if (currentSection == 1) { return ;};

	var currentMapMark = d3.select(this);
	highlightMap(e, currentMapMark);

	// find matching bar and highlight
	var barBar = d3.selectAll(".bar-mark")
		.filter( function(d) {
			if (d.name == e.name) {
				return this;
			}
		});
	highlightBar(e, barBar);

 	var currentTextMark;
 	if (currentSection == 0) {
 		currentTextMark = barChartSites.selectAll("text")
 			.filter( function(d) { 
        if (d.name == e.name) {
            return this;
        }
    });
    highlightText(e, currentTextMark);
 	}
 	else if (currentSection == 2) {
 		currentTextMark = barChartViewers.selectAll("text")
 		.filter( function(d) { 
        if (d.name == e.name) {
            return this;
        }
    });
    highlightText(e, currentTextMark);
 	}
 	
    currentTextMark.filter( function(d) { 
        if (d.name == e.name) {
            return this;
        }
    });
    highlightText(e, currentTextMark);

    // Coordinate tooltip
    var selection;
	if (currentSection == 0) {
		selection = sitesTooltip.selectAll("text");
	}
	else if (currentSection == 1) {
		selection = channelTooltip.selectAll("text");
	}
	else {
		selection = viewersTooltip.selectAll("text");
	};
	var tooltip = selection.filter( function(d) {
    	if (e.name == d.name) {
    		return this;
    	};
    });
    highlightTooltip(e, tooltip);
}

function highlightMap(e,obj) {

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

	// Coordinate tooltip
	var selection;
	if (currentSection == 0) {
		selection = sitesTooltip.selectAll("text");
	}
	else if (currentSection == 1) {
		selection = channelTooltip.selectAll("text");
	}
	else {
		selection = viewersTooltip.selectAll("text");
	};
	var tooltip = selection.filter( function(d) {
    	if (e.name == d.name) {
    		return this;
    	};
    });
    highlightTooltip(e, tooltip);
}

function highlightTooltip(e, obj) {
	
	var tooltip;
	if (currentSection == 0) {
		tooltip = sitesTooltip.selectAll("text");
	}
	else if (currentSection == 1) {
		tooltip = channelTooltip.selectAll("text");
	}
	else {
		tooltip = viewersTooltip.selectAll("text");
	};
	tooltip.transition()
		.duration(250)
		.style("opacity", 0.0);

	obj.transition()
		.duration(250)
		.style("opacity", 1);			
}


function handleMouseOut(e) {
	
	if (currentSection == 1) { return ;};

	var fillOpacity;
	if (currentSection == 0) { fillOpacity = 0.1}
	else if (currentSection == 2) { fillOpacity = 0.2};

	var selection = map.selectAll("circle." + mapClasses[currentSection])//	.classed(mapClasses[currentSection], true)
		.transition()
			.duration(250)
			.style("fill", colors[currentSection])
			.style("fill-opacity", fillOpacity)
			.style("stroke", colors[currentSection])
			.style("stroke-opacity", 0.3);

    var selection;
    if (currentSection == 0) {
    	selection = barChartSites.selectAll("rect")
    }
    else if (currentSection ==2) {
    	selection = barChartViewers.selectAll("rect")
    };	
    selection.transition()
			.duration(250)
			.style("fill", colors[currentSection])
			.style("fill-opacity", 0.2)
			.style("stroke", colors[currentSection])	
  			.style("stroke-opacity", 0.3);


    // var selection = barChart.selectAll("rect")
	selection.transition()
			.duration(250)
			.style("fill", colors[currentSection])
			.style("fill-opacity", 0.2)
			.style("stroke", colors[currentSection])	
  			.style("stroke-opacity", 0.3);

  // 	var selection = barChart.selectAll("text")
		// .transition()
		// 	.duration(250)
		// 	.style("fill", "black");
	
	var selection;
    if (currentSection == 0) {
    	selection = barChartSites.selectAll("text")
    }
    else if (currentSection == 2) {
    	selection = barChartViewers.selectAll("text")
    };
    selection.transition()
		.duration(250)
		.style("fill", "black");	

	var tooltip;
	if (currentSection == 0) {
		tooltip = sitesTooltip.selectAll("text");
	}
	else if (currentSection == 1) {
		tooltip = channelTooltip.selectAll("text");
	}
	else {
		tooltip = viewersTooltip.selectAll("text");
	};
	tooltip.transition()
		.duration(250)
		.style("opacity", 0.0);
}


/* Zoom functionality */
var zoom = null;
function initZoom() {
	zoom = d3.behavior.zoom()
		.scaleExtent([1, 5])
		.on("zoom", function() {
			
			var selection = d3.selectAll(".zoom");
			selection.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
			
			// keep the text at same size and relative position regardless of scale
			selection.selectAll(".name")
				.style("font-size", function() {
					return 20 / d3.event.scale;
				})
				.attr("y", function() {
					return -50 / d3.event.scale;
				});
			selection.selectAll(".data")
				.style("font-size", function() {
					return 16 / d3.event.scale;
				})
				.attr("y", function() {
					return -32 / d3.event.scale;
				});
			selection.selectAll(".country")
				.style("font-size", function() {
					return 16 / d3.event.scale;
				})
				.attr("y", function() {
					return -16 / d3.event.scale;
				});
		});
}
initZoom();
map.call(zoom);

d3.select("#map-reset").on("click", resetZoom);
function resetZoom() {
	zoom.translate([0,0]).scale(0);
    var selection = d3.selectAll(".zoom") 
    	.transition()
    	.duration(500)
    	.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale + ")");
	
    selection.selectAll(".name")
		.style("font-size", function() {
			return 20;
		})
		.attr("y", function() {
			return -50;
		});
	selection.selectAll(".data")
		.style("font-size", function() {
			return 16;
		})
		.attr("y", function() {
			return -32;
		});
	selection.selectAll(".country")
		.style("font-size", function() {
			return 16;
		})
		.attr("y", function() {
			return -16;
		});

	initZoom();
	map.call(zoom);
};


/*************** 1Channel Section ******************/

// create for zooming Sites data	 
var channelContainer = map.append("g").attr("class", "zoom");
var channelTooltip = map.append("g").attr("class", "zoom");


function drawOneChannelMap(data)
{
	var area = d3.scale
		.pow().exponent(.750)
		.domain([1, maxViews])
		.range([2,50]);
	
	var selection = channelContainer.selectAll("circle")
		.data(data);

	selection.enter().append("circle")
			.attr("r", 0)	
			.attr("class", mapClasses[1])
			.attr("transform", "translate(" + mapCenter + ")")
			.style("fill", colors[1])
			.style("fill-opacity", 0.5)
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

	var tooltip = channelTooltip.selectAll("text")
		.data(data);

	var formatViews = d3.format(",");

	tooltip.enter().append("text")
		.attr("transform", function(d) {return "translate(" + mapCenter + ")";})
		.text(function(d) {return formatViews(d) + " Total Views";})
			.attr("alignment-baseline", "middle")
	      	.attr("text-anchor", "middle")
	      	.attr("pointer-events", "none")
	      	.style("font-size", 48)
	      	.style("opacity", 0);

	tooltip.transition()
	    .duration(500)
	    	.attr("transform", function(d) {return "translate(" + mapCenter + ")";})
	    	.text(function(d) {return formatViews(d) + " Total Views";})
	    	.style("opacity", 1);

	tooltip.exit()
		.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

	      	
}



/*****************  Map Sites *********************/

// create for zooming Sites data	 
var sitesContainer = map.append("g").attr("class", "zoom");
var sitesTooltip = map.append("g").attr("class", "zoom");


function drawSitesMap(sites) {
	var mapMax = d3.max(sites, function(d) {return d.views;});

	var area = d3.scale
		.pow().exponent(.750)
		.domain([1, maxViews])
		.range([2,50]);

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
			.style("fill-opacity", 0.1)
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

	var tooltip = sitesTooltip.selectAll("text.name")
		.data(sortedSites);

	tooltip.enter().append("text")
		.attr("class", "name")
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

	tooltip = sitesTooltip.selectAll("text.data")
		.data(sortedSites);
    
    tooltip.enter().append("text")
		.attr("class", "data")
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

	tooltip = sitesTooltip.selectAll("text.country")
		.data(sortedSites);
    
    tooltip.enter().append("text")
		.attr("class", "country")
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
var viewersContainer = map.append("g").attr("class", "zoom");
var viewersTooltip = map.append("g").attr("class", "zoom");

function drawViewersMap(viewers)
{
	var mapMax = d3.max(viewers, function(d) {return d.viewers;});

	var area = d3.scale
		.pow().exponent(.750)
		.domain([1, maxViewers])
		.range([2,50]);


	// Sort viewers so that smaller ones always appear on top of larger
	// create a copy of viewers to sort
	var sortedViewers = viewers.slice(0);
	sortedViewers.sort(function(a, b) {
    	return d3.descending(a.viewers, b.viewers);
    });

	// Viewers By Country
	var selection = viewersContainer.selectAll("circle")
		.data(sortedViewers);

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


	/*  Viewers Tooltip */
	var tooltip = viewersTooltip.selectAll("text.name")
		.data(sortedViewers);

	tooltip.enter().append("text")
		.attr("class", "name")
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

	tooltip = viewersTooltip.selectAll("text.data")
		.data(sortedViewers);
    
    tooltip.enter().append("text")
		.attr("class", "data")
		.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
		.attr("display", function(d) { 
			if (d.lon == undefined) {return "none";}
		})
		.text(function(d) {
				var formatViews = d3.format(",");
				return formatViews(d.viewers) + " views";
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
				return formatViews(Math.round(d.viewers)) + " views";
			});

	tooltip.exit()
		.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

	tooltip = viewersTooltip.selectAll("text.country")
		.data(viewers);
    
    tooltip.enter().append("text")
		.attr("class", "country")
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

