/*  
	list.js
	03/26/13
	author: Rob Acheson
*/




function initList() {
	var list = d3.select("div#list").append("ol")
	.attr("id", "selectable");
	var li = list.selectAll("li")
		.data(films)
		.enter()
		.append("li")
		.attr("class", "ui-widget-content")
		.text( function(d) { return d.title} );

	$(function() {
		$( "#selectable" ).selectable({
     		stop: function() {
        		
        		var result = $( "#select-result" ).empty();
        		$( ".ui-selected", this ).each(function() {
          			var index = $( "#selectable li" ).index( this );
          			result.append( " #" + ( index + 1 ) );
        		});
        		updateMap();
			}
		});
	});
}

