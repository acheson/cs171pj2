from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import abs as abs_url
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import unescape

# define url for top 250 and retrieve it
url = URL("http://www.imdb.com/chart/top")
dom = DOM(url.download(cached=True))




# Function for getting directors
# takes dom for movie page as input
# Returns list of movie's directors
def get_directors(d):
    director_list = []
    director = ""
    director_block = d.by_id("overview-top").by_attribute(itemprop="director")
    if len(director_block) == 1:
        director = director_block[0].by_tag("span")[0].by_tag("a")[0].content
    else:
        for x in director_block[0].by_tag("span"):
            director_list.append(x.by_tag("a")[0].content)
        director = "; ".join(director_list)
    return director


# gets imdb details for each movie url fed to it, assigns them to the object supplied
def get_imdb_details(u, movie):
    mov_url = URL(u)
    mov_dom = DOM(mov_url.download(cached=True))
    movie['IMDB']['Year'] = mov_dom.by_class("header")[0].by_tag("a")[0].content
    movie['IMDB']['Directors'] = get_directors(mov_dom)
    # movie['IMDB']['RatingCount'] =
    # movie['IMDB']['Genre'] =
    # movie['IMDB']['ImageLink'] =

# gets top 250 movie list and builds movie dictionary with fed blank obj
def get_top250(obj):
    mov = dom.by_attribute(valign="top")
    for m in mov:
        for a in m.by_tag("a"):
            obj[unescape.unescape(a.content)]= { 'IMDB' : {}, '1channel': []}
            obj[a.content]['IMDB']['url'] = abs_url(a.attributes.get('href',''), base=url.redirect or url.string)
    for t in obj:
        get_imdb_details(obj[t]['IMDB']['url'], t)