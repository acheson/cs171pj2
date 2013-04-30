/*  
	main.js
	03/25/13
	authors: Rob Acheson
			Jeff Fontas


	"../data/slim-3.json" data courtesy of https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes

*/

/* default film object */
function Film() {
	this.title = "";
	this.ratings = 0;
	this.rank = 0;
	this.views = 0;
	this.siteNames = {};
}

/* default site object */
function Site() {
	this.name = "";
	this.country = "";
	this.lat = "";
	this.lon = "";
	this.views = 0;
}

/* Calculated Data */
var totalViews = 0;
var totalRatings = 0;
var maxViews = 0;
var	maxRatings = 0;
 

/* Flag to suspend parsing on certain UI actions */
var shouldParse = true;

/* dictionary of sites by name - Becomes an array sorted alphabetically after parse */
var sites = {};

/* Populated by slim-3.json, used as a lookup for country name to country code and vice-versa */
var countryCodesAndNames;

/* Pouplated by filmHostsAndIMDB.json, stores the main JSON data collected from 1Channel.ch and IMDB */
var filmData;

/* Populated by siteTrafficByCountry.json, stores viewer breakdown by site by country as percentage */
var siteTrafficByCountryName;

/* Populated by coordinatesByCountryCode.json, used as a lookup for lat/long coordinates by input country code */
var countryCodesAndCoordinates;

/* Populated by computeViews function, array of dictionaries, each holds "country_name", "country_code", "viewers", "lat", "lon" */
var viewers = []; 

/* The following functions load JSON files in sequence to ensure that all data is loaded before action begins */

// Start the process - load and parse country code lookup JSON
d3.json("../data/slim-3.json", countryCodesAndNamesComplete);

function countryCodesAndNamesComplete(d) {
	countryCodesAndNames = d;
	d3.json("../data/coordinatesByCountryCode.json", countryCodesAndCoordinatesComplete);
}

function countryCodesAndCoordinatesComplete(d) {
	countryCodesAndCoordinates = d;
	d3.json("../data/siteTrafficByCountry.json", siteTrafficByCountryNameComplete);
}

function siteTrafficByCountryNameComplete(d) {
	siteTrafficByCountryName = d;
	d3.json("../data/filmHostsAndIMDB.json", filmHostsAndIMDBComplete);
}

function filmHostsAndIMDBComplete(d) {
	filmData = d;
	parse(filmData);
	
	/*  The following functions only need to be called once and are not data dependent
		Functions based on data should be called at the end of parse()
	*/
	initList();
	initSectionControls();
	initTitleControls();
}


/* Lookup functions */

function countryNameForCode(code) {
	for (var k in countryCodesAndNames) {
		if  (countryCodesAndNames[k]["alpha-3"] == code) {
			return countryCodesAndNames[k]["name"];
		};
	}
	return "";
}

function countryCodeForName(name) {
	for (var k in countryCodesAndNames) {
		if  (countryCodesAndNames[k]["name"] == name) {
			return countryCodesAndNames[k]["alpha-3"];
		};
	}
	return "";
}


/* love this! */

function dumpObject(o) {
	out = "";
	for (i in o) {
		out += i +":" + o[i] +"\n";
	}
	alert(out);
}


/* Parses filmData object and updates all views - Pass a subset for filtering */
function parse(data) {
	totalViews = 0;
	totalRatings = 0;

	films = [];
	sites = {};

	for (var d in data) {
		
		// create a new film object
		var film = new Film();
		
		// set some properties
		film.title = data[d]["title"];
		film.rank = data[d]["Rank"];
		film.ratings = data[d]["IMDB"]["RatingCount"];
		totalRatings += data[d]["IMDB"]["RatingCount"];

		//get max number of ratings for a movie
		maxRatings = data[d]["IMDB"]["RatingCount"] > maxRatings ? data[d]["IMDB"]["RatingCount"] : maxRatings;

		// get 1channel object and iterate
		var channels = data[d]["1channel"];
		for (var ch in channels) {
			
			// create a new site object or get reference to existing in dictionary
			var site;
			if (sites[ch.toString()]) {
				site = sites[ch.toString()];
			}
			// ignore sponsored content
			else if (ch.toString() == "HD Sponsor") {
				continue;
			}
			else {
				site = new Site();
			}
			
			// populate site		
			site.name = ch.toString();
			site.country = channels[ch]["Location"]["country_code3"];
			site.lat = channels[ch]["Location"]["Lat"];
			site.lon = channels[ch]["Location"]["Lon"];
			site.views += channels[ch]["Views"];
			
			// update film views count
			film.views += channels[ch]["Views"];

			// maxViews is the maximum views for all movies
			maxViews = film.views > maxViews ? film.views : maxViews;
			
			// add the site name key to the films dictionary with views value
			film.siteNames[site.name] = channels[ch]["Views"];

			// update site in sites dictionary
			sites[site.name] = site;

			// update total views for all titles
			totalViews += channels[ch]["Views"];
		}	
		// add the film to the array
		films.push(film);	
	}
	
	// turn sites into an array so D3 can work with it easier
	var keys = Object.keys(sites);
	keys = keys.sort();
	var temp = [];
	for (var i = 0; i < keys.length; i++) {
		temp[i] = sites[keys[i]]
	};
	sites = temp;
	
	computeViews(sites);
	updateViews();
}


/* calculates views by country, takes sites variable as input */
function computeViews(sites) {
	
	/* Dictionary storing number of views, accessed by country name key */
	var viewerCount = {};

	//build a list of all countries with data is siteTraffic from alexa, calc number of views
	for (site in sites) {
		// console.log(sites[site].name);
		// console.log(sites[site].lat);
		// console.log(sites[site].lon);
		for (country in siteTrafficByCountryName[sites[site].name]) {
			// alert(siteTrafficByCountryName[object[site].name][country]);
			if (!(country in viewerCount)) {
				viewerCount[country] = 0;
			}
			
			viewerCount[country] += (sites[site].views * (siteTrafficByCountryName[sites[site].name][country])/100);
		}
	}
	viewers = [];
	for (ctry in viewerCount) {
		cCode = countryCodeForName(ctry); //country code
		cLat = countryCodesAndCoordinates[cCode]["lat"]; // country latitude
		cLon = countryCodesAndCoordinates[cCode]["lon"]; // country latitude
		
		viewers.push({"country_name":ctry, "country_code":cCode, "viewers":viewerCount[ctry], "lat":cLat, "lon":cLon});
		// viewers.push([ctry, cCode, viewerCount[ctry], cLat, cLon]);
	}
	// return viewers;
}

/*  Used to update all linked views with new data */
function updateViews() {
	updateMap();
	updateScatter();
	updateBar();
}


