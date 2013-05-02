/*  
	section-controls.js
	04/25/13
	author: Rob Acheson

	Timer adapted from example
	http://www.w3schools.com/js/js_timing.asp

*/

// timeout in ms
var timeoutTime = 2000;
var timer; 

// keeps track of sections 
// 0 - Host Sites
// 1 - 1Channel.ch
// 2 - Viewers
var text1Channel = "1channel.ch is one of the highest-ranked streaming sites on the Internet.  For just the top 250 movies on IMDB (the site links to tens of thousands), 1channel was responsible for over 18 million views across over 40 hosts. The map view provides a look at the total number of views in our dataset.";
var textHosts = "The indexing model would not work without hosts to host content.  This view shows who the hosts are that served the content linked to on 1channel.ch.  We aggregated all of the views up to the site level, and geocoded the IP addresses for the hosts to be able to present their location on a map.  The needs of most viewers of this content are served by two main websites, putlocker.com and sockshare.com, and by a few countries in Europe.";
var textViewers = "Alexa provides demographic data for web pages, including percentage of visitors by country.  Using this data, we calculated the number of views by country and aggregated them for all the hosts in our dataset.  Viewers, unlike hosts, are distributed all over the world.  The United States, which has some of the strictest copyright laws, also has the most views.";
var currentSection = 0;
// var incrementing = true;
var animating = false;

function initSectionControls() {
	// create the inital radio button style
	$("#section-radio").buttonset();

	// add button listeners
	$("#section-radio0").click(sectionControlClick);
	$("#section-radio1").click(sectionControlClick);
	$("#section-radio2").click(sectionControlClick);

	showSection(0);
}

function sectionControlClick(e) {
	console.log("controlClicked");
	showSection(e.target.value);

	killSectionTimer();
	$("#section-animate").removeAttr("checked");
}

function nextSection() {

	currentSection++;
	if (currentSection > 2) {
		currentSection = 0;
	};
	return currentSection;
}

function startSectionTimer() {
	animating = true;
	timer = setTimeout(function() {
		timerComplete()
	}, timeoutTime);
}

function killSectionTimer() {
	animating = false;
	clearTimeout(timer);
	timer = null;
}

function timerComplete() {
	showSection(nextSection());
}

function showSection(section) {
	shouldUpdateViews = true;

	if (section == 0) {	
		$("#section-radio0").prop("checked", "checked").button("refresh");
		$("#channel-img").delay(250).fadeIn();
		$("#sitesDescription").fadeOut();
		$("#viewersDescription").fadeOut();
	};
	if (section == 1) {
		$("#section-radio1").prop("checked", "checked").button("refresh");
		$("#channel-img").fadeOut();
		$("#viewersDescription").fadeOut();
		$("#sitesDescription").delay(250).fadeIn();
		
	};
	if (section == 2) {	
		$("#section-radio2").prop("checked", "checked").button("refresh");
		$("#channel-img").fadeOut();
		$("#sitesDescription").fadeOut();
		$("#viewersDescription").delay(250).fadeIn();
	};

	$("#story-text").text(function (d) {
		if (section == 0) {
    		return text1Channel;
    	} 
	    else if (section == 1) {
	        return textHosts;
	    } 
	    else {
		    return textViewers;
		}
	});

	if ($("#section-animate").prop("checked")) {
		startSectionTimer();
	}
	transitionToSection(section);
}

function transitionToSection(section) {
	console.log("transitionTo");
	if (section == 0) {
		drawOneChannelMap([totalViews]);
		drawSitesMap([]);
		drawViewersMap([]);

		drawSitesBar([]);
		drawViewersBar([]);
	}
	else if (section == 1) {
		drawOneChannelMap([]);
		drawSitesMap(sites);
		drawViewersMap([]);

		drawSitesBar(sites);
		drawViewersBar([]);
	}
	else if (section == 2) {
		drawOneChannelMap([]);
		drawSitesMap([]);
		drawViewersMap(viewers);

		drawSitesBar([]);
		drawViewersBar(viewers);
	};

	currentSection = section;
}

$("#section-animate").change(function() {
	killSectionTimer();
	if ($(this).prop("checked")) {
		showSection(0);
		incrementing = false;
		resetZoom();
	}
});





