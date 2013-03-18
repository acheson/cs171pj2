from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import abs as abs_url
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import urllib2, urlparse, socket
import re





# function generates search string with searched movie/show text
def get_search_string(search, proxy):
    url = URL("http://1channel.ch")
    dom = DOM(url.download(cached=False, timeout=20, proxy=proxy))
    a = dom.by_id("searchform")
    s_base = a.attributes.get("action")
    s_text = "_keywords=" + search.replace(" ","+")
    key = a.by_attribute(name="key")[0].attributes.get("value")
    s_section = a.by_attribute(name="search_section")[0].attributes.get("value")
    search_string = s_base + s_text + "&key=" + key + "&search_section=" + s_section
    return search_string



# function uses search string, movie title and movie year to
#  retrieve content page from 1channel.ch
def get_mov_link(search_url, mov_title, mov_year, proxy):
    mov_url = URL(search_url)
    try:
        mov_dom = DOM(mov_url.download(cached=False, timeout=20, proxy=proxy))    
    except Exception, e:
        print "Could not download search url: ", mov_url,'for reason:', e
    
    mov_ind = mov_dom.by_class("index_container")
    #print search_url
    #print mov_ind[0].by_class("index_item index_item_ie")[0]
    if mov_ind[0].by_class("info_message"):
        print mov_title, "not found"
        return None
    else:
        for r in mov_ind[0].by_class("index_item index_item_ie"):
            #grab the search results title
            res_title = r.by_tag("a")[0].attributes.get("title")

            #split out the year based on "(\d+)", assign title to res_t and year to res_y
            res_ts = re.search("Watch (.+)\s\((\d+)", res_title)
            res_t = res_ts.group(1)
            res_y = res_ts.group(2)
            print res_t, res_y, mov_title, mov_year
            if res_t.strip() == mov_title.strip() and res_y == mov_year:
                return abs_url(r.by_tag("a")[0].attributes.get("href"),base=url.redirect or url.string)


def get_host_ip(url, proxy):
    url =  urllib2.urlopen(url)
    return socket.gethostbyname(urlparse.urlparse(url.geturl()).netloc) 

# get the details from the content page, add them to the object
def get_mov_details(murl, m, proxy):
    murl = URL(murl)
    murl_dom = DOM(murl.download(cached=False, timeout=20, proxy=proxy))
    links = murl_dom.by_class('movie_version*')

    # initialize hosts dictionary
    hosts = {}

    #intiialize onechannel section of object
    m['1channel'] = {}

    # get link info by looping through all links on page
    for link in links:
        re_host = link.by_tag('td')[2].by_tag('script').content 
        host = re.search("document.writeln\(\'(.+)\'\);", re_host)
        hurl = host
        if host == 'HD Sponsor':
            hurl =  link.by_tag('td')[1].by_tag('a')[0].attributes.get('href','')
        # if host is in hosts dictionary, add
        if host in hosts:
            hosts[host] = get_host_ip(hurl)
            m['1channel'][host]['Views'] = 1
            m['1channel'][host]['NumLinks'] = 1
            m['1channel'][host]['IP'] = hosts[host]
            m['1channel'][host]['Location']= {}
        else:
            m['1channel'][host]['Views'] += 1
            m['1channel'][host]['NumLinks'] +=1
            m['1channel'][host]['IP'] = hosts[host]


# takes individual movie dictionary from movie object, proxy as input
# adds 1ch details to entry for obj
def get_1ch_details(m, proxy):
    s = get_search_string(m, proxy)
    get_mov_link(s, m, m['IMDB']['Year'], proxy)
