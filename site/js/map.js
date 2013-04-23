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

	// map zoom adapted from example
	http://bl.ocks.org/d3noob/raw/5193723/

	// changed tooltip text to SVG based on this example
	http://tributary.io/inlet/4132672/

*/

var mapWidth = 880;
var mapHeight = 460;

var projection = d3.geo.mercator()
	.scale(140)
	.translate([mapWidth / 2, 300])
	.precision(.1);

var path = d3.geo.path()
	.projection(projection);

var map = d3.select("div#map-chart")
	.append("svg")
		.attr("width", mapWidth)
		.attr("height", mapHeight)
	
// create a container to zoom	 
var g = map.append("g");
var tt = map.append("g");

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


var zoom = d3.behavior.zoom()
	.scaleExtent([1, 10])
	.on("zoom", function() {
		g.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
		tt.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");

		// keep the text at same size and relative position regardless of scale
		var ttName = tt.selectAll(".name")
			.style("font-size", function() {
				return 20 / d3.event.scale;
			})
			.attr("y", function() {
				return -40 / d3.event.scale;
			});

		var ttViews = tt.selectAll(".views")
			.style("font-size", function() {
				return 16 / d3.event.scale;
			})
			.attr("y", function() {
				return -16 / d3.event.scale;
			});;
					// tt.attr("transform", "translate(" + d3.event.translate.join(",") + ")");
		// tt.attr("transform", "translate(" + d3.event.translate[0] + "," + d3.event.translate[1]+ ")");

		// var tooltip = g.selectAll("g").select("g.name")
		// 	.style("font-size", function() {
		// 		return 20 / d3.event.scale;
		// 	});

		// var tooltip = g.selectAll("g").select("g.views")
		// 	.style("font-size", function() {
		// 		return 16 / d3.event.scale;
		// 	});


		// console.log(d3.event.scale);
		// console.log(d3.event.translate[0]);

		// TODO Keep this centering
		// var centerX = d3.event.translate[0] + 0.5*mapWidth*d3.event.scale;
		// var centerY = d3.event.translate[1] + 0.5*mapHeight*d3.event.scale;

		// console.log(centerX + "," + centerY);
		// TODO Add and update a zoom bar

		// TODO Add a mini - map with rectangle?
	});

map.call(zoom);


function updateMap() {
	var mapMax = d3.max(sites, function(d) {return d.views;});	
	
	// linear scale  - input:domain as output:range
	var area = d3.scale//.sqrt()
		.pow().exponent(.750)
		.domain([1, mapMax])
		// .domain([1, maxViews])
		.range([2,100]);

	// Sort sites so that smaller ones always appear on top of larger
	// create a copy of sites to sort
	var sortedSites = sites.slice(0);
	sortedSites.sort(function(a, b) {
    	return d3.descending(a.views, b.views);
    });

	var selection = g.selectAll("circle")
		.data(sortedSites);

	// var div = d3.select("body").append("div")
 //    	.attr("class", "tooltip")               
 //   		.style("opacity", 0);

	selection.enter().append("circle")
			.attr("class", "map-mark")
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("display", function(d) { 
				if (d.lon == undefined) {return "none";}
			})
			.attr("r", function(d) {return area(d.views);})
			.style("fill", "red")
			.style("fill-opacity", 0.2)
			.style("stroke", "red")
			.style("stroke-opacity", 0.3)
			.style("stroke-width", 1.0)
			.on("mouseover", handleMouseOverMap)
			.on("mouseout", handleMouseOut);
	
	selection.transition()
		.duration(500)
			.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
			.attr("r", function(d) {return area(d.views);});

	selection.exit()
		.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();

	// var tooltip = g.selectAll("text")
	// 	.data(sortedSites);

	// tooltip.enter().append("text")
	// 	.attr("class", "name")
	// 	.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
	// 	.attr("display", function(d) { 
	// 		if (d.lon == undefined) {return "none";}
	// 	})
	// 	.text(function(d) {return d.name;})
	// 	.attr("alignment-baseline", "middle")
 //      	.attr("text-anchor", "middle")
 //      	.attr("pointer-events", "none")
 //      	.style("font-size", 20)
 //      	.style("opacity", 0.0);

 //    tooltip.enter().append("text")
	// 	.attr("class", "views")
	// 	.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat	]) + ")";})
	// 	.attr("display", function(d) { 
	// 		if (d.lon == undefined) {return "none";}
	// 	})
	// 	.text(function(d) {return d.views;})
	// 	.attr("alignment-baseline", "middle")
 //      	.attr("text-anchor", "middle")
 //      	.attr("pointer-events", "none")
 //      	.style("font-size", 16)
 //      	.style("opacity", 0.0);

var tooltip = tt.selectAll("g")
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
	      	.attr("y", -40)
	      	.style("font-size", 20)
	      	.style("opacity", 1.0);

    tooltip.enter().append("text")
		.attr("class", "views")
		.attr("transform", function(d) {return "translate(" + projection([d.lon,d.lat]) + ")";})
		.attr("display", function(d) { 
			if (d.lon == undefined) {return "none";}
		})
		
			.text(function(d) {return d.views;})
			.attr("alignment-baseline", "middle")
	      	.attr("text-anchor", "middle")
	      	.attr("pointer-events", "none")
	      	.attr("y", -16)
	      	.style("font-size", 16)
	      	.style("opacity", 1.0);

}























function handleMouseOverMap(e) {
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

	var currentTextMark = barChart.selectAll("text")
        .filter( function(d) { 
            if (d.name == e.name) {
                // console.log("match")
                return this;
            }
        });
    highlightText(e, currentTextMark);

    var currentTooltip = tt.selectAll("text") 
    	.filter( function(d) {
    		// d = d.select("text");
    		if (e.name == d.name) {
    			console.log("match")
    			return this;
    		};
    	});
    	highlightTooltip(e, currentTooltip);
}

function handleMouseOut(e) {
	var selection = map.selectAll("circle")
		.transition()
			.duration(250)
			.style("fill", "red")
			.style("fill-opacity", 0.2)
			.style("stroke", "red")
			.style("stroke-opacity", 0.3);

	// var div = d3.selectAll(".tooltip")   
	// div.transition()        
 //        .duration(250)      
 //        .style("opacity", 0)
 //        .remove();

    var selection = barChart.selectAll("rect")
		.transition()
			.duration(250)
			.style("fill", "red")
			.style("fill-opacity", 0.2)
			.style("stroke", "red")	
  			.style("stroke-opacity", 0.3);

  	var selection = barChart.selectAll("text")
		.transition()
			.duration(250)
			.style("fill", "black");

	var tooltip = tt.selectAll("g")
		.transition()
			.duration(250)
			.style("opacity", 0.0);
}


// function highlightTooltip(e, obj) {
// 	var tooltip = g.selectAll("text")
// 		.transition()
// 			.duration(250)
// 			.style("opacity", 0.0);

// 		obj.transition()
// 			.duration(250)
// 			.style("opacity", 1);			
// }
function highlightTooltip(e, obj) {
	var tooltip = tt.selectAll("text")
		.transition()
			.duration(250)
			.style("opacity", 0.0);

			console.log(obj);

		obj.transition()
			.duration(250)
			.style("opacity", 1);			
}


function highlightMap(e,obj) {
	var currentProjection = projection([e.lon,e.lat]);

	// deselect others
	var selection = map.selectAll("circle")
		.transition()
			.duration(250)
			.style("fill", "#888")	
			.style("fill-opacity", 0.2)
			.style("stroke", "#888")
			.style("stroke-opacity", 0.3);

	// highlight current
	obj.transition()
		.duration(250)
		.style("fill", "red")
		.style("fill-opacity", 0.5)
		.style("stroke", "red")
		.style("stroke-opacity", 1.0);
  
	// var div = d3.select("div#map-chart").append("div")     
 //    	.attr("class", "tooltip")               
 //    	.style("opacity", 0);

 //    div.transition()        
 //        .duration(250)      
 //        .style("opacity", .9);

 //    var formatViews = d3.format(",");
	// div.html("<h3>" + e.name + "</h3>" + formatViews(e.views) + " views</br>" + countryNameForCode(e.country))  
 //        .style("left", (currentProjection[0] - 130) + "px")   
 //        .style("top", (currentProjection[1] - 80) + "px");  

    
}






