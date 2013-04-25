from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import abs as abs_url
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import urllib2, urlparse, socket
import re
import pickle

## open mov_obj to retrieve sites
f = open('mov_obj_final.pickle', 'r')
mov_obj = pickle.load(f)


# a quick function to write the sites dictionary to a file 
#for later use
def sites_pickle(f):
    f.close()
    f = open('sites.pickle', 'w')
    pickle.dump(sites, f)
    f.close()

sites = {}

for x in mov_obj:
    if '1channel' in x:
        for y in x['1channel']:
            if y != None and y != 'HD Sponsor':
                sites[y] = {}
sites_pickle(f)

base = "http://www.alexa.com/siteinfo/"

def getVisByCountry(site):
    countries = {}
    url = URL(base + site)

    aDom = DOM(url.download(cached=True))
    if aDom.by_id("visitors-by-country") is not None:
        vis = aDom.by_id("visitors-by-country")

        countries = {}
        for r in vis.by_class("tr1"):
         if r.by_tag("a")[0].attributes.get("id") == "toggleMoreCountryVisits":
           pass
         else:
           #print r.by_tag("a")[0].content
           country = r.by_tag("a")[0].content.split("&nbsp; ")[1].strip()
           pct = float(r.by_tag("p")[1].content[0:-1])
           #print country, pct
           countries[country] = pct
    sites[site] = countries

for site in sites:
    print "attempting site" + site
    getVisByCountry(site)


import pprint

pprint.pprint(sites)



