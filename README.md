CS171 - Project II

Co-Authored by
Rob Acheson and Jeff Fontas

4/8/2013
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
 - Loads JSON data into memory stores unmodified as dataSource  and calls parse()
 - Parse function creates array of Site objects and Array of Film objects
 - These will be used for all charts
 - Parse is set-up so that it can be reused again with a filtered subset of the original JSON object
 - Parse complete - calls initList() updateMap, updateScatter(), updateBar()

list.js
*******
 - populated by parse function in main.js
 - references films array
 - creates a node for each film object
 - filtering creates a list of indices - which are then filtered from films array
 - parse is then called again on this subset which in-turn updates the map and bar chart

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
 - refereces sites array
 - creates element for each site object

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

data.json
*********	
This is the product of our scraping script and provided all film and site statistical data.

slim-3.json	
***********
A json file used to lookup country names from ISO-3166

world-50m.json
**************
Geojson data file 
