/*  
	scatter.js
	03/26/13
	authors: Rob Acheson

*/

var width = 340;
var height = 220;
var tmargin = 20;
var lmargin = 40;
var bmargin = 40;
var rmargin = 20;
var ptRadius = 3;
var scatter = d3.select("div#scatter-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height);   





function updateScatter() {

    var scatterX = d3.scale
                    .linear()
                    // .pow().exponent(.50)
                    .domain([0, maxViews])
                    .range([ (0 + lmargin), (width - rmargin)]);

    var scatterY = d3.scale
                    .linear()
                    // .pow().exponent(.50)
                    .domain([0, maxRatings])
                    .range([ (height - bmargin), (0 + tmargin)]);

    var circle = scatter.selectAll("circle")
            .data(films)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return scatterX(d.views); })
            .attr("cy", function(d) { return scatterY(d.ratings); })
            .attr("r", ptRadius);

    //scatter,

    var scatterYAxis = d3.svg.axis()
                        .scale(scatterY)
                        .orient("left")
                        .tickFormat(d3.format("s"))
                        .ticks(5)
                        .tickSubdivide(4)
                        .tickSize(6, 3, 3);

    var scatterXAxis = d3.svg.axis()
                        .scale(scatterX)
                        .orient("bottom")
                        .tickFormat(d3.format("s"))
                        .ticks(6)
                        .tickSubdivide(4)
                        .tickSize(6, 3, 3);


    scatter.append("g")
        .attr("class", "x scatterAxis")
        .attr("transform", "translate(0.5," + (scatterY(0) + 0.5) + ")")
        .call(scatterXAxis);

    scatter.append("g")
        .attr("class", "y scatterAxis")
        .attr("transform", "translate(" +  (scatterX(0)+ 0.5) + ", 0.5)")
        .call(scatterYAxis);

    //alert(ratingsMax);
    scatter.append("g")
        .attr("class", "brush")
        .call(d3.svg.brush().x(scatterX).y(scatterY)
        .on("brushstart", brushstart)
        .on("brush", brushmove)
        .on("brushend", brushend));

    function brushstart() {
      scatter.classed("selecting", true);
    }

    function brushmove() {
      var e = d3.event.target.extent();
      circle.classed("selected", function(d) {
        return e[0][0] <= d.views && d.views <= e[1][0]
            && e[0][1] <= d.ratings && d.ratings <= e[1][1];
      });
      // circle.selectAll(".selected")
      //       .data(function(d) { return console.log(d.views.toString(), d.ratings.toString(), d.title)})
     

    }

    function brushend() {
      scatter.classed("selecting", !d3.event.target.empty());
    }

}