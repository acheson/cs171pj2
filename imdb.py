from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import abs as abs_url
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import unescape

# define url for top 250 and retrieve it
url = URL("http://www.imdb.com/chart/top")
dom = DOM(url.download(cached=True))


# function for testing, gets movie dom for supplied url
def get_mov_dom(url):
    url = URL(url)
    return DOM(url.download(cached=True))

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


# function for getting genre
# takes dom for movie page as input
# returns a list of genres
def get_genre(d):
    genre_block = d.by_attribute(itemprop="genre")[0].by_tag("a")
    genre_list =[]
    genre = ""
    if len(genre_block) == 1:
        genre = genre_block[0].content[1:]
    else:
        for x in genre_block:
            genre_list.append(x.content[1:])
        genre = "; ".join(genre_list)
    return genre

# for some reason the wrong rating is getting fed through, this function gets the ratings page and the rating
def get_rating(url):
    url = URL(url)
    d = DOM(url.download(cached=True))
    return d.by_id('tn15content').by_tag("p")[0].content.split(" ")[0]
    
    #imdb.abs_url(abs_url(mov_dom.by_attribute(itemprop="aggregateRating")[0].by_tag("a")[11].attributes.get('href',''), base=murl.redirect or murl.string))[0].by_tag("a")[0].attributes.get('title','').split(",")[0]

# gets imdb details for each movie url fed to it, assigns them to the object supplied
def get_imdb_details(u, mov_obj, movie):
    mov_url = URL(u)
    mov_dom = DOM(mov_url.download(cached=True))
    
    #get year
    mov_obj[movie]['IMDB']['Year'] = mov_dom.by_class("header")[0].by_tag("a")[0].content

    # get directors
    mov_obj[movie]['IMDB']['Directors'] = get_directors(mov_dom)
    
    #get genre
    mov_obj[movie]['IMDB']['Genre'] = get_genre(mov_dom)
    
    #get poster
    mov_obj[movie]['IMDB']['ImageLink'] = mov_dom.by_id("img_primary").by_tag("img")[0].attributes.get('src','')

    # retrieves rating from seperate rating page, original page was not providing accurate ratings   
    ratings_url = abs_url(mov_dom.by_attribute(itemprop="aggregateRating")[0].by_tag("a")[11].attributes.get('href',''), base=URL(u).redirect or URL(u).string)
    rating = get_rating(ratings_url)
    mov_obj[movie]['IMDB']['RatingCount'] = rating



# gets top 250 movie list and builds movie dictionary with fed blank obj
def get_top250(obj):
    mov = dom.by_attribute(valign="top")
    for m in mov:
        for a in m.by_tag("a"):
            obj[unescape.unescape(a.content)]= { 'IMDB' : {}, '1channel': []}
            obj[unescape.unescape(a.content)]['IMDB']['url'] = abs_url(a.attributes.get('href',''), base=url.redirect or url.string)
    for t in obj:
        get_imdb_details(obj[t]['IMDB']['url'], obj, t)