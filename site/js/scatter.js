/*  
	scatter.js
	03/26/13
	authors: Rob Acheson

*/

var width = 340;
var height = 220;
var margin = 20;
var ptRadius = 3;
var scatter = d3.select("div#scatter-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height);   





function updateScatter() {

    var scatterX = d3.scale.pow()
                    .exponent(.50)
                    .domain([0, maxViews])
                    .range([ (0 + margin), (width - margin)]);

    var scatterY = d3.scale.pow()
                    .exponent(.50)
                    .domain([0, maxRatings])
                    .range([ (height - margin), (0 + margin)]);

    scatter.selectAll("circle")
            .data(films)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return scatterX(d.views); })
            .attr("cy", function(d) { return scatterY(d.ratings); })
            .attr("r", ptRadius);

    //scatter,

    var scatterYAxis = d3.svg.axis()
                        .scale(scatterY)
                        .orient("right")
                        .ticks(4)
                        .tickSize(6, 0, 0);

    var scatterXAxis = d3.svg.axis()
                        .scale(scatterX)
                        .orient("top")
                        .ticks(6)
                        .tickSubdivide(4)
                        .tickSize(6, 3, 3);

    scatter.append("g")
        .attr("class", "x scatterAxis")
        .attr("transform", "translate(0," + (scatterY(0) + 10) + ")")
        .call(scatterXAxis);

    scatter.append("g")
        .attr("class", "y scatterAxis")
        //.attr("transform", "translate(0," + (ymax + 10) + ")")
        .call(scatterYAxis);

    //alert(ratingsMax);
}