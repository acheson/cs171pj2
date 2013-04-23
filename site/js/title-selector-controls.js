/*  
	title-selector-controls.js
	04/21/13
	author: Rob Acheson

	This class creates the controls that interact with the list view of titles and the scatter plot.

	Adapted from:
	http://jqueryui.com/button/#radio
	http://stackoverflow.com/questions/11646947/uncheck-all-jquery-radio-buttonset-at-once
*/

function initTitleControls() {
	// create the inital radio button style
	$("#chart-toggle-radio").buttonset();

	// check and select "list" by default
	$("#chart-radio1").attr("checked", "checked").button("refresh");
	$("#scatter-chart").fadeOut(0);

	// add button listeners
	$("#chart-radio1").click(handleListClick);
	$("#chart-radio2").click(handleScatterClick);
}

function handleListClick() {
	// toggle visibility
	$("#list").fadeIn();
	$("#scatter-chart").fadeOut();
}

function handleScatterClick() {
	// toggle visibility
	$("#list").fadeOut();
	$("#scatter-chart").fadeIn();
}