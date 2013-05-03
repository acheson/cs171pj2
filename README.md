CS171 - Project III

Co-Authored by
Rob Acheson and Jeff Fontas

5/2/2013
README.md

**********************
** Running the code **
**********************
As is the site should be self sufficient and the only special instruction for actually viewing is the run Python's simple HTTP server using the folling command in terminal from within the site folder.

"python -m SimpleHTTPServer 8888 &"

Once this is running, go to "http://localhost:8888/" to see the visualization.

*******************
** Site overview **
*******************
The site consists of a single HTML file, styled by CSS and augmented with many JavaScipt files, most importantly D3.js.  Each section of the visualization has its own Javascript file. 

main.js
*******
 - Manages and coordinates all data sources used in the application
 - Loads JSON data into memory stores unmodified as dataSource  and calls parse()
 - Parse function creates array of Site objects and Array of Film objects
 - These will be used for all charts
 - Parse is set-up so that it can be reused again with a filtered subset of the original JSON object
 - Parse complete - calls initList() updateMap, updateScatter(), updateBar()

section-controls.js
*******************
- Manages presentation of different data in the visualization
- Creates the radio buttons to choose 1Channel, Hosts or Viewers
- Creates and manages the timers used the animate the data

title-selector-controls.js
**************************
- Manages the presentation of the List and the Scatter Plot
- Manages the radio buttons
- Manages select all

list.js
*******
 - populated by parse function in main.js
 - references films array
 - creates a node for each film object
 - filtering creates a list of indices - which are then filtered from films array
 - parse is then called again on this subset which in-turn updates the map and bar chart

 scatter.js
 **********
 - populated by parse
 - acts as a filter to the data set displayed on the map

map.js
******
 - populated by parse
 - refereces sites array
 - creates element for each site object
 - mouse over map elements highlights current dims others
 - finds matching element in bar chart by the site’s name and manages highlighting of bar chart as well

bar.js
******
 - populated by parse
 - draws chars in containers for 1Channel, Sites and Viewers
 - creates element for each object in array

 scatter.js
 **********
 - populated by parse
 - acts as a filter to the data set displayed on the map

*************************
** External Libraries  **
*************************
All libraries are included in the "js" folder.  They include:
- d3.v3.min.js			
- d3.geo.projection.v0.min.js	
- topojson.v0.min.js
- jquery-1.9.1.min.js		
- jquery-ui.js	

******************
** Data Sources **
******************		
All data sources are included in the "data" folder.  They include:		

filmHostsAndIMDB.json
*********************	
This was the primary data set for P2 and provides hosts and IMDb data. This is the product of our scraping script and provided all film and site statistical data

siteTrafficByCountry.json
*************************
This was the prodcut of a new scraping effort for P3.  It contains the viewer data as percentage by coutry for each of the host sites in filmHostAndIMDB.json

coordinatesByCountryCode.json
*****************************
Provides a lookup for country coordinates by country codes
This was manually created from the following spreadsheet.
https://docs.google.com/spreadsheet/ccc?key=0At92oU3FPZ4QdEIwVV8tZGJHRmV6VXV3LWpfQThiUnc&hl=en#gid=0
Using sublime text it was edited and turned into JSON

ch1_ips.json
************
this file was not used in the current implementation, but stores the locations of the 5 1Channel.ch servers

slim-3.json	
***********
A json file used to lookup country names from ISO-3166

world-50m.json
**************
Geojson data file 
