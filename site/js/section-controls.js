/*  
	section-controls.js
	04/25/13
	author: Rob Acheson

	Timer adapted from example
	http://www.w3schools.com/js/js_timing.asp

*/

// timeout in ms
var timeoutTime = 1500;

var timer; 

// keeps track of sections 
// 1 - 1Channel.ch
// 2 - Host Sites
// 3 - Viewers
var currentSection = 1;

function initSectionControls() {
	console.log("init");
	// create the inital radio button style
	$("#section-radio").buttonset();

	// check and select "list" by default
	// $("#section-radio1").attr("checked", "checked").button("refresh");
	
	// add button listeners
	$("#section-radio1").click(sectionControlClick);
	$("#section-radio2").click(sectionControlClick);
	$("#section-radio3").click(sectionControlClick);

	showSection(1);
}

function sectionControlClick(e) {
	showSection(e.target.value);
	killSectionTimer();
	$("#section-animate").removeAttr("checked");
}

function nextSection() {
	currentSection ++;
	if (currentSection > 3) {
		currentSection = 1;
	};
	return currentSection;
}

function startSectionTimer() {
	console.log("start");
	timer = setTimeout(function() {
		timerComplete()
	}, timeoutTime);
}

function killSectionTimer() {
	console.log("kill");
	clearTimeout(timer);
	timer = null;
}

function timerComplete() {
	console.log("complete");
	showSection(nextSection());
}

function showSection(section) {
	$("section-radio input").removeAttr("checked");

	var sectionSelector = "#section-radio" + section;
	$(sectionSelector).attr("checked", "checked").button("refresh");
	
	$("#story-text").text(section);

	if ($("#section-animate").prop("checked")) {
		startSectionTimer();
	}
}

// $("#section-animate").click(function() {
// 	if ($(this).prop("checked")) {
		
// 	}
// });

$("#section-animate").change(function() {
	if ($(this).prop("checked")) {
		console.log("check");
		startSectionTimer();
	}
	else {
		killSectionTimer();
		console.log("uncheck");
	}
});





