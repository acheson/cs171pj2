from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import abs as abs_url
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import urllib2, urlparse, socket
import re


url = URL ("http://www.alexa.com/siteinfo/sockshare.com")

aDom = DOM(url.download(cached=True))

vis = aDom.by_id("visitors-by-country")

countries = {}
for r in vis.by_class("tr1"):
 if r.by_tag("a")[0].attributes.get("id") == "toggleMoreCountryVisits":
   pass
 else:
   #print r.by_tag("a")[0].content
   country = r.by_tag("a")[0].content.split("&nbsp; ")[1].strip()
   pct = float(r.by_tag("p")[1].content[0:-1])
   print country, pct
   countries[country] = pct


import pprint

pprint.pprint(countries)

