/*  
	main.js
	03/25/13
	author: Rob Acheson

*/

/* love this! */
function dumpObject(o) {
	out = "";
	for (i in o) {
		out += i +":" + o[i] +"\n";
	}
	alert(out);
}

/* default film object */
function Film() {
	this.title = "";
	this.ratings = 0;
	this.views = 0;
	this.siteNames = {};
}
/* array of films by rank - 1 */
var films = [];

/* default site object */
function Site() {
	this.name = "";
	this.country = "";
	this.lat = "";
	this.lon = "";
	this.views = 0;
}

/* dictionary of sites by name 
	Becomes an array sorted alphabetically after parse
*/
var sites = {};

function updateViews() {
	
	console.log("updateViews");

	initList();
	updateMap();
	updateScatter();
	updateBar();
}

var totalViews = 0;
var totalRatings = 0;

d3.json("../data/data.json", jsonComplete);

/* Stores the JSON data */
var dataSource;

function jsonComplete(d) {
	dataSource = d;
	parse(dataSource);
}


/*  
	Parses a data object and updates all views
	
	Pass a subset for filtering
 */
function parse(data) {
	console.log("parse start");
	for (var d in data) {
		
		// create a new film object
		var film = new Film();
		
		// set some properties
		film.title = data[d]["title"];
		film.ratings = data[d]["IMDB"]["RatingCount"];
		totalRatings += data[d]["IMDB"]["RatingCount"];

		// get 1channel object and iterate
		var channels = data[d]["1channel"];
		for (var ch in channels) {
			
			// create a new site object or get reference to existing in dictionary
			var site;
			if (sites[ch.toString()]) {
				site = sites[ch.toString()];
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

	// parsing complete, tell the world!
	console.log("parse complete");
	updateViews();


	/*
	// Keeping it real - Checks totals
	var checkFilmViews = 0;
	for (var f in films) {
		checkFilmViews += films[f].views;
	}

	var checkFilmRatings = 0;
	for (var f in films) {
		checkFilmRatings += films[f].ratings;
	}

	var checkSiteViews = 0;
	for (var s in sites) {
		checkSiteViews += sites[s].views;
	}
	console.log(totalViews + " " + checkSiteViews + " " + checkFilmViews);
	console.log(totalRatings + " " + checkFilmRatings);
	*/

}

