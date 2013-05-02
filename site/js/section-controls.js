/*  
	section-controls.js
	04/25/13
	author: Rob Acheson

	Timer adapted from example
	http://www.w3schools.com/js/js_timing.asp

*/

// timeout in ms
var timeoutTime = 3000;
var timer; 

// keeps track of sections 
// 0 - Host Sites
// 1 - 1Channel.ch
// 2 - Viewers
var text1Channel = "1channel.ch is one of the highest-ranked streaming sites on the Internet.  For just the top 250 movies on IMDB (the site links to tens of thousands), 1channel was responsible for over 18 million views across over 40 hosts. The map view provides a look at the total number of views in our dataset.";
var textHosts = "The indexing model would not work without hosts to host content.  This view shows who the hosts are that served the content linked to on 1channel.ch.  We aggregated all of the views up to the site level, and geocoded the IP addresses for the hosts to be able to present their location on a map.  The needs of most viewers of this content are served by two main websites, putlocker.com and sockshare.com, and by a few countries in Europe.";
var textViewers = "Alexa provides demographic data for web pages, including percentage of visitors by country.  Using this data, we calculated the number of views by country and aggregated them for all the hosts in our dataset.  Viewers, unlike hosts, are distributed all over the world.  The United States, which has some of the strictest copyright laws, also has the most views.";
var currentSection = 1;
var incrementing = true;

function initSectionControls() {
	// create the inital radio button style
	$("#section-radio").buttonset();

	// check and select "list" by default
	// $("#section-radio1").attr("checked", "checked").button("refresh");
	
	// add button listeners
	$("#section-radio0").click(sectionControlClick);
	$("#section-radio1").click(sectionControlClick);
	$("#section-radio2").click(sectionControlClick);

	showSection(1);
}

function sectionControlClick(e) {
	showSection(e.target.value);

	killSectionTimer();
	$("#section-animate").removeAttr("checked");
}

function nextSection() {
	if (incrementing === true) {
		currentSection ++;
		if (currentSection > 2) {
			currentSection = 1;
			incrementing = false;
		};	
	}
	else {
		currentSection --;
		if (currentSection < 0) {
			currentSection = 1;
			incrementing = true;
		};	
	}
	
	return currentSection;
}

function startSectionTimer() {
	timer = setTimeout(function() {
		timerComplete()
	}, timeoutTime);
}

function killSectionTimer() {
	clearTimeout(timer);
	timer = null;
}

function timerComplete() {
	showSection(nextSection());
}

function showSection(section) {
	transitionToSection(section);

	$("section-radio input").each().removeAttr("checked");

	// var sectionSelector = "#section-radio" + section;
	$("#section-radio" + section).attr("checked", "checked").button("refresh");
	
	$("#story-text").text(function (d) {
		if (section == 0) {
    		return textHosts;
    	} 
	    else if (section == 1) {
	        return text1Channel;
	    } 
	    else {
		    return textViewers;
		}
	});

	if ($("#section-animate").prop("checked")) {
		startSectionTimer();
	}
}

function transitionToSection(section) {
	if (section == 0) {
		drawOneChannelMap([]);
		drawSitesMap(sites);
		drawViewersMap([]);

		drawSitesBar(sites);
		drawViewersBar([]);
	}
	else if (section == 1) {
		drawOneChannelMap([totalViews]);
		drawSitesMap([]);
		drawViewersMap([]);

		drawSitesBar([]);
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
	if ($(this).prop("checked")) {
		startSectionTimer();
	}
	else {
		killSectionTimer();
	}
});





